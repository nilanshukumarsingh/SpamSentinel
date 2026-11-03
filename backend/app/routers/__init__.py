from .detect import router as detect_router
from .messages import router as messages_router
from .archive import router as archive_router
from .whitelist import router as whitelist_router
from .analytics import router as analytics_router
from .feedback import router as feedback_router
from .health import router as health_router

__all__ = [
    "detect_router",
    "messages_router",
    "archive_router",
    "whitelist_router",
    "analytics_router",
    "feedback_router",
    "health_router",
]

