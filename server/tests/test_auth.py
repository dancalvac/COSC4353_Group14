import pytest
import json
import sys
import os
from dotenv import load_dotenv
load_dotenv()
# Add the server directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app import create_app
from db import get_connection
AUHT_VOLUNTEER_PASSWORD = os.getenv('AUHT_VOLUNTEER_PASSWORD')
AUTH_ADMIN_PASSWORD = os.getenv('AUTH_ADMIN_PASSWORD')

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_register_empty_input(client):
    response = client.post('/register',
                           json={
                               'fullName': '',
                               'email': '',
                               'password': '',
                               'isAdmin': '',
                               'access_code': ''
                           })
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'error' in data
def test_register_existing_user(client):
    response = client.post('/register',
                           json={
                               'fullName': 'Existing User ',
                               'email': 'admin@example.com',
                               'password': AUTH_ADMIN_PASSWORD,
                               'isAdmin': True,
                               'access_code': 'ADMIN_SUMMER2025'
                           })
    assert response.status_code == 409
    data = json.loads(response.data)
    assert 'error' in data

def test_register_volunteer_success(client):
    response = client.post('/register', 
                          json={'fullName': 'New Volunteer',
                                'email': 'newvolunteer@unittest.com', 'password': 'unittest123',
                                'isAdmin': False, 'accessCode': ''})
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
                          json={'fullName': 'New Admin',
                                'email': 'newadmin@unittest.com', 'password': 'unittest123', 
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

def test_register_invalid_json(client):
    response = client.post('/register', data='not valid json')
    assert response.status_code == 400 or response.status_code == 500


def test_login_admin_success(client):
    response = client.post('/login', 
                          json={'email': 'admin@example.com', 'password': AUTH_ADMIN_PASSWORD})
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['message'] == 'Login successful!'
    assert data['user']['role'] == 'Admin'

def test_login_volunteer_success(client):
    response = client.post('/login', 
                          json={'email': 'volunteer@example.com', 'password': AUHT_VOLUNTEER_PASSWORD})
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['message'] == 'Login successful!'
    assert data['user']['role'] == 'Volunteer'

def test_login_invalid_email(client):
    response = client.post('/login', 
                          json={'email': 'volunteer@fake.com', 'password': AUHT_VOLUNTEER_PASSWORD})
    assert response.status_code == 401
    data = json.loads(response.data)
    assert 'error' in data

def test_login_invalid_password(client):
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

