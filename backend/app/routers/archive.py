"""
Archive Router for SpamSentinel AI.
Manages spam message isolation, status transitions to 'archived', and bulk purge operations.
"""

from datetime import datetime, timezone
from typing import Optional, List
from bson import ObjectId
from fastapi import APIRouter, HTTPException, Query, status

from ..database import db_manager, format_doc
from ..models.message import MessageResponse, MessageListResponse

router = APIRouter(prefix="/api/archive", tags=["Archive"])

@router.get("", response_model=MessageListResponse)
def get_archived_messages(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = Query(None)
):
    """
    Retrieve all messages marked as 'archived'.
    """
    col = db_manager.get_collection("messages")
    query = {"status": "archived"}

    if search and search.strip():
        regex_pattern = {"$regex": search.strip(), "$options": "i"}
        query["$or"] = [
            {"text": regex_pattern},
            {"sender": regex_pattern}
        ]

    total_count = col.count_documents(query)
    total_pages = max(1, (total_count + limit - 1) // limit)
    skip = (page - 1) * limit

    cursor = col.find(query).sort("updated_at", -1).skip(skip).limit(limit)
    messages = [format_doc(doc) for doc in cursor]

    return {
        "total": total_count,
        "page": page,
        "limit": limit,
        "total_pages": total_pages,
        "messages": messages
    }

@router.post("/{id}", response_model=MessageResponse)
def archive_message(id: str):
    """
    Move a message into the Archive folder.
    Updates document status: 'archived'.
    """
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid MongoDB ObjectId format.")

    col = db_manager.get_collection("messages")
    now = datetime.now(timezone.utc)

    updated = col.find_one_and_update(
        {"_id": ObjectId(id)},
        {"$set": {"status": "archived", "updated_at": now}},
        return_document=True
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Message not found.")

    return format_doc(updated)

@router.post("/restore/{id}", response_model=MessageResponse)
def restore_archived_message(id: str):
    """
    Restore an archived message back to 'unreviewed' status.
    """
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid MongoDB ObjectId format.")

    col = db_manager.get_collection("messages")
    now = datetime.now(timezone.utc)

    updated = col.find_one_and_update(
        {"_id": ObjectId(id)},
        {"$set": {"status": "unreviewed", "updated_at": now}},
        return_document=True
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Message not found.")

    return format_doc(updated)

@router.delete("/{id}", status_code=status.HTTP_200_OK)
def delete_archived_message(id: str):
    """Permanently delete an archived document from MongoDB."""
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid MongoDB ObjectId format.")

    col = db_manager.get_collection("messages")
    res = col.delete_one({"_id": ObjectId(id), "status": "archived"})

    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Archived message not found.")

    return {"message": "Archived message permanently removed.", "id": id}

@router.delete("/purge/all", status_code=status.HTTP_200_OK)
def purge_all_spam_or_archived(target: str = Query("archived", description="'archived' or 'all_spam'")):
    """
    Implements SRS requirement: "Empty Spam Folder".
    Demonstrates PyMongo delete_many() operation.
    """
    col = db_manager.get_collection("messages")
    if target == "all_spam":
        filter_criteria = {"prediction": "spam"}
    else:
        filter_criteria = {"status": "archived"}

    res = col.delete_many(filter_criteria)
    return {
        "message": f"Purge completed. Removed {res.deleted_count} messages.",
        "deleted_count": res.deleted_count
    }

