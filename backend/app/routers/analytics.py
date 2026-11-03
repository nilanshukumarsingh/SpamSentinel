"""
Analytics Router for SpamSentinel AI.
Serves aggregation metrics, real-time KPIs, and ML model performance metrics.
"""

from fastapi import APIRouter
from ..services.analytics_service import AnalyticsService
from ml.predict import classifier_instance

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])

@router.get("")
def get_dashboard_analytics():
    """
    Returns live MongoDB aggregation metrics:
    - Summary counts and percentages
    - Daily prediction activity timeline
    - Top recurring spam keywords
    - Recent stream of classified messages
    - Model baseline metrics
    """
    return AnalyticsService.get_dashboard_analytics()

@router.get("/model-metrics")
def get_model_benchmark_metrics():
    """
    Returns actual machine learning benchmark metrics evaluated
    on the stratified test set of the official UCI SMS Spam Collection.
    """
    return classifier_instance.get_metrics()
