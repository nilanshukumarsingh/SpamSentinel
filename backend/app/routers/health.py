"""
Health & Diagnostic Router for SpamSentinel AI.
Returns service status, database connectivity, and ML model readiness.
"""

from fastapi import APIRouter
from ..database import db_manager
from ml.predict import classifier_instance
from ..config import settings

router = APIRouter(prefix="/api/health", tags=["Health"])

@router.get("")
def health_check():
    """
    Diagnostic endpoint verifying:
    - FastAPI backend operational status
    - PyMongo connectivity to MongoDB
    - Pre-trained ML model loaded status
    - Total messages stored in database
    """
    db_connected = db_manager.ping()
    messages_count = 0
    whitelist_count = 0

    if db_connected and db_manager.db is not None:
        try:
            messages_count = db_manager.db["messages"].count_documents({})
            whitelist_count = db_manager.db["whitelist"].count_documents({})
        except Exception:
            pass

    return {
        "status": "healthy" if (db_connected and classifier_instance.is_loaded) else "degraded",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "database": {
            "connected": db_connected,
            "database_name": settings.DATABASE_NAME,
            "total_messages": messages_count,
            "whitelist_rules": whitelist_count
        },
        "model": {
            "loaded": classifier_instance.is_loaded,
            "architecture": "TF-IDF + Multinomial Naive Bayes",
            "accuracy": classifier_instance.metrics.get("accuracy") if classifier_instance.metrics else None
        }
    }
