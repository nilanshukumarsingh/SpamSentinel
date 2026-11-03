"""
Detection Router for SpamSentinel AI.
Endpoints for single and batch message classification and logging to MongoDB.
"""

from typing import List, Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from ..models.message import MessageDetectRequest, MessageResponse
from ..services.spam_detector import SpamDetectionService
from ..database import db_manager, format_doc
from datetime import datetime, timezone

router = APIRouter(prefix="/api/detect", tags=["Detection"])

class BatchDetectRequest(BaseModel):
    messages: List[str] = Field(..., max_length=20, description="List of messages to classify simultaneously")

@router.post("", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def detect_message(payload: MessageDetectRequest):
    """
    Main Spam Classification Endpoint:
    1. Validates input text
    2. Consults MongoDB Whitelist
    3. Runs TF-IDF + Multinomial Naive Bayes Model
    4. Records document in MongoDB messages collection
    5. Returns prediction, confidence, and metadata
    """
    try:
        result = SpamDetectionService.detect_and_store(
            text=payload.text,
            sender=payload.sender,
            source=payload.source or "manual"
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference error: {str(e)}"
        )

@router.post("/batch", response_model=List[MessageResponse])
def detect_batch_messages(payload: BatchDetectRequest):
    """Classify multiple messages in a single batch."""
    results = []
    for msg in payload.messages:
        if msg.strip():
            res = SpamDetectionService.detect_and_store(text=msg, source="batch")
            results.append(res)
    return results

@router.post("/seed-samples")
def seed_sample_records():
    """
    Seeds initial realistic demonstration records into MongoDB if collection is sparse.
    Useful for evaluation demonstration.
    """
    col = db_manager.get_collection("messages")
    if col.count_documents({}) >= 6:
        return {"message": "Database already contains messages. Seeding skipped."}

    sample_items = [
        ("Congratulations! You've won a £1,000 cash prize or a £2,000 holiday! Call 0906121 to claim your reward now! Terms apply.", "+447911123456", "manual"),
        ("Hey, are we still meeting up for project discussion at the college library at 3 PM?", "Aarav Sharma", "manual"),
        ("URGENT: Your bank account access has been suspended due to unauthorized activity. Verify your identity at http://bank-secure-login.xyz", "Alerts-Desk", "manual"),
        ("Sounds good! I will finish the MongoDB aggregation pipeline slides and bring my laptop.", "Priya Patel", "manual"),
        ("WINNER! You were selected for a $500 Amazon Gift Voucher. Click here: http://claim-voucher.online code #89021", "+18005550199", "manual"),
        ("Please review the attached project SRS document and let me know if we need any updates before tomorrow's review.", "Prof. Sharma", "manual"),
    ]

    inserted = []
    for text, sender, source in sample_items:
        res = SpamDetectionService.detect_and_store(text=text, sender=sender, source=source)
        inserted.append(res["id"])

    return {"message": f"Successfully seeded {len(inserted)} sample messages into MongoDB.", "ids": inserted}

