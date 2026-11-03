"""
Messages Router for SpamSentinel AI.
Performs PyMongo CRUD operations: List, Search, Filter, Get by ID, Update Status, and Delete.
"""

from datetime import datetime, timezone
from typing import Optional, List
from bson import ObjectId
from fastapi import APIRouter, HTTPException, Query, status

from ..database import db_manager, format_doc
from ..models.message import MessageResponse, MessageListResponse, MessageStatusUpdate

router = APIRouter(prefix="/api/messages", tags=["Messages"])

@router.get("", response_model=MessageListResponse)
def get_messages(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    prediction: Optional[str] = Query(None, description="Filter by prediction (spam, ham)"),
    status: Optional[str] = Query(None, description="Filter by status (unreviewed, archived, whitelisted)"),
    search: Optional[str] = Query(None, description="Search keyword in text or sender"),
    sort_order: int = Query(-1, description="-1 for newest first, 1 for oldest first")
):
    """
    Query messages from MongoDB with dynamic filtering, regex search, and pagination.
    Demonstrates: find(), count_documents(), sort(), skip(), and limit().
    """
    col = db_manager.get_collection("messages")
    query = {}

    if prediction and prediction.lower() in ["spam", "ham"]:
        query["prediction"] = prediction.lower()

    if status and status.lower() in ["unreviewed", "archived", "whitelisted"]:
        query["status"] = status.lower()

    if search and search.strip():
        # Case-insensitive regex search on message text or sender
        regex_pattern = {"$regex": search.strip(), "$options": "i"}
        query["$or"] = [
            {"text": regex_pattern},
            {"sender": regex_pattern}
        ]

    total_count = col.count_documents(query)
    total_pages = max(1, (total_count + limit - 1) // limit)
    skip = (page - 1) * limit

    cursor = col.find(query).sort("created_at", sort_order).skip(skip).limit(limit)
    messages = [format_doc(doc) for doc in cursor]

    return {
        "total": total_count,
        "page": page,
        "limit": limit,
        "total_pages": total_pages,
        "messages": messages
    }

@router.get("/spam", response_model=List[MessageResponse])
def get_spam_messages(limit: int = Query(50, ge=1, le=200)):
    """Retrieve only messages classified as Spam."""
    col = db_manager.get_collection("messages")
    cursor = col.find({"prediction": "spam"}).sort("created_at", -1).limit(limit)
    return [format_doc(doc) for doc in cursor]

@router.get("/ham", response_model=List[MessageResponse])
def get_ham_messages(limit: int = Query(50, ge=1, le=200)):
    """Retrieve only messages classified as Ham (Legitimate)."""
    col = db_manager.get_collection("messages")
    cursor = col.find({"prediction": "ham"}).sort("created_at", -1).limit(limit)
    return [format_doc(doc) for doc in cursor]

@router.get("/{id}", response_model=MessageResponse)
def get_message_by_id(id: str):
    """Retrieve details for a single message by its MongoDB ObjectId."""
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid MongoDB ObjectId format.")

    col = db_manager.get_collection("messages")
    doc = col.find_one({"_id": ObjectId(id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Message not found.")

    return format_doc(doc)

@router.patch("/{id}/status", response_model=MessageResponse)
def update_message_status(id: str, payload: MessageStatusUpdate):
    """
    Update message review status (unreviewed, archived, whitelisted).
    Demonstrates PyMongo update_one() operation with $set.
    """
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid MongoDB ObjectId format.")

    col = db_manager.get_collection("messages")
    now = datetime.now(timezone.utc)

    result = col.find_one_and_update(
        {"_id": ObjectId(id)},
        {"$set": {"status": payload.status, "updated_at": now}},
        return_document=True
    )

    if not result:
        raise HTTPException(status_code=404, detail="Message not found.")

    return format_doc(result)

@router.delete("/{id}", status_code=status.HTTP_200_OK)
def delete_message(id: str):
    """
    Delete a message record from MongoDB.
    Demonstrates PyMongo delete_one() operation.
    """
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid MongoDB ObjectId format.")

    col = db_manager.get_collection("messages")
    res = col.delete_one({"_id": ObjectId(id)})

    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Message not found.")

    return {"message": "Message deleted successfully.", "id": id}

