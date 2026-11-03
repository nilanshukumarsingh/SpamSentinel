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
        1. Query MongoDB Whitelist
        2. Perform ML feature extraction and inference
        3. Insert message into MongoDB 'messages' collection
        4. Return formatted response
        """
        # Step 1: Whitelist Check
        whitelist_match = cls.check_whitelist(text, sender)
        
        if whitelist_match:
            prediction = "ham"
            confidence = 1.00
            prob_spam = 0.00
            prob_ham = 1.00
            status = "whitelisted"
            keywords = ["whitelisted_override"]
        else:
            # Step 2: ML Inference
            ml_res = classifier_instance.predict(text)
            prediction = ml_res["prediction"]
            confidence = ml_res["confidence"]
            prob_spam = ml_res["spam_probability"]
            prob_ham = ml_res["ham_probability"]
            keywords = ml_res.get("highlighted_keywords", [])
            status = "unreviewed"

        # Step 3: MongoDB Document Insertion (PyMongo create operation)
        now = datetime.now(timezone.utc)
        doc = {
            "text": text,
            "sender": sender,
            "prediction": prediction,
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
