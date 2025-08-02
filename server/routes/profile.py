from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from db import get_connection

profile_bp = Blueprint('profile', __name__)

@profile_bp.route('/updateUserProfile', methods=['PATCH'])
def save_profile():
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


@profile_bp.route('/displayVolunteerProfile', methods=['GET'])
def get_volunteer_profile():
    conn = None
    cursor = None
    try:
        user_id = request.args.get('userId')

        if not user_id:
            
            return jsonify({'error': 'User ID is required'}), 400
        
        conn = get_connection()
        cursor = conn.cursor()
        
        select_query = """
        SELECT full_name, email, 
        CONCAT(address_one, ' ', address_two, ' ', city, ', ', state, ' ', zipcode) as address
        FROM Users
        WHERE user_id = %s"""
        cursor.execute(select_query, (user_id, ))
        user = cursor.fetchone()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        #When a person is first registering the address will  be blank
        #address = user[2]
        #if not address:
         #   address = 'N/A'
        
        return jsonify({
            'message': 'User details',
            'full_name': user[0],
            'email': user[1],
            'address': user[2]}), 200


    except Exception as e:
        print(f"Get error: {str(e)}")  # Debug print
        
        return jsonify({'error': str(e)}), 500
    finally:
        # Clean up connections
        if cursor:
            cursor.close()
        if conn:
            conn.close()