"""
Machine Learning Training Pipeline for SpamSentinel AI.
Downloads UCI SMS Spam Collection dataset, trains TF-IDF + Multinomial Naive Bayes model,
evaluates actual performance metrics, and saves the trained model artifacts.
"""

import os
import io
import json
import zipfile
import hashlib
import urllib.request
from pathlib import Path
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, classification_report
import joblib

try:
    from ml.preprocess import clean_text
except (ImportError, ValueError):
    try:
        from .preprocess import clean_text
    except (ImportError, ValueError):
        from preprocess import clean_text

UCI_DATASET_URL = "https://archive.ics.uci.edu/static/public/228/sms+spam+collection.zip"

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
SAVED_MODEL_DIR = BASE_DIR / "ml" / "saved_model"

USER_DATASET_FILE = BASE_DIR.parent / "DataSets" / "SMSSpamCollection"
RAW_DATASET_FILE = DATA_DIR / "SMSSpamCollection"
CLEANED_DATASET_FILE = DATA_DIR / "sms_spam_collection.csv"

MODEL_FILE = SAVED_MODEL_DIR / "spam_model.joblib"
VECTORIZER_FILE = SAVED_MODEL_DIR / "tfidf_vectorizer.joblib"
METRICS_FILE = SAVED_MODEL_DIR / "model_metrics.json"

def download_dataset() -> Path:
    """Check user-provided DataSets directory or download dataset if not present."""
    if USER_DATASET_FILE.exists():
        print(f"Verified dataset found in user directory: {USER_DATASET_FILE}")
        return USER_DATASET_FILE

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if RAW_DATASET_FILE.exists():
        print(f"Dataset already exists at: {RAW_DATASET_FILE}")
        return RAW_DATASET_FILE

    print(f"Downloading official UCI dataset from {UCI_DATASET_URL}...")
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
    req = urllib.request.Request(UCI_DATASET_URL, headers=headers)
    with urllib.request.urlopen(req, timeout=30) as resp:
        zip_bytes = resp.read()

    with zipfile.ZipFile(io.BytesIO(zip_bytes)) as z:
        z.extract("SMSSpamCollection", path=DATA_DIR)

    print(f"Successfully extracted dataset to: {RAW_DATASET_FILE}")
    return RAW_DATASET_FILE

def load_and_preprocess_data(dataset_path: Path) -> pd.DataFrame:
    """Load dataset, clean text and encode labels."""
    df = pd.read_csv(
        dataset_path,
        sep='\t',
        header=None,
        names=['label', 'raw_text'],
        encoding='utf-8',
        quoting=3  # quote none to handle raw quotes
    )

    df = df.dropna(subset=['raw_text', 'label'])
    df['cleaned_text'] = df['raw_text'].apply(clean_text)
    # Binary label: 1 for spam, 0 for ham
    df['target'] = df['label'].map({'ham': 0, 'spam': 1})

    # Save cleaned CSV for reference
    df.to_csv(CLEANED_DATASET_FILE, index=False)
    print(f"Total dataset records: {len(df)}")
    print(f"Spam count: {(df['target'] == 1).sum()} | Ham count: {(df['target'] == 0).sum()}")
    return df

def train_and_evaluate():
    """Train TF-IDF + MultinomialNB classifier and save metrics with full dataset metadata."""
    SAVED_MODEL_DIR.mkdir(parents=True, exist_ok=True)

    dataset_path = download_dataset()
    dataset_sha256 = hashlib.sha256(dataset_path.read_bytes()).hexdigest()
    dataset_size_bytes = dataset_path.stat().st_size
    print(f"Dataset SHA-256 Checksum: {dataset_sha256}")
    print(f"Dataset Size on disk:     {dataset_size_bytes} bytes")

    df = load_and_preprocess_data(dataset_path)

    # Stratified train-test split (80% train, 20% test)
    X_train, X_test, y_train, y_test = train_test_split(
        df['cleaned_text'],
        df['target'],
        test_size=0.20,
        random_state=42,
        stratify=df['target']
    )

    print(f"Training set: {len(X_train)} samples | Test set: {len(X_test)} samples")

    # Vectorize text with sublinear TF and n-grams
    vectorizer = TfidfVectorizer(
        max_features=5000,
        ngram_range=(1, 2),
        stop_words='english',
        sublinear_tf=True
    )

    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)

    # Train Multinomial Naive Bayes model
    classifier = MultinomialNB(alpha=0.1)
    classifier.fit(X_train_vec, y_train)

    # Evaluation
    y_pred = classifier.predict(X_test_vec)
    y_proba = classifier.predict_proba(X_test_vec)[:, 1]

    acc = float(accuracy_score(y_test, y_pred))
    prec = float(precision_score(y_test, y_pred, zero_division=0))
    rec = float(recall_score(y_test, y_pred, zero_division=0))
    f1 = float(f1_score(y_test, y_pred, zero_division=0))
    cm = confusion_matrix(y_test, y_pred).tolist()

    report = classification_report(y_test, y_pred, target_names=['Ham', 'Spam'], output_dict=True)

    metrics = {
        "dataset_name": "UCI SMS Spam Collection",
        "dataset_metadata": {
            "resolved_path": str(dataset_path.resolve()),
            "sha256_checksum": dataset_sha256,
            "file_size_bytes": dataset_size_bytes,
            "total_records": len(df),
            "ham_count": int((df['target'] == 0).sum()),
            "spam_count": int((df['target'] == 1).sum()),
            "ham_percentage": round(float((df['target'] == 0).sum() / len(df) * 100), 2),
            "spam_percentage": round(float((df['target'] == 1).sum() / len(df) * 100), 2),
        },
        "training_configuration": {
            "test_split_ratio": 0.20,
            "random_state": 42,
            "stratified": True,
            "vectorizer": {
                "algorithm": "TfidfVectorizer",
                "max_features": 5000,
                "ngram_range": [1, 2],
                "stop_words": "english",
                "sublinear_tf": True
            },
            "classifier": {
                "algorithm": "MultinomialNB",
                "alpha": 0.1
            }
        },
        "dataset_size": len(df),
        "train_size": len(X_train),
        "test_size": len(X_test),
        "ham_count": int((df['target'] == 0).sum()),
        "spam_count": int((df['target'] == 1).sum()),
        "model_architecture": "TF-IDF + Multinomial Naive Bayes",
        "accuracy": round(acc, 4),
        "precision": round(prec, 4),
        "recall": round(rec, 4),
        "f1_score": round(f1, 4),
        "confusion_matrix": {
            "true_negative_ham": cm[0][0],
            "false_positive_spam": cm[0][1],
            "false_negative_ham": cm[1][0],
            "true_positive_spam": cm[1][1]
        },
        "vocabulary_size": len(vectorizer.vocabulary_),
        "classification_report": report
    }

    print("\n========== MODEL EVALUATION REPORT ==========")
    print(f"Accuracy:  {acc * 100:.2f}%")
    print(f"Precision: {prec * 100:.2f}%")
    print(f"Recall:    {rec * 100:.2f}%")
    print(f"F1-Score:  {f1 * 100:.2f}%")
    print("Confusion Matrix (TN, FP / FN, TP):", cm)
    print("=============================================\n")

    # Save artifacts
    joblib.dump(classifier, MODEL_FILE)
    joblib.dump(vectorizer, VECTORIZER_FILE)
    with open(METRICS_FILE, "w", encoding="utf-8") as f:
        json.dump(metrics, f, indent=2)

    print(f"Artifacts saved to {SAVED_MODEL_DIR}")
    return metrics

if __name__ == "__main__":
    train_and_evaluate()
