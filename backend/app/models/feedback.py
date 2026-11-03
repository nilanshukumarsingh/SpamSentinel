"""
Pydantic Schemas for User Feedback in MongoDB.
"""

from typing import Optional, Literal
from pydantic import BaseModel, Field

class FeedbackCreate(BaseModel):
    """Payload when a user corrects a prediction."""
    message_id: str = Field(..., description="Target MongoDB Message ObjectId")
    actual_label: Literal["spam", "ham"] = Field(..., description="Correct ground truth label")
    predicted_label: Literal["spam", "ham"] = Field(..., description="What the model predicted")
    feedback: Optional[str] = Field(default="Incorrect prediction reported by user", max_length=500)

class FeedbackResponse(BaseModel):
    """Serialized representation of a MongoDB feedback document."""
    id: str
    message_id: str
    actual_label: str
    predicted_label: str
    feedback: str
    created_at: str

