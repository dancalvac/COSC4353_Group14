import pytest
import json
from server.app import create_app
from db import get_connection

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_login_admin_success(client):
    response = client.post('/login', 
                          json={'email': 'admin@example.com', 'password': 'admin123'})
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['message'] == 'Login successful!'
    assert data['user']['role'] == 'Admin'

def test_login_volunteer_success(client):
    response = client.post('/login', 
                          json={'email': 'volunteer@example.com', 'password': 'volunteer123'})
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['message'] == 'Login successful!'
    assert data['user']['role'] == 'Volunteer'

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
                          json={'email': 'newuser@example.com', 'password': 'newpassword123', 'fullName': 'test name'})
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['message'] == 'User registered successfully!'
    assert data['user_id']

    user_id = data['user_id']  # grab ID from API response

    # Clean up user from DB
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM Users WHERE user_id = %s', (user_id,))
    conn.commit()
    cursor.close()
    conn.close()

def test_register_admin_success(client):
    response = client.post('/register', 
                          json={'email': 'newadmin@example.com', 'password': 'admin123', 'fullName': 'test name',
                                'isAdmin': True, 'accessCode': 'ADMIN_SUMMER2025'})
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['message'] == 'User registered successfully!'
    assert data['user_id']

    user_id = data['user_id']  # grab ID from API response

    # Clean up user from DB
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM Users WHERE user_id = %s', (user_id,))
    conn.commit()
    cursor.close()
    conn.close()

def test_create_event_success(client):
    response = client.post('/create/event',
                            json={'eventName': 'Community Service',
                                    'description': 'testing for successful event creation',
                                    'location': '123 Test St.',
                                    'urgency': 'High',
                                    'skill1': 'Fast',
                                    'skill2': 'Team-player',
                                    'skill3': '',
                                    'skill4': '',
                                    'skill5': '',
                                    'eventDate': '2025-07-19'})
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['message'] == 'Event Created!'
    assert data['event_name'] == 'Community Service'

def test_create_event_missing_required_input(client):
    response = client.post('/create/event',
                            json={'description': 'This does not hold all required input',
                                    'skill2': 'Nimble Hands',
                                    'skill3': 'Technical',
                                    'skill4': '',
                                    'skill5': ''
                                    })
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'error' in data 

def test_display_event_success(client):
    response = client.get('/display/events')
    assert response.status_code == 200
    data = response.get_json()
    assert 'Events' in data
    assert isinstance(data['Events'], list)