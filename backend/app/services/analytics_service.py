"""
Analytics Service for SpamSentinel AI.
Executes advanced MongoDB Aggregation Pipelines using PyMongo for dashboard metrics.
"""

from typing import Dict, Any, List
from datetime import datetime, timezone
import pymongo
from ..database import db_manager, format_doc
from ml.predict import classifier_instance

class AnalyticsService:
    @staticmethod
    def get_dashboard_analytics() -> Dict[str, Any]:
        """
        Calculates all key metrics via PyMongo aggregation pipelines:
        - Total analyzed messages
        - Spam vs Ham counts
        - Archived and Whitelisted counts
        - Spam Detection Rate %
        - Daily timeline aggregation
        - Top spam keywords aggregation
        - Real ML model benchmark metrics
        """
        col = db_manager.get_collection("messages")

        # 1. Summary Counts Aggregation Pipeline
        summary_pipeline = [
            {
                "$facet": {
                    "total": [{"$count": "count"}],
                    "by_prediction": [
                        {"$group": {"_id": "$prediction", "count": {"$sum": 1}}}
                    ],
                    "by_status": [
                        {"$group": {"_id": "$status", "count": {"$sum": 1}}}
                    ]
                }
            }
        ]
        facet_res = list(col.aggregate(summary_pipeline))[0]

        total_messages = facet_res["total"][0]["count"] if facet_res["total"] else 0

        # Prediction mapping
        prediction_map = {item["_id"]: item["count"] for item in facet_res["by_prediction"]}
        spam_count = prediction_map.get("spam", 0)
        ham_count = prediction_map.get("ham", 0)

        # Status mapping
        status_map = {item["_id"]: item["count"] for item in facet_res["by_status"]}
        archived_count = status_map.get("archived", 0)
        whitelisted_count = status_map.get("whitelisted", 0)
        unreviewed_count = status_map.get("unreviewed", 0)

        spam_rate = round((spam_count / total_messages * 100), 2) if total_messages > 0 else 0.0

        # 2. Timeline Aggregation Pipeline (Daily activity by prediction)
        timeline_pipeline = [
            {
                "$group": {
                    "_id": {
                        "date": {"$dateToString": {"format": "%Y-%m-%d", "date": "$created_at"}},
                        "prediction": "$prediction"
                    },
                    "count": {"$sum": 1}
                }
            },
            {"$sort": {"_id.date": 1}}
        ]
        raw_timeline = list(col.aggregate(timeline_pipeline))

        # Format timeline for frontend charts
        timeline_dict = {}
        for entry in raw_timeline:
            d = entry["_id"]["date"]
            pred = entry["_id"]["prediction"]
            count = entry["count"]
            if d not in timeline_dict:
                timeline_dict[d] = {"date": d, "spam": 0, "ham": 0, "total": 0}
            timeline_dict[d][pred] = count
            timeline_dict[d]["total"] += count

        timeline = list(timeline_dict.values())
        if not timeline:
            today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
            timeline = [{"date": today_str, "spam": spam_count, "ham": ham_count, "total": total_messages}]

        # 3. Top Keywords Aggregation Pipeline (Unwind keywords of spam messages)
        keywords_pipeline = [
            {"$match": {"prediction": "spam", "highlighted_keywords": {"$exists": True, "$ne": []}}},
            {"$unwind": "$highlighted_keywords"},
            {"$match": {"highlighted_keywords": {"$nin": ["num_code", "currency_symbol", "http_url"]}}},
            {"$sortByCount": "$highlighted_keywords"},
            {"$limit": 8}
        ]
        top_keywords = list(col.aggregate(keywords_pipeline))
        formatted_keywords = [{"keyword": kw["_id"], "frequency": kw["count"]} for kw in top_keywords]

        # 4. Recent messages for activity stream
        recent_cursor = col.find().sort("created_at", pymongo.DESCENDING).limit(5)
        recent_messages = [format_doc(doc) for doc in recent_cursor]

        # 5. Whitelist Count
        whitelist_col = db_manager.get_collection("whitelist")
        whitelist_count = whitelist_col.count_documents({})

        # 6. ML Model Benchmark Metrics
        model_metrics = classifier_instance.get_metrics()

        return {
            "summary": {
                "total_messages": total_messages,
                "spam_count": spam_count,
                "ham_count": ham_count,
                "archived_count": archived_count,
                "whitelisted_count": whitelisted_count,
                "unreviewed_count": unreviewed_count,
                "spam_rate_percent": spam_rate,
                "whitelist_rules_count": whitelist_count
            },
            "timeline": timeline,
            "top_keywords": formatted_keywords,
            "recent_messages": recent_messages,
            "model_metrics": model_metrics
        }
