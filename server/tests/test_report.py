import pytest

import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(file), '..'))

from app import create_app


@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


 # Checks if getting the volunteer report works
def test_get_volunteer_report_success(client):
    response = client.get('/datareport/report')
    assert response.status_code == 200
    data = response.get_json()
    assert 'volunteers' in data
    assert isinstance(data['volunteers'], list)


 # Checks if getting the event report works
def test_get_event_report_success(client):
    response = client.get('/datareport/event_report')
    assert response.status_code == 200
    data = response.get_json()
    assert 'events' in data
    assert isinstance(data['events'], list)
