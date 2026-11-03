"""
Database Connector Module for SpamSentinel AI using PyMongo.
Manages MongoDB client lifecycle, collection access, indexing, and document serialization.
"""

from datetime import datetime, timezone
from typing import Any, Dict, Optional
from bson import ObjectId
import pymongo
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError

from .config import settings

class MongoDBManager:
    """Singleton MongoDB Manager utilizing PyMongo driver."""
    def __init__(self):
        self.client: Optional[pymongo.MongoClient] = None
        self.db: Optional[pymongo.database.Database] = None

    def connect(self):
        """Establish connection with MongoDB server and set up indexes."""
        try:
            print(f"Connecting to MongoDB at {settings.MONGODB_URI}...")
            self.client = pymongo.MongoClient(
                settings.MONGODB_URI,
                serverSelectionTimeoutMS=4000,
                connectTimeoutMS=4000
            )
            # Verify server is reachable
            self.client.admin.command('ping')
            self.db = self.client[settings.DATABASE_NAME]
            print(f"Successfully connected to MongoDB Database: '{settings.DATABASE_NAME}'")
            
            # Setup Collections and Indexes
            self._init_indexes()
        except (ConnectionFailure, ServerSelectionTimeoutError) as e:
            print(f"WARNING: MongoDB connection failed: {e}")
            print("System will operate in degraded mode until MongoDB is accessible.")

    def _init_indexes(self):
        """
        Create essential MongoDB indexes:
        - messages.created_at (descending) for fast timeline queries
        - messages.prediction (ascending) for spam/ham filtering
        - messages.status (ascending) for inbox/archive filtering
        - messages.text (text index) for full-text search capability
        - whitelist.value (unique) to prevent duplicate whitelist rules
        """
        if self.db is None:
            return

        try:
            # messages collection indexes
            messages_col = self.db["messages"]
            messages_col.create_index([("created_at", pymongo.DESCENDING)], name="idx_created_at")
            messages_col.create_index([("prediction", pymongo.ASCENDING)], name="idx_prediction")
            messages_col.create_index([("status", pymongo.ASCENDING)], name="idx_status")
            messages_col.create_index([("text", pymongo.TEXT)], name="idx_text_search")

            # whitelist collection indexes
            whitelist_col = self.db["whitelist"]
            whitelist_col.create_index([("value", pymongo.ASCENDING)], unique=True, name="idx_whitelist_value")

            # feedback collection index
            feedback_col = self.db["feedback"]
            feedback_col.create_index([("created_at", pymongo.DESCENDING)], name="idx_feedback_created")

            print("MongoDB indexes created and verified successfully.")
        except Exception as e:
            print(f"Index creation note: {e}")

    def close(self):
        """Close connection on shutdown."""
        if self.client:
            self.client.close()
            print("MongoDB connection closed.")

    def get_collection(self, name: str) -> pymongo.collection.Collection:
        """Get collection reference."""
        if self.db is None:
            raise ConnectionError("MongoDB is not connected. Ensure MongoDB is running.")
        return self.db[name]

    def ping(self) -> bool:
        """Check if MongoDB server is responsive."""
        if not self.client:
            return False
        try:
            self.client.admin.command('ping')
            return True
        except Exception:
            return False

# Global Database Manager Instance
db_manager = MongoDBManager()

def get_db() -> pymongo.database.Database:
    """Dependency helper to get active database instance."""
    if db_manager.db is None:
        raise ConnectionError("Database instance is unavailable. Check connection string.")
    return db_manager.db

def format_doc(doc: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    """
    Format a MongoDB BSON document into JSON-serializable Python dictionary:
    - Converts ObjectId to string '_id' and 'id'
    - Converts datetime to ISO-8601 strings
    """
    if not doc:
        return None
    formatted = {}
    for k, v in doc.items():
        if isinstance(v, ObjectId):
            formatted[k] = str(v)
            if k == "_id":
                formatted["id"] = str(v)
        elif isinstance(v, datetime):
            formatted[k] = v.isoformat()
        elif isinstance(v, dict):
            formatted[k] = format_doc(v)
        elif isinstance(v, list):
            formatted[k] = [format_doc(item) if isinstance(item, dict) else (str(item) if isinstance(item, ObjectId) else item) for item in v]
        else:
            formatted[k] = v
    if "_id" in formatted and "id" not in formatted:
        formatted["id"] = formatted["_id"]
    return formatted

