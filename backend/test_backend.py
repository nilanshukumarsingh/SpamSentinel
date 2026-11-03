"""
Backend Unit and Integration Tests for SpamSentinel AI.
Validates ML inference, MongoDB CRUD operations, and API endpoints using FastAPI TestClient.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import db_manager

client = TestClient(app)

@pytest.fixture(scope="session", autouse=True)
def setup_teardown():
    # Trigger lifespan
    with TestClient(app) as test_client:
        yield test_client

def test_root_and_health():
    """Verify service root and health check."""
    res = client.get("/")
    assert res.status_code == 200
    assert "SpamSentinel" in res.json()["project"]

    health_res = client.get("/api/health")
    assert health_res.status_code == 200
    data = health_res.json()
    assert data["status"] in ["healthy", "degraded"]
    assert data["model"]["loaded"] is True

def test_spam_detection_endpoint():
    """Test POST /api/detect with spam and ham text."""
    # 1. Spam message test
    spam_payload = {
        "text": "URGENT! You have won a £2,000 cash prize or trip! Call 0906121 to claim your reward instantly!",
        "sender": "+447999888777",
        "source": "unit_test"
    }
    spam_res = client.post("/api/detect", json=spam_payload)
    assert spam_res.status_code == 201
    spam_data = spam_res.json()
    assert spam_data["prediction"] == "spam"
    assert spam_data["confidence"] >= 0.80
    assert "id" in spam_data

    # 2. Ham message test
    ham_payload = {
        "text": "Hi doctor, can I reschedule my appointment to Thursday at 2 PM? Thank you.",
        "sender": "Alice",
        "source": "unit_test"
    }
    ham_res = client.post("/api/detect", json=ham_payload)
    assert ham_res.status_code == 201
    ham_data = ham_res.json()
    assert ham_data["prediction"] == "ham"
    assert ham_data["confidence"] >= 0.80

def test_messages_crud():
    """Test GET, PATCH, DELETE operations on messages."""
    # Create a message to test CRUD on
    create_res = client.post("/api/detect", json={
        "text": "Test message for MongoDB CRUD verification.",
        "sender": "Tester",
        "source": "unit_test"
    })
    assert create_res.status_code == 201
    msg_id = create_res.json()["id"]

    # Read: GET /api/messages
    list_res = client.get(f"/api/messages?limit=5")
    assert list_res.status_code == 200
    list_data = list_res.json()
    assert "messages" in list_data
    assert list_data["total"] > 0

    # Read Single: GET /api/messages/{id}
    detail_res = client.get(f"/api/messages/{msg_id}")
    assert detail_res.status_code == 200
    assert detail_res.json()["id"] == msg_id

    # Update Status: PATCH /api/messages/{id}/status
    patch_res = client.patch(f"/api/messages/{msg_id}/status", json={"status": "whitelisted"})
    assert patch_res.status_code == 200
    assert patch_res.json()["status"] == "whitelisted"

    # Delete: DELETE /api/messages/{id}
    del_res = client.delete(f"/api/messages/{msg_id}")
    assert del_res.status_code == 200

    # Verify deletion
    verify_res = client.get(f"/api/messages/{msg_id}")
    assert verify_res.status_code == 404

def test_archive_flow():
    """Test archiving and restoring a message."""
    # Create spam message
    res = client.post("/api/detect", json={
        "text": "Claim your free entry coupon today!",
        "sender": "PromoDesk"
    })
    msg_id = res.json()["id"]

    # Archive
    arch_res = client.post(f"/api/archive/{msg_id}")
    assert arch_res.status_code == 200
    assert arch_res.json()["status"] == "archived"

    # List Archive
    arch_list = client.get("/api/archive")
    assert arch_list.status_code == 200
    assert any(m["id"] == msg_id for m in arch_list.json()["messages"])

    # Restore
    rest_res = client.post(f"/api/archive/restore/{msg_id}")
    assert rest_res.status_code == 200
    assert rest_res.json()["status"] == "unreviewed"

    # Cleanup
    client.delete(f"/api/messages/{msg_id}")

def test_whitelist_flow():
    """Test adding, listing, and deleting a whitelist entry."""
    rule_payload = {
        "value": "trusted-partner@domain.org",
        "type": "sender",
        "note": "Verified vendor email"
    }
    create_wl = client.post("/api/whitelist", json=rule_payload)
    assert create_wl.status_code == 201
    wl_id = create_wl.json()["id"]

    # Verify whitelist query
    get_wl = client.get("/api/whitelist")
    assert get_wl.status_code == 200
    assert any(w["id"] == wl_id for w in get_wl.json())

    # Whitelist override test: send message from whitelisted sender
    override_res = client.post("/api/detect", json={
        "text": "Special offer inside!",
        "sender": "trusted-partner@domain.org"
    })
    assert override_res.status_code == 201
    assert override_res.json()["prediction"] == "ham"
    assert override_res.json()["status"] == "whitelisted"

    # Cleanup whitelist rule
    del_wl = client.delete(f"/api/whitelist/{wl_id}")
    assert del_wl.status_code == 200

def test_analytics_and_metrics():
    """Test GET /api/analytics and /api/analytics/model-metrics."""
    res = client.get("/api/analytics")
    assert res.status_code == 200
    data = res.json()
    assert "summary" in data
    assert "total_messages" in data["summary"]
    assert "timeline" in data
    assert "top_keywords" in data

    metrics_res = client.get("/api/analytics/model-metrics")
    assert metrics_res.status_code == 200
    m_data = metrics_res.json()
    assert "accuracy" in m_data
    assert m_data["accuracy"] >= 0.95

def test_feedback_flow():
    """Test submitting feedback for a message."""
    # Create a message
    res = client.post("/api/detect", json={
        "text": "Your meeting reminder for tomorrow morning at 11 AM.",
        "sender": "CalendarBot"
    })
    msg_id = res.json()["id"]

    # Submit feedback
    fb_res = client.post("/api/feedback", json={
        "message_id": msg_id,
        "actual_label": "ham",
        "predicted_label": res.json()["prediction"],
        "feedback": "Confirmed legitimate appointment message"
    })
    assert fb_res.status_code == 201
    assert fb_res.json()["message_id"] == msg_id

    # List feedback
    list_fb = client.get("/api/feedback")
    assert list_fb.status_code == 200
    assert len(list_fb.json()) > 0

    # Cleanup
    client.delete(f"/api/messages/{msg_id}")
