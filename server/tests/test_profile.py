import pytest

import sys
import os
from dotenv import load_dotenv
load_dotenv()
# Add the server directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app import create_app
from db import get_connection
from werkzeug.security import generate_password_hash

PROFILE_PASSWORD = os.getenv('PROFILE_PASSWORD')
NEW_PROFILE_PASSWORD = os.getenv('NEW_PROFILE_PASSWORD')
PROFILE_PATCH_USERID =  int(os.getenv('PROFILE_PATCH_USERID'))
PROFILE_GET_USERID= os.getenv('PROFILE_GET_USERID')

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_profile_empty_input(client):
    response = client.patch('/updateUserProfile', 
                           json={
                               'email': '',
                               'userId': '',
                               'fullName': '',
                               'password': '',
                               'addressOne': '',
                               'city': '',
                               'state': '',
                               'zipcode': '',
                               'skill1': ''
                           })
    assert response.status_code == 400
    data = response.get_json()
    assert 'error' in data

def test_profile_empty_availability(client):
    response = client.patch('/updateUserProfile', 
                           json={
                                'fullName': 'Unit Test',
                                'password': 'unittest123',
                                'addressOne': '123 Unit Test',
                                'city': 'Unit',
                                'state': 'TEST',
                                'zipcode': '12345',
                                'preferences': '',
                                'monday_start': '',
                                'monday_end': '',
                                'tuesday_start': '',
                                'tuesday_end': '',
                                'wednesday_start': '',
                                'wednesday_end': '',
                                'thursday_start': '',
                                'thursday_end': '',
                                'friday_start': '',
                                'friday_end': '',
                                'saturday_start': '',
                                'saturday_end': '',
                                'sunday_start': '',
                                'sunday_end': '',
                                'skill1': 'Testing'
                           })
    assert response.status_code == 400
    data = response.get_json()
    assert 'error' in data

def test_profile_user_not_found(client):
    response = client.patch('/updateUserProfile',
                            json={
                                'userId': '',
                                'email': '',
                                'fullName': 'Unit Test',
                                'password': 'wrongpassword',
                                'addressOne': '123 Unit Test',
                                'city': 'Unit',
                                'state': 'TEST',
                                'zipcode': '12345',
                                'preferences': '',
                                'monday_start': '9:00:00',
                                'monday_end': '17:00:00',
                                'tuesday_start': '',
                                'tuesday_end': '',
                                'wednesday_start': '9:00:00',
                                'wednesday_end': '17:00:00',
                                'thursday_start': '',
                                'thursday_end': '',
                                'friday_start': '',
                                'friday_end': '',
                                'saturday_start': '',
                                'saturday_end': '',
                                'sunday_start': '',
                                'sunday_end': '',
                                'skill1': 'Testing'
                            })
    assert response.status_code == 404
    data = response.get_json()
    assert 'error' in data

def test_profile_incorrect_password(client):
    response = client.patch('/updateUserProfile',
                            json={
                                'userId': '',
                                'email': 'volunteer@example.com',
                                'fullName': 'Unit Test',
                                'password': 'wrongpassword',
                                'addressOne': '123 Unit Test',
                                'city': 'Unit',
                                'state': 'TEST',
                                'zipcode': '12345',
                                'preferences': '',
                                'monday_start': '9:00:00',
                                'monday_end': '17:00:00',
                                'tuesday_start': '',
                                'tuesday_end': '',
                                'wednesday_start': '9:00:00',
                                'wednesday_end': '17:00:00',
                                'thursday_start': '',
                                'thursday_end': '',
                                'friday_start': '',
                                'friday_end': '',
                                'saturday_start': '',
                                'saturday_end': '',
                                'sunday_start': '',
                                'sunday_end': '',
                                'skill1': 'Testing'
                            })
    assert response.status_code == 401
    data = response.get_json()
    assert 'error' in data

def test_profile_password_change_success_patch(client):
    response = client.patch('/updateUserProfile',
                            json={
                                'userId': PROFILE_PATCH_USERID,
                                'email': 'volunteer@example.com',
                                'fullName': 'Unit Test',
                                'password': PROFILE_PASSWORD,
                                'newPassword': NEW_PROFILE_PASSWORD,
                                'addressOne': '123 Unit Test',
                                'city': 'Unit',
                                'state': 'TEST',
                                'zipcode': '12345',
                                'preferences': '',
                                'monday_start': '9:00:00',
                                'monday_end': '17:00:00',
                                'tuesday_start': '',
                                'tuesday_end': '',
                                'wednesday_start': '9:00:00',
                                'wednesday_end': '17:00:00',
                                'thursday_start': '',
                                'thursday_end': '',
                                'friday_start': '',
                                'friday_end': '',
                                'saturday_start': '',
                                'saturday_end': '',
                                'sunday_start': '',
                                'sunday_end': '',
                                'skill1': 'Testing'
                            })
    assert response.status_code == 200
    data = response.get_json()
    assert 'message' in data
    assert data['message'] == 'User updated successfully!'

    #Remove test values for this user
    conn = get_connection()
    cursor = conn.cursor()
    hashed_password = generate_password_hash(PROFILE_PASSWORD)
    reverse_query = """UPDATE Users
                    SET password = %s,
                        address_one = NULL, address_two = NULL, city = NULL, 
                        state = NULL, zipcode = NULL, preferences = NULL, 
                        monday_start = NULL, monday_end = NULL, 
                        tuesday_start = NULL, tuesday_end = NULL, 
                        wednesday_start = NULL, wednesday_end = NULL, 
                        thursday_start = NULL, thursday_end = NULL, 
                        friday_start = NULL, friday_end = NULL, 
                        saturday_start = NULL, saturday_end = NULL, 
                        sunday_start = NULL, sunday_end = NULL
                    WHERE user_id = %s AND email = %s"""

    parameters = [hashed_password, PROFILE_PATCH_USERID, 'volunteer@example.com']
    cursor.execute(reverse_query, parameters)
    conn.commit()
    cursor.close()
    conn.close()

def test_profile_success_patch(client):
    response = client.patch('/updateUserProfile',
                            json={
                                'userId': PROFILE_PATCH_USERID,
                                'email': 'volunteer@example.com',
                                'fullName': 'Unit Test',
                                'password': PROFILE_PASSWORD,
                                'newPassword': '',
                                'addressOne': '123 Unit Test',
                                'city': 'Unit',
                                'state': 'TEST',
                                'zipcode': '12345',
                                'preferences': '',
                                'monday_start': '9:00:00',
                                'monday_end': '17:00:00',
                                'tuesday_start': '',
                                'tuesday_end': '',
                                'wednesday_start': '9:00:00',
                                'wednesday_end': '17:00:00',
                                'thursday_start': '',
                                'thursday_end': '',
                                'friday_start': '',
                                'friday_end': '',
                                'saturday_start': '',
                                'saturday_end': '',
                                'sunday_start': '',
                                'sunday_end': '',
                                'skill1': 'Testing'
                            })
    assert response.status_code == 200
    data = response.get_json()
    assert 'message' in data
    assert data['message'] == 'User updated successfully!'

    #Remove test values for this user
    conn = get_connection()
    cursor = conn.cursor()
    reverse_query = """UPDATE Users
                    SET address_one = NULL, address_two = NULL, city = NULL, 
                        state = NULL, zipcode = NULL, preferences = NULL, 
                        monday_start = NULL, monday_end = NULL, 
                        tuesday_start = NULL, tuesday_end = NULL, 
                        wednesday_start = NULL, wednesday_end = NULL, 
                        thursday_start = NULL, thursday_end = NULL, 
                        friday_start = NULL, friday_end = NULL, 
                        saturday_start = NULL, saturday_end = NULL, 
                        sunday_start = NULL, sunday_end = NULL
                    WHERE user_id = %s AND email = %s"""
    parameters = [PROFILE_PATCH_USERID, 'volunteer@example.com']
    cursor.execute(reverse_query, parameters)
    conn.commit()
    cursor.close()
    conn.close()


def test_profile_invalid_json(client):
    response = client.patch('/updateUserProfile',
                            json={
                                'userId': 0,
                                'email': 'volunteer@example.com',
                                'fullName': 'Unit Test',
                                'password': PROFILE_PASSWORD,
                                'newPassword': '',
                                'addressOne': '123 Unit Test',
                                'city': 'Unit',
                                'state': 'TEST',
                                'zipcode': '12345',
                                'preferences': '',
                                'monday_start': '9:00:00',
                                'monday_end': '17:00:00',
                                'tuesday_start': '',
                                'tuesday_end': '',
                                'wednesday_start': '9:00:00',
                                'wednesday_end': '17:00:00',
                                'thursday_start': '',
                                'thursday_end': '',
                                'friday_start': '',
                                'friday_end': '',
                                'saturday_start': '',
                                'saturday_end': '',
                                'sunday_start': '',
                                'sunday_end': '',
                                'skill1': 'Testing'
                            })
    assert response.status_code == 500
    data = response.get_json()
    assert 'error' in data
    


def test_profile_missing_user_id(client):
    response = client.get('/displayVolunteerProfile')
    assert response.status_code == 400
    data = response.get_json()
    assert 'error' in data

def test_profile_fake_user_id(client):
    response = client.get('/displayVolunteerProfile?userId=0')
    assert response.status_code == 404
    data = response.get_json()
    assert 'error' in data

def test_profile_real_user_id(client):
    response = client.get(f'/displayVolunteerProfile?userId={PROFILE_GET_USERID}')
    assert response.status_code == 200
    data = response.get_json()
    assert 'message' in data