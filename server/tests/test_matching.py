import pytest
from server.app import create_app
from db import get_connection

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

def test_update_matching_success(client):
    # Add some data to the database for this test
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute('''
        INSERT INTO Users (user_id, full_name, email, password, role, address_one, address_two, city, state, zipcode, preferences)
        VALUES (-1, 'test user', 'test@example.com', 'password', 'Volunteer', '567 Road', '', 'New York', 'New York', 11111, '');
    ''')
    conn.commit()

    cursor.execute('''
        INSERT INTO Events (event_id, event_name, description, address_one, address_two, city, state, zipcode, urgency, max_volunteers, event_date)
        VALUES(-1, 'Test', 'Test', '456 Road', '', 'New York', 'New York', 11111, 'High', 3, '2025-08-01 12:00:00');
    ''')
    conn.commit()

    # Check API response
    response = client.post('/update_volunteer_history', json={'user_id': -1,'event_id': -1, 'event_date': '08-01-2025'})
    assert response.status_code == 200
    data = response.get_json()
    assert 'status' in data
    assert data['status'] == 'Success'
    
    # Delete added rows
    cursor.execute('DELETE FROM UserHistory WHERE user_id = -1 AND event_id = -1')
    cursor.execute('DELETE FROM Events WHERE event_id=-1')
    cursor.execute('DELETE FROM Users WHERE user_id=-1')
    conn.commit()
    cursor.close()
    conn.close()

def test_update_matching_invalid_date_format(client):
    response = client.post('/update_volunteer_history', json={'user_id': -1,'event_id': -1, 'event_date': '2025-08-01'})
    assert response.status_code == 400
    data = response.get_json()
    assert 'error' in data
    assert data['error'] == 'Invalid date format, expected MM-DD-YYYY'

def test_update_matching_max_capacity(client):
    # Add some data to the database for this test
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute('''
        INSERT INTO Users (user_id, full_name, email, password, role, address_one, address_two, city, state, zipcode, preferences)
        VALUES (-1, 'test user', 'test@example.com', 'password', 'Volunteer', '567 Road', '', 'New York', 'New York', 11111, '');
    ''')
    conn.commit()

    cursor.execute('''
        INSERT INTO Events (event_id, event_name, description, address_one, address_two, city, state, zipcode, urgency, max_volunteers, event_date)
        VALUES(-1, 'Test', 'Test', '456 Road', '', 'New York', 'New York', 11111, 'High', 1, '2025-08-01 12:00:00');
    ''')
    conn.commit()

    # Insert 1 assigned volunteer already, filling capacity
    cursor.execute('''
        INSERT INTO UserHistory (event_status, event_id, user_id, assigned_date)
        VALUES ('Assigned', -1, -1, '2025-08-01 12:00:00');
    ''')
    conn.commit()

    # Attempt to assign user to event
    response = client.post('/update_volunteer_history', json={'user_id': -1,'event_id': -1, 'event_date': '08-01-2025'})
    assert response.status_code == 400
    data = response.get_json()
    assert 'error' in data
    assert data['error'] == 'Event is already at max capacity'

    # Delete added rows
    cursor.execute('DELETE FROM UserHistory WHERE user_id = -1 AND event_id = -1')
    cursor.execute('DELETE FROM Events WHERE event_id=-1')
    cursor.execute('DELETE FROM Users WHERE user_id=-1')
    conn.commit()
    cursor.close()
    conn.close()

def test_update_matching_missing_user_id(client):
    response = client.post('/update_volunteer_history', json={'event_id': 123, 'event_date': '2025-12-25 12:00:00'})
    assert response.status_code == 400
    data = response.get_json()
    assert 'error' in data
    assert data['error'] == 'User ID or Event ID or Event Date is null'

def test_update_matching_missing_event_id(client):
    response = client.post('/update_volunteer_history', json={'user_id': -1, 'event_date': '2025-12-25 12:00:00'})
    assert response.status_code == 400
    data = response.get_json()
    assert 'error' in data
    assert data['error'] == 'User ID or Event ID or Event Date is null'

def test_update_matching_missing_event_date(client):
    response = client.post('/update_volunteer_history', json={'user_id': -1, 'event_id': 123,})
    assert response.status_code == 400
    data = response.get_json()
    assert 'error' in data
    assert data['error'] == 'User ID or Event ID or Event Date is null'
