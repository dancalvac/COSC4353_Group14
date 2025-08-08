import pytest
import sys
import os

# Add the server directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app import create_app

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_tables(client):
    response = client.get('/api/tables')
    assert response.status_code == 200
    data = response.get_json()
    assert 'Tables' in data
    assert isinstance(data['Tables'], list)