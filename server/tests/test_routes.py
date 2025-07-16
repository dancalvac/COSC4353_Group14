import pytest
from server.app import create_app

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_matching_success(client):
    response = client.get('/matching')
    assert response.status_code == 200
    data = response.get_json()
    assert 'volunteers' in data
    assert 'events' in data
    assert isinstance(data['volunteers'], list)
    assert isinstance(data['events'], list)

def test_notification_success(client):
    response = client.post('/send_notification', json={"emails":["test@example.com"], "event":"Test Event"})
    assert response.status_code == 200

def test_notification_missing_email(client):
    response = client.post('/send_notification', json={"event":"Test Event"})
    assert response.status_code == 400

def test_notification_missing_event(client):
    response = client.post('/send_notification', json={"emails":["test@example.com"]})
    assert response.status_code == 400

def test_notification_missing_email_and_event(client):
    response = client.post('/send_notification', json={})
    assert response.status_code == 400

def test_notification_email_as_string(client):
    response = client.post('/send_notification', json={"emails":"test@example.com", "event":"Test Event"})
    assert response.status_code == 400
