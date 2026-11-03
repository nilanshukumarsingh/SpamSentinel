"""
Main FastAPI Application Entrypoint for SpamSentinel AI.
Initializes lifespan events, CORS policies, routes, and error handlers.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .config import settings
from .database import db_manager
from ml.predict import classifier_instance
from .routers import (
    detect_router,
    messages_router,
    archive_router,
    whitelist_router,
    analytics_router,
    feedback_router,
    health_router
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application Lifespan:
    1. Connects to MongoDB via PyMongo
    2. Builds collections and indexes
    3. Loads machine learning model artifacts
    4. Auto-seeds initial sample messages if database is empty
    """
    print(f"Starting {settings.PROJECT_NAME} backend...")
    # Step 1: Connect PyMongo
    db_manager.connect()

    # Step 2: Ensure ML Model is loaded
    if not classifier_instance.is_loaded:
        print("Loading ML model...")
        classifier_instance.load()

    # Step 3: Seed initial demo messages if collection is empty
    try:
        if db_manager.db is not None:
            col = db_manager.db["messages"]
            if col.count_documents({}) == 0:
                print("Seeding initial demo messages into MongoDB for instant dashboard preview...")
                from .services.spam_detector import SpamDetectionService
                samples = [
                    ("Congratulations! You have won £1,000 cash prize! Call 0906121 to claim your reward!", "+447911123456"),
                    ("Hey, let's meet at the lab tomorrow at 10 AM to review the MongoDB presentation.", "+919876543210"),
                    ("URGENT! Your account security has been compromised. Verify immediately at http://secure-login.bank-update.info", "SecurityDesk"),
                    ("Can you send me the lecture notes for chapter 4 when you get home?", "+919123456789"),
                    ("Exclusive promo: Claim your 50% discount coupon today only. Text CLAIM to 88088 now!", "PromoCenter"),
                    ("The assignment deadline for CSE-494 has been extended until Friday evening.", "CourseInstructor"),
                    ("Free entry in 2 a wkly comp to win FA Cup final tkts 21st May 2005. Text FA to 87121 to receive entry.", "87121"),
                    ("Are you free this weekend to work on the project documentation?", "+919876543211")
                ]
                for text, sender in samples:
                    SpamDetectionService.detect_and_store(text=text, sender=sender, source="seed")
                print("Initial demo messages seeded successfully.")

                # Also seed sample whitelist rules
                wl_col = db_manager.db["whitelist"]
                if wl_col.count_documents({}) == 0:
                    from datetime import datetime, timezone
                    wl_col.insert_many([
                        {"value": "CourseInstructor", "type": "sender", "note": "Verified Professor", "created_at": datetime.now(timezone.utc)},
                        {"value": "university.edu", "type": "domain", "note": "Academic institution emails", "created_at": datetime.now(timezone.utc)},
                    ])
                    print("Initial whitelist entries seeded successfully.")
    except Exception as e:
        print(f"Notice on startup data initialization: {e}")

    yield

    # Teardown
    print("Shutting down backend and disconnecting MongoDB...")
    db_manager.close()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=settings.DESCRIPTION,
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(detect_router)
app.include_router(messages_router)
app.include_router(archive_router)
app.include_router(whitelist_router)
app.include_router(analytics_router)
app.include_router(feedback_router)
app.include_router(health_router)

@app.get("/", tags=["Root"])
def root_endpoint():
    return {
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "description": settings.DESCRIPTION,
        "docs_url": "/docs",
        "health_check": "/api/health"
    }
