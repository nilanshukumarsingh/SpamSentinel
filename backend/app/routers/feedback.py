"""
Feedback Router for SpamSentinel AI.
Stores human-in-the-loop corrections in MongoDB for false-positive auditing.
"""

from datetime import datetime, timezone
from typing import List
from bson import ObjectId
from fastapi import APIRouter, HTTPException, status

from ..database import db_manager, format_doc
from ..models.feedback import FeedbackCreate, FeedbackResponse

router = APIRouter(prefix="/api/feedback", tags=["Feedback"])

@router.post("", response_model=FeedbackResponse, status_code=status.HTTP_201_CREATED)
def submit_feedback(payload: FeedbackCreate):
    """
    Submit user feedback on an inaccurate classification.
    Inserts record into 'feedback' collection and updates the message status.
    """
    if not ObjectId.is_valid(payload.message_id):
        raise HTTPException(status_code=400, detail="Invalid message_id format.")

    messages_col = db_manager.get_collection("messages")
    msg = messages_col.find_one({"_id": ObjectId(payload.message_id)})
    if not msg:
        raise HTTPException(status_code=404, detail="Referenced message not found.")

    # Record feedback
    feedback_col = db_manager.get_collection("feedback")
    now = datetime.now(timezone.utc)
    feedback_doc = {
        "message_id": payload.message_id,
        "actual_label": payload.actual_label,
        "predicted_label": payload.predicted_label,
        "feedback": payload.feedback or "Reported by user",
        "created_at": now
    }
    insert_res = feedback_col.insert_one(feedback_doc)
    feedback_doc["_id"] = insert_res.inserted_id

    # If user marked false positive (actual is ham, but predicted was spam), mark message as whitelisted
    if payload.actual_label == "ham" and payload.predicted_label == "spam":
        messages_col.update_one(
            {"_id": ObjectId(payload.message_id)},
            {"$set": {"status": "whitelisted", "updated_at": now}}
        )

    return format_doc(feedback_doc)

@router.get("", response_model=List[FeedbackResponse])
def get_all_feedback():
    """Retrieve all submitted user feedback reports."""
    feedback_col = db_manager.get_collection("feedback")
    cursor = feedback_col.find().sort("created_at", -1).limit(50)
    return [format_doc(doc) for doc in cursor]

