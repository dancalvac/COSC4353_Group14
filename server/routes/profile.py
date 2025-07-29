from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from db import get_connection

profile_bp = Blueprint('profile', __name__)

#Harcoded volunteer profile for testing
HARDCODED_VOLUNTEER_PROFILE = {
    'volunteer@example.com': {
        'password': 'volunteer123',
        'role': 'volunteer',
        'address1': '',
        'address2': '',
        'city': '',
        'state': '',
        'zipcode': '',
        'preferences': '',
        'availability': {
            'monday':    {'start': '', 'end': ''},
            'tuesday':   {'start': '', 'end': ''},
            'wednesday': {'start': '', 'end': ''},
            'thursday':  {'start': '', 'end': ''},
            'friday':    {'start': '', 'end': ''},
            'saturday':  {'start': '', 'end': ''},
            'sunday':    {'start': '', 'end': ''}
        },
        'skill1': '',
        'skill2': '',
        'skill3': ''
    }
}
@profile_bp.route('/test/volunteer/profile', methods=['PATCH'])
def test_save_profile():
    conn = None
    cursor = None
    try:
        data = request.get_json()
        full_name = data.get('fullName')
        user_id = data.get('userId')
        email = data.get('email')
        password = data.get('password')
        address_one = data.get('addressOne')
        address_two = data.get('addressTwo')
        city = data.get('city')
        state = data.get('state')
        zipcode = data.get('zipcode')
        preferences = data.get('preferences')
        monday_start = data.get('monday_start')
        monday_end = data.get('monday_end')
        tuesday_start = data.get('tuesday_start')
        tuesday_end = data.get('tuesday_end')
        wednesday_start = data.get('wednesday_start')
        wednesday_end = data.get('wednesday_end')
        thursday_start = data.get('thursday_start')
        thursday_end = data.get('thursday_end')
        friday_start = data.get('friday_start')
        friday_end = data.get('friday_end')
        saturday_start = data.get('saturday_start')
        saturday_end = data.get('saturday_end')
        sunday_start = data.get('sunday_start')
        sunday_end = data.get('sunday_end')
        skill1 = data.get('skill1')
        skill2 = data.get('skill2')
        skill3 = data.get('skill3')
        
        
        
        if (not all([full_name, password, address_one, city, state, zipcode, skill1])):
            return jsonify({'error': 'Fill in fields with *'}), 400
        days = [
            (monday_start, monday_end),
            (tuesday_start, tuesday_end),
            (wednesday_start, wednesday_end),
            (thursday_start, thursday_end),
            (friday_start, friday_end),
            (saturday_start, saturday_end),
            (sunday_start, sunday_end)
        ]
        has_availability = any(start and end for start, end in days)

        if not has_availability:
            return jsonify({'error': 'Please provide availability for at least one day'}), 400
        
        conn = get_connection()
        cursor = conn.cursor()
        #Update a user
        check_query = 'SELECT password FROM Users WHERE email = %s'
        cursor.execute(check_query, (email, ))
        hashed_password = cursor.fetchone()
        if not hashed_password:
            return jsonify({'error': 'User not found'}), 404
        
        if not check_password_hash(hashed_password[0], password):
            return jsonify({'error': 'Incorrect password'}), 401
        update_query = """UPDATE Users
                        SET	    full_name = %s,
                                address_one = %s, address_two = %s, city = %s, 
                                state = %s, zipcode = %s, preferences = %s, 
                                monday_start = %s, monday_end = %s, 
                                tuesday_start = %s, tuesday_end = %s, 
                                wednesday_start = %s, wednesday_end = %s, 
                                thursday_start = %s, thursday_end = %s, 
                                friday_start =  %s, friday_end = %s, 
                                saturday_start = %s, saturday_end = %s, 
                                sunday_start = %s, sunday_end = %s
                        WHERE user_id = %s AND email = %s"""
        parameters = (
            full_name,
            address_one, 
            address_two, 
            city, 
            state, 
            zipcode,
            preferences,
            monday_start,
            monday_end,
            tuesday_start,
            tuesday_end,
            wednesday_start,
            wednesday_end,
            thursday_start,
            thursday_end,
            friday_start,
            friday_end,
            saturday_start,
            saturday_end,
            sunday_start,
            sunday_end,
            user_id,
            email
        )
        cursor.execute(update_query, parameters)

        
        #Now on inserting the skills
        skills = [
            (skill1, user_id),
            (skill2, user_id),
            (skill3, user_id)
        ]
        insert_query = """INSERT INTO UserSkills (skill, user_id)
                        VALUES (%s, %s)"""
        filled_skills = [(skill, uid) for skill, uid in skills if skill and skill.strip()]
        if filled_skills:
            cursor.executemany(insert_query, filled_skills)
        
        conn.commit()
        #for skill in skills:
         #   if skill:
          #      cursor.execute(insert_query, (skill, user_id))
        #conn.commit()
                #else:
                 #   conn.rollback()  # Rollback if something went wrong
                  #  return jsonify({'error': 'Failed to add skills'}), 500
        
        return jsonify({
                'message': 'User updated successfully!',
                
        }), 200
    except Exception as  e:
        print(f"Update error: {str(e)}")  # Debug print
        if conn:
            try:
                conn.rollback()
            except:
                pass
        return jsonify({'error': str(e)}), 500
    finally:
        # Clean up connections
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@profile_bp.route('/volunteer/profile', methods=['POST'])
def save_profile():
    try:
        data = request.get_json()
        email = data.get('email')
        name = data.get('fullName')
        password = data.get('password')
        address1 = data.get('addressOne')
        address2 = data.get('addressTwo')
        city = data.get('city')
        state = data.get('state')
        zipcode = data.get('zipcode')
        preferences = data.get('preferences')
        monday_start = data.get('monday_start')
        monday_end = data.get('monday_end')
        tuesday_start = data.get('tuesday_start')
        tuesday_end = data.get('tuesday_end')
        wednesday_start = data.get('wednesday_start')
        wednesday_end = data.get('wednesday_end')
        thursday_start = data.get('thursday_start')
        thursday_end = data.get('thursday_end')
        friday_start = data.get('friday_start')
        friday_end = data.get('friday_end')
        saturday_start = data.get('saturday_start')
        saturday_end = data.get('saturday_end')
        sunday_start = data.get('sunday_start')
        sunday_end = data.get('sunday_end')
        skill1 = data.get('skill1')
        skill2 = data.get('skill2')
        skill3 = data.get('skill3')

        if not email or not name or not password or not address1 or not city or not state or not zipcode or not skill1:
            return jsonify({'error': 'Fill in fields with *'}), 400
        
        HARDCODED_VOLUNTEER_PROFILE[email] = {
            'password': password,
            'role': 'volunteer',
            'address1': address1,
            'address2': address2,
            'city': city,
            'state': state,
            'zipcode': zipcode,
            'preferences': preferences,
            'availability': {
                'monday':    {'start': monday_start, 'end': monday_end},
                'tuesday':   {'start': tuesday_start, 'end': tuesday_end},
                'wednesday': {'start': wednesday_start, 'end': wednesday_end},
                'thursday':  {'start': thursday_start, 'end': thursday_end},
                'friday':    {'start': friday_start, 'end': friday_end},
                'saturday':  {'start': saturday_start, 'end': saturday_end},
                'sunday':    {'start': sunday_start, 'end': sunday_end}
            },
            'skill1': skill1,
            'skill2': skill2,
            'skill3': skill3
        }

        return jsonify({
            'message': 'Profile Updated!',
            'user': {
                'email': email,
                'monday_start': monday_start,
                'monday_end': monday_end,
                'skill3': skill3,
                'preferences': preferences
            }
        }), 201
    except Exception as e:
        print(f"Error saving profile: {str(e)}")
        return jsonify({'error': 'Server error'}), 500

