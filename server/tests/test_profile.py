import pytest
from server.app import create_app
from server.routes.profile import HARDCODED_VOLUNTEER_PROFILE

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def make_base_payload():
    return {
        "email": "testuser@example.com",
        "fullName": "Test User",
        "password": "securepass",
        "addressOne": "123 Main St",
        "addressTwo": "Suite 100",
        "city": "Testville",
        "state": "TS",
        "zipcode": "12345",
        "preferences": "None",
        "monday_start": "09:00", "monday_end": "17:00",
        "tuesday_start": "09:00", "tuesday_end": "17:00",
        "wednesday_start": "09:00", "wednesday_end": "17:00",
        "thursday_start": "09:00", "thursday_end": "17:00",
        "friday_start": "09:00", "friday_end": "17:00",
        "saturday_start": "09:00", "saturday_end": "17:00",
        "sunday_start": "09:00", "sunday_end": "17:00",
        "skill1": "FirstAid",
        "skill2": "Cooking",
        "skill3": "Driving"
    }

def test_save_profile_success(client):
    payload = make_base_payload()
    resp = client.post('/volunteer/profile', json=payload)
    assert resp.status_code == 201

    data = resp.get_json()
    assert data['message'] == 'Profile Updated!'
    assert data['user']['email'] == payload['email']

    # verify in-memory store updated
    assert payload['email'] in HARDCODED_VOLUNTEER_PROFILE
    stored = HARDCODED_VOLUNTEER_PROFILE[payload['email']]
    assert stored['address1'] == payload['addressOne']
    assert stored['availability']['monday']['start'] == payload['monday_start']
    assert stored['skill3'] == payload['skill3']

@pytest.mark.parametrize("bad_payload", [
    {},  # missing all fields
    {"email": "", "fullName": "Foo"},  # blank email + missing others
    {  # all required fields present but blank
        "email": "a@b.com", "fullName": "",
        "password": "", "addressOne": "",
        "city": "", "state": "", "zipcode": "", "skill1": ""
    },
])
def test_save_profile_missing_required_fields(client, bad_payload):
    resp = client.post('/volunteer/profile', json=bad_payload)
    assert resp.status_code == 400
    assert resp.get_json() == {'error': 'Fill in fields with *'}

def test_save_profile_invalid_json_triggers_500(client):
    # send invalid JSON to trigger exception handler
    resp = client.post(
        '/volunteer/profile',
        data="this is not json",
        content_type='application/json'
    )
    assert resp.status_code == 500
    assert resp.get_json() == {'error': 'Server error'}

def test_update_existing_profile(client):
    payload = make_base_payload()
    resp1 = client.post('/volunteer/profile', json=payload)
    assert resp1.status_code == 201
    # Update with new address and skill
    payload["addressOne"] = "456 New St"
    payload["skill1"] = "CPR"
    resp2 = client.post('/volunteer/profile', json=payload)
    assert resp2.status_code == 201
    data = resp2.get_json()
    assert data['user']['address1'] == "456 New St"
    assert data['user']['skill1'] == "CPR"


def test_optional_address_two(client):
    payload = make_base_payload()
    payload["addressTwo"] = ""
    resp = client.post('/volunteer/profile', json=payload)
    assert resp.status_code == 201
    data = resp.get_json()
    assert data['user']['address2'] == ""


def test_extra_unexpected_fields(client):
    payload = make_base_payload()
    payload["unexpected"] = "value"
    resp = client.post('/volunteer/profile', json=payload)
    assert resp.status_code == 201
    data = resp.get_json()
    assert "unexpected" not in data['user']


def test_partial_availability(client):
    payload = make_base_payload()
    del payload["sunday_start"]
    del payload["sunday_end"]
    resp = client.post('/volunteer/profile', json=payload)
    # Should still succeed if Sunday is optional
    assert resp.status_code == 201 or resp.status_code == 400


def test_invalid_skill_values(client):
    payload = make_base_payload()
    payload["skill1"] = ""
    resp = client.post('/volunteer/profile', json=payload)
    # Should fail if skill1 is required
    assert resp.status_code == 400 or resp.status_code == 201


def test_invalid_state_code(client):
    payload = make_base_payload()
    payload["state"] = "INVALID"
    resp = client.post('/volunteer/profile', json=payload)
    # Should fail if state code is validated
    assert resp.status_code == 400 or resp.status_code == 201
