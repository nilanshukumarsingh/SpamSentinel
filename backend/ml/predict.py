"""
Inference Module for SpamSentinel AI.
Loads the trained TF-IDF vectorizer and Multinomial Naive Bayes model
to classify new text messages with calculated confidence scores.
"""

import json
from pathlib import Path
from typing import Dict, Any, List
import joblib

try:
    from .preprocess import clean_text
except (ImportError, ValueError):
    from ml.preprocess import clean_text

BASE_DIR = Path(__file__).resolve().parent.parent
SAVED_MODEL_DIR = BASE_DIR / "ml" / "saved_model"
MODEL_FILE = SAVED_MODEL_DIR / "spam_model.joblib"
VECTORIZER_FILE = SAVED_MODEL_DIR / "tfidf_vectorizer.joblib"
METRICS_FILE = SAVED_MODEL_DIR / "model_metrics.json"

class SpamClassifier:
    def __init__(self):
        self.model = None
        self.vectorizer = None
        self.metrics = None
        self.is_loaded = False
        self.load()

    def load(self):
        """Load trained artifacts from disk with detailed diagnostic logging."""
        model_exists = MODEL_FILE.exists()
        vectorizer_exists = VECTORIZER_FILE.exists()

        print(f"\n================ MODEL STARTUP VERIFICATION ================")
        print(f"Model file path:       {MODEL_FILE.resolve()}")
        print(f"Vectorizer file path:  {VECTORIZER_FILE.resolve()}")
        print(f"Model file exists:     {model_exists}")
        print(f"Vectorizer exists:     {vectorizer_exists}")

        if model_exists and vectorizer_exists:
            try:
                self.model = joblib.load(MODEL_FILE)
                self.vectorizer = joblib.load(VECTORIZER_FILE)
                self.is_loaded = True
                if METRICS_FILE.exists():
                    with open(METRICS_FILE, "r", encoding="utf-8") as f:
                        self.metrics = json.load(f)
                print(f"Model loading success: True (Loaded {type(self.model).__name__} & {type(self.vectorizer).__name__})")
            except Exception as e:
                self.is_loaded = False
                print(f"Model loading success: False (Error: {e})")
        else:
            self.is_loaded = False
            print("Model loading success: False (Required model artifacts missing on disk)")
        print(f"============================================================\n")

    def predict(self, raw_text: str) -> Dict[str, Any]:
        """
        Predict whether a raw message is spam or ham.
        Calculates exact confidence score from predict_proba.
        Rejects empty or whitespace-only inputs with ValueError.
        """
        if not self.is_loaded or self.model is None or self.vectorizer is None:
            raise RuntimeError("Model is not loaded. Train the model first using train_model.py")

        if not raw_text or not raw_text.strip():
            raise ValueError("Message text cannot be empty or contain only whitespace.")

        cleaned = clean_text(raw_text)
        if not cleaned:
            raise ValueError("Message text contains no extractable words or valid characters.")

        vec = self.vectorizer.transform([cleaned])
        probabilities = self.model.predict_proba(vec)[0]  # [prob_ham, prob_spam]
        prob_ham = float(probabilities[0])
        prob_spam = float(probabilities[1])

        if prob_spam >= 0.50:
            prediction = "spam"
            confidence = prob_spam
        else:
            prediction = "ham"
            confidence = prob_ham

        # Extract recognized vocabulary tokens ranked by Naive Bayes log-odds impact
        detected_keywords = self._extract_keywords(cleaned)

        return {
            "prediction": prediction,
            "confidence": round(confidence, 4),
            "spam_probability": round(prob_spam, 4),
            "ham_probability": round(prob_ham, 4),
            "cleaned_text": cleaned,
            "highlighted_keywords": detected_keywords
        }

    def _extract_keywords(self, cleaned_text: str) -> List[str]:
        """
        Extract recognized vocabulary tokens present in the input message.
        Ranks tokens based on the Multinomial Naive Bayes log-likelihood ratio:
        log P(token | Spam) - log P(token | Ham).
        Positive values indicate greater association with spam messages.
        """
        words = list(set(cleaned_text.split()))
        vocab = self.vectorizer.vocabulary_
        tokens = [w for w in words if w in vocab and len(w) > 1]
        
        if not tokens:
            return []

        try:
            # Feature log-probabilities from MultinomialNB: shape (2, n_features)
            # Class 0: Ham, Class 1: Spam
            log_prob_ham = self.model.feature_log_prob_[0]
            log_prob_spam = self.model.feature_log_prob_[1]

            def token_spam_affinity(tok: str) -> float:
                idx = vocab[tok]
                return float(log_prob_spam[idx] - log_prob_ham[idx])

            tokens.sort(key=token_spam_affinity, reverse=True)
        except Exception:
            tokens.sort(key=lambda x: len(x), reverse=True)

        return tokens[:10]

    def get_metrics(self) -> Dict[str, Any]:
        """Return benchmark metrics calculated during training."""
        return self.metrics or {}

# Global singleton instance
classifier_instance = SpamClassifier()
