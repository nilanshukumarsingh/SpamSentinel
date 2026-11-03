"""
Whitelist Router for SpamSentinel AI.
Allows administrators and users to maintain approved senders, keywords, and domain patterns.
"""

from datetime import datetime, timezone
from typing import List
from bson import ObjectId
from fastapi import APIRouter, HTTPException, status
from pymongo.errors import DuplicateKeyError

from ..database import db_manager, format_doc
from ..models.whitelist import WhitelistCreate, WhitelistResponse

router = APIRouter(prefix="/api/whitelist", tags=["Whitelist"])

@router.get("", response_model=List[WhitelistResponse])
def get_whitelist():
    """List all active whitelist rules ordered by creation date."""
    col = db_manager.get_collection("whitelist")
    cursor = col.find().sort("created_at", -1)
    return [format_doc(doc) for doc in cursor]

@router.post("", response_model=WhitelistResponse, status_code=status.HTTP_201_CREATED)
def add_whitelist_rule(payload: WhitelistCreate):
    """
    Add a new approved sender, keyword, or phrase rule into MongoDB.
    Demonstrates PyMongo insert_one() with unique constraint handling.
    """
    col = db_manager.get_collection("whitelist")
    cleaned_value = payload.value.strip().lower()

    doc = {
        "value": cleaned_value,
        "type": payload.type,
        "note": payload.note or f"Approved {payload.type}",
        "created_at": datetime.now(timezone.utc)
    }

    try:
        res = col.insert_one(doc)
        doc["_id"] = res.inserted_id
        return format_doc(doc)
    except DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Rule with value '{cleaned_value}' already exists in whitelist."
        )

@router.delete("/{id}", status_code=status.HTTP_200_OK)
def remove_whitelist_rule(id: str):
    """Remove a whitelist rule from MongoDB."""
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid MongoDB ObjectId format.")

    col = db_manager.get_collection("whitelist")
    res = col.delete_one({"_id": ObjectId(id)})

    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Whitelist rule not found.")

    return {"message": "Whitelist entry removed successfully.", "id": id}

