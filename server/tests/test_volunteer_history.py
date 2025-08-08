import pytest
from server.app import create_app

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_volunteer_history_success(client):
    response = client.get('/volunteer/history?userID=123')
    assert response.status_code == 200
    data = response.get_json()
    assert 'volunteer_history' in data
    assert isinstance(data['volunteer_history'], list)

def test_volunteer_history_unknown_user_id(client):
    response = client.get('/volunteer/history?userID=-1')
    assert response.status_code == 200
    data = response.get_json()
    assert 'volunteer_history' in data
    assert data['volunteer_history'] == []

def test_volunteer_history_missing_user_id_param(client):
    # Should default to volunteer1@example.com
    response = client.get('/volunteer/history?userID=')
    assert response.status_code == 400
    data = response.get_json()
    assert 'error' in data

def test_volunteer_history_no_user_id(client):
    # Should default to volunteer1@example.com
    response = client.get('/volunteer/history')
    assert response.status_code == 400
    data = response.get_json()
    assert 'error' in data