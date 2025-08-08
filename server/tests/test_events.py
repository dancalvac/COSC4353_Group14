import pytest
import json
import sys
import os
# Add the server directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app import create_app
from db import get_connection

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


def test_create_event_success(client):
    skills = ['Communicative', 'Teamwork', 'Attentive']
    response = client.post('/create/event',
                            json={'eventName': 'Unit Test',
                                    'description': 'testing for successful event creation',
                                    'addressOne': '123 Unit Test',
                                    'addressTwo': '',
                                    'city': 'Unit',
                                    'state': 'TEST',
                                    'zipcode': '12345',
                                    'urgency': 'High',
                                    'maxVolunteers': 9999999,
                                    'skills': skills,
                                    'eventDate': '2025-07-19'})
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['message'] == 'Event Created!'
    
    #Clean up test event in db
    conn = get_connection()
    cursor = conn.cursor()
    select_query = """
    SELECT event_id
    FROM Events
    WHERE event_name = 'Unit Test' AND
    description = 'testing for successful event creation' AND
    address_one = '123 Unit Test' AND 
    city = 'Unit' AND
    state = 'TEST' AND 
    urgency = 'High' AND
    max_volunteers = 9999999"""
    cursor.execute(select_query)
    event = cursor.fetchone()
    event_id = event[0]

    #Delete event skills first
    delete_skills_query = """
    DELETE FROM EventSkills
    WHERE event_id = %s"""
    cursor.execute(delete_skills_query, (event_id, ))
    #Delete event
    delete_event_query = """
    DELETE FROM Events
    WHERE event_id = %s"""
    cursor.execute(delete_event_query, (event_id, ))
    conn.commit()
    cursor.close()
    conn.close()


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

def test_get_event_success(client):
    # Assuming event_id=1 exists in the test DB
    response = client.get('/event/1')
    assert response.status_code == 200
    data = response.get_json()
    assert "event" in data
    assert isinstance(data["event"], dict)

def test_get_event_fail(client):
    # Using a high number that won't exist in DB
    response = client.get('/event/99999')
    assert response.status_code == 404
    data = response.get_json()
    assert data["error"] == "Event not found"


def test_edit_event_success(client):
    # Assuming event_id=1 exists in the test DB
    payload = {
        "event_name": "Updated Event Name",
        "description": "Updated description",
        "urgency": "High",
        "event_date": "2025-08-10",
        "max_volunteers": 20
    }
    response = client.patch(
        '/edit/event/1',
        data=json.dumps(payload),
        content_type='application/json'
    )
    assert response.status_code == 200
    data = response.get_json()
    assert data["message"] == "Event updated!"
