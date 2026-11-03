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
        """Load trained artifacts from disk."""
        if MODEL_FILE.exists() and VECTORIZER_FILE.exists():
            self.model = joblib.load(MODEL_FILE)
            self.vectorizer = joblib.load(VECTORIZER_FILE)
            self.is_loaded = True
            if METRICS_FILE.exists():
                with open(METRICS_FILE, "r", encoding="utf-8") as f:
                    self.metrics = json.load(f)
            print("SpamClassifier artifacts loaded successfully.")
        else:
            print("Model artifacts not found. Model training required.")
            self.is_loaded = False

    def predict(self, raw_text: str) -> Dict[str, Any]:
        """
        Predict whether a raw message is spam or ham.
        Calculates exact confidence score from predict_proba.
        """
        if not self.is_loaded or self.model is None or self.vectorizer is None:
            raise RuntimeError("Model is not loaded. Train the model first using train_model.py")

        cleaned = clean_text(raw_text)
        if not cleaned:
            # Empty or whitespace only
            return {
                "prediction": "ham",
                "confidence": 0.50,
                "spam_probability": 0.50,
                "ham_probability": 0.50,
                "cleaned_text": "",
                "highlighted_keywords": []
            }

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

        # Extract salient spam keywords present in the text
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
        """Identify vocabulary tokens in the message that contributed to the classification."""
        words = set(cleaned_text.split())
        vocab = self.vectorizer.vocabulary_
        found_tokens = [w for w in words if w in vocab and len(w) > 2]
        # Return unique top tokens
        return found_tokens[:10]

    def get_metrics(self) -> Dict[str, Any]:
        """Return benchmark metrics calculated during training."""
        return self.metrics or {}

# Global singleton instance
classifier_instance = SpamClassifier()
