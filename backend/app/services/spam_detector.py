"""
Spam Detection Service for SpamSentinel AI.
Integrates Whitelist lookup, Machine Learning inference, and MongoDB storage via PyMongo.
"""

from datetime import datetime, timezone
from typing import Dict, Any, Optional
from bson import ObjectId
import pymongo

from ..database import db_manager, format_doc
from ml.predict import classifier_instance

class SpamDetectionService:
    @staticmethod
    def check_whitelist(text: str, sender: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """
        Check if sender or text matches an entry in the MongoDB 'whitelist' collection.
        Demonstrates PyMongo query with regex / equality.
        """
        try:
            col = db_manager.get_collection("whitelist")
            
            # Check sender match
            if sender:
                match_sender = col.find_one({"value": sender.strip().lower(), "type": "sender"})
                if match_sender:
                    return {"matched": True, "reason": f"Sender '{sender}' is in approved Whitelist"}

            # Check keyword / phrase match inside text
            # Find all keyword rules
            rules = list(col.find({"type": {"$in": ["keyword", "phrase", "domain"]}}))
            text_lower = text.lower()
            for r in rules:
                val = r.get("value", "").lower()
                if val and val in text_lower:
                    return {"matched": True, "reason": f"Contains whitelisted pattern: '{val}'"}

            return None
        except Exception as e:
            print(f"Whitelist check warning: {e}")
            return None

    @classmethod
    def detect_and_store(cls, text: str, sender: Optional[str] = None, source: str = "manual") -> Dict[str, Any]:
        """
        End-to-End detection flow:
        1. Reject empty or whitespace inputs
        2. Run ML feature extraction & inference for transparency
        3. Check MongoDB Whitelist overrides
        4. Insert message into MongoDB 'messages' collection
        5. Return formatted response distinguishing ML prediction from whitelist decision
        """
        if not text or not text.strip():
            raise ValueError("Message text cannot be empty or contain only whitespace.")

        # Step 1: Execute ML Model Inference
        ml_res = classifier_instance.predict(text)
        model_prediction = ml_res["prediction"]
        prob_spam = ml_res["spam_probability"]
        prob_ham = ml_res["ham_probability"]
        keywords = ml_res.get("highlighted_keywords", [])

        # Step 2: Check Whitelist Override Rules
        whitelist_match = cls.check_whitelist(text, sender)
        
        if whitelist_match:
            prediction = "ham"  # Final effective classification
            confidence = 1.00
            classification_source = "whitelist"
            status = "whitelisted"
            whitelist_reason = whitelist_match.get("reason", "Approved in Whitelist")
        else:
            prediction = model_prediction
            confidence = ml_res["confidence"]
            classification_source = "ml_model"
            status = "unreviewed"
            whitelist_reason = None

        # Step 3: MongoDB Document Insertion (PyMongo create operation)
        now = datetime.now(timezone.utc)
        doc = {
            "text": text,
            "sender": sender,
            "prediction": prediction,
            "model_prediction": model_prediction,
            "classification_source": classification_source,
            "whitelist_reason": whitelist_reason,
            "confidence": confidence,
            "spam_probability": prob_spam,
            "ham_probability": prob_ham,
            "highlighted_keywords": keywords,
            "status": status,
            "source": source,
            "created_at": now,
            "updated_at": now
        }

        col = db_manager.get_collection("messages")
        insert_result = col.insert_one(doc)
        doc["_id"] = insert_result.inserted_id

        # Step 4: Return JSON formatted object
        return format_doc(doc)
