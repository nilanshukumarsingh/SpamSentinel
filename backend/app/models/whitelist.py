"""
Pydantic Schemas for Whitelist Management in MongoDB.
"""

from typing import Optional, Literal
from pydantic import BaseModel, Field

class WhitelistCreate(BaseModel):
    """Payload to add a new approved whitelist entry."""
    value: str = Field(..., min_length=2, max_length=255, description="Sender email/phone, keyword, domain, or phrase")
    type: Literal["sender", "keyword", "phrase", "domain"] = Field(default="sender", description="Category of rule")
    note: Optional[str] = Field(default=None, max_length=255, description="Optional note or explanation")

class WhitelistResponse(BaseModel):
    """Serialized representation of a MongoDB whitelist document."""
    id: str
    value: str
    type: Literal["sender", "keyword", "phrase", "domain"]
    note: Optional[str] = None
    created_at: str

