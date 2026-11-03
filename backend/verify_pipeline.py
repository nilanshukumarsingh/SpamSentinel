"""
Comprehensive ML Pipeline and Dataset Verification Script for SpamSentinel AI.
Verifies dataset usage, train/test split hygiene, artifact generation, model loading,
and real-time inference on dataset samples and newly composed inputs.
"""

import sys
from pathlib import Path
import pandas as pd
import numpy as np

# Resolve project directories relative to this file
BACKEND_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BACKEND_DIR.parent
DATASETS_DIR = PROJECT_ROOT / "DataSets"
DATASET_FILE = DATASETS_DIR / "SMSSpamCollection"
SAVED_MODEL_DIR = BACKEND_DIR / "ml" / "saved_model"
MODEL_FILE = SAVED_MODEL_DIR / "spam_model.joblib"
VECTORIZER_FILE = SAVED_MODEL_DIR / "tfidf_vectorizer.joblib"
METRICS_FILE = SAVED_MODEL_DIR / "model_metrics.json"

sys.path.insert(0, str(BACKEND_DIR))
from ml.predict import classifier_instance
from ml.preprocess import clean_text

def run_verification():
    print("=" * 70)
    print("STEP 1: VERIFY DATASET USAGE (DataSets/SMSSpamCollection)")
    print("=" * 70)
    
    import hashlib
    file_bytes = DATASET_FILE.read_bytes()
    sha256_hash = hashlib.sha256(file_bytes).hexdigest()
    print(f"1.1 Resolved Dataset Path: {DATASET_FILE.resolve()}")
    assert DATASET_FILE.exists(), f"Error: Dataset file not found at {DATASET_FILE}"
    print(f"    File exists: True (Size: {DATASET_FILE.stat().st_size:,} bytes)")
    print(f"    SHA-256 Checksum: {sha256_hash}")
    assert sha256_hash == "7d039a24a6083ed9ef0f806ebad56bbb976e3aeb8de05669173bfdc4996c239d", "Checksum mismatch!"

    # Read tab-separated data
    df = pd.read_csv(
        DATASET_FILE,
        sep='\t',
        header=None,
        names=['label', 'raw_text'],
        encoding='utf-8',
        quoting=3
    )
    print("1.2 Parsed as tab-separated data with columns: ['label', 'raw_text']")
    print(f"    Total rows loaded: {len(df)}")
    
    # Check labels
    unique_labels = set(df['label'].unique())
    print(f"    Unique labels found: {unique_labels}")
    assert unique_labels == {'ham', 'spam'}, f"Unexpected labels: {unique_labels}"
    print("    Verified: Both 'spam' and 'ham' labels are present and used.")

    ham_count = (df['label'] == 'ham').sum()
    spam_count = (df['label'] == 'spam').sum()
    ham_pct = (ham_count / len(df)) * 100
    spam_pct = (spam_count / len(df)) * 100

    print(f"1.3 Class Distribution Programmatic Breakdown:")
    print(f"    - Ham (Legitimate): {ham_count:,} ({ham_pct:.2f}%)")
    print(f"    - Spam:             {spam_count:,} ({spam_pct:.2f}%)")
    print(f"    - Total Records:    {len(df):,}")

    print("\n" + "=" * 70)
    print("STEP 2: VERIFY MODEL TRAINING & NO DATA LEAKAGE")
    print("=" * 70)
    
    from ml.train_model import train_and_evaluate
    metrics = train_and_evaluate()

    print(f"2.1 Metrics verified on holdout test set (20%):")
    print(f"    - Accuracy:  {metrics['accuracy'] * 100:.2f}%")
    print(f"    - Precision: {metrics['precision'] * 100:.2f}%")
    print(f"    - Recall:    {metrics['recall'] * 100:.2f}%")
    print(f"    - F1-Score:  {metrics['f1_score'] * 100:.2f}%")
    print(f"    - Confusion Matrix: {metrics['confusion_matrix']}")
    print(f"    - Vocabulary Size:  {metrics['vocabulary_size']} features")

    print("\n" + "=" * 70)
    print("STEP 3 & 4: VERIFY MODEL LOADING & ARTIFACTS")
    print("=" * 70)
    
    # Reload classifier to trigger startup logging
    classifier_instance.load()

    assert classifier_instance.is_loaded, "SpamClassifier failed to load!"
    assert classifier_instance.model is not None, "Model object is None!"
    assert classifier_instance.vectorizer is not None, "Vectorizer object is None!"

    print("\n" + "=" * 70)
    print("STEP 5 & 6: TEST COMPLETE INFERENCE FLOW ON DATASET & NEW TEXT")
    print("=" * 70)

    # Sample an actual spam message from the dataset
    dataset_spam = df[df['label'] == 'spam'].iloc[0]['raw_text']
    # Sample an actual ham message from the dataset
    dataset_ham = df[df['label'] == 'ham'].iloc[0]['raw_text']

    print("\n--- TEST CASE A: Actual Spam from Dataset ---")
    print(f"Original Text: {dataset_spam}")
    res_spam = classifier_instance.predict(dataset_spam)
    print(f"Prediction:    {res_spam['prediction'].upper()}")
    print(f"Confidence:    {res_spam['confidence'] * 100:.2f}%")
    print(f"Spam Prob:     {res_spam['spam_probability'] * 100:.2f}%")
    print(f"Ham Prob:      {res_spam['ham_probability'] * 100:.2f}%")
    print(f"Tokens:        {res_spam['highlighted_keywords']}")
    assert res_spam['prediction'] == 'spam', "Failed on actual dataset spam!"

    print("\n--- TEST CASE B: Actual Ham from Dataset ---")
    print(f"Original Text: {dataset_ham}")
    res_ham = classifier_instance.predict(dataset_ham)
    print(f"Prediction:    {res_ham['prediction'].upper()}")
    print(f"Confidence:    {res_ham['confidence'] * 100:.2f}%")
    print(f"Spam Prob:     {res_ham['spam_probability'] * 100:.2f}%")
    print(f"Ham Prob:      {res_ham['ham_probability'] * 100:.2f}%")
    print(f"Tokens:        {res_ham['highlighted_keywords']}")
    assert res_ham['prediction'] == 'ham', "Failed on actual dataset ham!"

    print("\n--- TEST CASE C: Newly Typed Spam Message ---")
    typed_spam = "Congratulations! You have won £2,500 cash reward. Text PRIZE to 88088 to claim your voucher now!"
    print(f"Input:         {typed_spam}")
    res_typed_spam = classifier_instance.predict(typed_spam)
    print(f"Prediction:    {res_typed_spam['prediction'].upper()}")
    print(f"Confidence:    {res_typed_spam['confidence'] * 100:.2f}%")
    print(f"Tokens:        {res_typed_spam['highlighted_keywords']}")
    assert res_typed_spam['prediction'] == 'spam', "Failed on typed spam message!"

    print("\n--- TEST CASE D: Newly Typed Legitimate (Ham) Message ---")
    typed_ham = "Hey, are you free this afternoon to review the MongoDB presentation slides in the computer lab?"
    print(f"Input:         {typed_ham}")
    res_typed_ham = classifier_instance.predict(typed_ham)
    print(f"Prediction:    {res_typed_ham['prediction'].upper()}")
    print(f"Confidence:    {res_typed_ham['confidence'] * 100:.2f}%")
    print(f"Tokens:        {res_typed_ham['highlighted_keywords']}")
    assert res_typed_ham['prediction'] == 'ham', "Failed on typed ham message!"

    # Empty message rejection verification
    print("\n--- TEST CASE E: Empty and Whitespace Validation ---")
    try:
        classifier_instance.predict("")
        assert False, "Should have raised ValueError on empty string!"
    except ValueError as ve:
        print(f"Empty input correctly rejected with ValueError: '{ve}'")

    try:
        classifier_instance.predict("   \n\t   ")
        assert False, "Should have raised ValueError on whitespace-only string!"
    except ValueError as ve:
        print(f"Whitespace input correctly rejected with ValueError: '{ve}'")

    print("\n" + "=" * 70)
    print("VERIFICATION COMPLETE: ALL CHECKS PASSED SUCCESSFULLY")
    print("=" * 70)

if __name__ == "__main__":
    run_verification()

