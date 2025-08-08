import pytest
from server.app import create_app

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_notification_success(client):
    response = client.post('/send_notification', json={"emails":["test@example.com"], "event":"Test Event"})
    assert response.status_code == 200
    data = response.get_json()
    assert data["status"] == "Notification sent"

def test_notification_missing_email(client):
    response = client.post('/send_notification', json={"event":"Test Event"})
    assert response.status_code == 400
    data = response.get_json()
    assert data["error"] == "Missing emails or event_name"

def test_notification_missing_event(client):
    response = client.post('/send_notification', json={"emails":["test@example.com"]})
    assert response.status_code == 400
    data = response.get_json()
    assert data["error"] == "Missing emails or event_name"

def test_notification_missing_email_and_event(client):
    response = client.post('/send_notification', json={})
    assert response.status_code == 400
    data = response.get_json()
    assert data["error"] == "Missing emails or event_name"

def test_notification_email_as_string(client):
    response = client.post('/send_notification', json={"emails":"test@example.com", "event":"Test Event"})
    assert response.status_code == 400
    data = response.get_json()
    assert data["error"] == "Email field must be a list"

def test_get_notification_success(client):
    response = client.get('/get_notification?userID=123')
    assert response.status_code == 200
    data = response.get_json()
    assert 'notifications' in data
    assert isinstance(data['notifications'], list)

def test_get_notification_no_userID(client):
    response = client.get('/get_notification') 
    assert response.status_code == 400
    data = response.get_json()
    assert 'error' in data

