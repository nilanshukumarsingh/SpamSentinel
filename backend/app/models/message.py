"""
Pydantic Schemas for Message Processing & Storage in MongoDB.
"""

from datetime import datetime
from typing import Optional, List, Literal
from pydantic import BaseModel, Field

class MessageDetectRequest(BaseModel):
    """Request payload for real-time spam detection."""
    text: str = Field(..., min_length=1, max_length=5000, description="Message text (SMS or Email body)")
    sender: Optional[str] = Field(default=None, max_length=200, description="Optional sender name, phone number or email")
    source: Optional[str] = Field(default="manual", description="Origin source (manual, api, batch)")

class MessageStatusUpdate(BaseModel):
    """Payload to update message status in MongoDB."""
    status: Literal["unreviewed", "archived", "whitelisted"] = Field(..., description="Target status")

class MessageResponse(BaseModel):
    """Serialized representation of a classified MongoDB message document."""
    id: str
    text: str
    prediction: Literal["spam", "ham"]
    confidence: float
    status: Literal["unreviewed", "archived", "whitelisted"]
    source: str
    sender: Optional[str] = None
    spam_probability: Optional[float] = None
    ham_probability: Optional[float] = None
    highlighted_keywords: Optional[List[str]] = None
    created_at: str
    updated_at: str

class MessageListResponse(BaseModel):
    """Paginated list response for MongoDB message queries."""
    total: int
    page: int
    limit: int
    total_pages: int
    messages: List[MessageResponse]

