import pytest
import json
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

def test_login_admin_success(client):
    response = client.post('/login', 
                          json={'email': 'admin@example.com', 'password': 'admin123'})
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['message'] == 'Login successful'
    assert data['user']['role'] == 'admin'

def test_login_volunteer_success(client):
    response = client.post('/login', 
                          json={'email': 'volunteer@example.com', 'password': 'volunteer123'})
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['message'] == 'Login successful'
    assert data['user']['role'] == 'volunteer'

def test_login_invalid_credentials(client):
    response = client.post('/login', 
                          json={'email': 'volunteer@example.com', 'password': 'wrongpassword'})
    assert response.status_code == 401
    data = json.loads(response.data)
    assert 'error' in data

def test_login_missing_email(client):
    response = client.post('/login', json={'password': 'password123'})
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'error' in data

def test_login_missing_password(client):
    response = client.post('/login', json={'email': 'volunteer@example.com'})
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'error' in data

def test_login_invalid_json(client):
    response = client.post('/login', data='not valid json')
    assert response.status_code == 400 or response.status_code == 500

def test_register_volunteer_success(client):
    response = client.post('/register', 
                          json={'email': 'newuser@example.com', 'password': 'newpassword123'})
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['message'] == 'Registration successful'
    assert data['user']['role'] == 'volunteer'

def test_register_admin_success(client):
    response = client.post('/register', 
                          json={'email': 'newadmin@example.com', 'password': 'admin123', 
                                'isAdmin': True, 'accessCode': 'ADMIN2024'})
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['message'] == 'Registration successful'
    assert data['user']['role'] == 'admin'
