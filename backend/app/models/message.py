"""
Pydantic Schemas for Message Processing & Storage in MongoDB.
"""

from datetime import datetime
from typing import Optional, List, Literal
from pydantic import BaseModel, Field, field_validator

class MessageDetectRequest(BaseModel):
    """Request payload for real-time spam detection."""
    text: str = Field(..., description="Message text (SMS or Email body)")
    sender: Optional[str] = Field(default=None, max_length=200, description="Optional sender name, phone number or email")
    source: Optional[str] = Field(default="manual", description="Origin source (manual, api, batch)")

    @field_validator('text')
    @classmethod
    def validate_text(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Message text cannot be empty or contain only whitespace.")
        if len(v) > 5000:
            raise ValueError("Message text cannot exceed 5000 characters.")
        return v

class MessageStatusUpdate(BaseModel):
    """Payload to update message status in MongoDB."""
    status: Literal["unreviewed", "archived", "whitelisted"] = Field(..., description="Target status")

class MessageResponse(BaseModel):
    """Serialized representation of a classified MongoDB message document."""
    id: str
    text: str
    prediction: Literal["spam", "ham"]
    model_prediction: Optional[Literal["spam", "ham"]] = None
    classification_source: Literal["ml_model", "whitelist"] = "ml_model"
    whitelist_reason: Optional[str] = None
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

