from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from db import get_connection

auth_bp = Blueprint('auth', __name__)


ADMIN_ACCESS_CODE = 'ADMIN_SUMMER2025'

@auth_bp.route('/login', methods=['POST'])
def test_login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        #Check if email and password values are filled
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        #Form connection with database
        conn = get_connection()
        cursor = conn.cursor()
        #Create query to look for user with that specific login credentials
        cursor.execute('SELECT user_id, full_name, email, password, role FROM Users WHERE email = %s', (email,))
        user = cursor.fetchone()
        
        cursor.close()
        conn.close()
        if not user:
            return jsonify({'error': 'Invalid email or password'}), 401

        # Check password
        if check_password_hash(user[3], password):  
            
            return jsonify({
                'message': 'Login successful!',
                'user': {
                    'user_id': user[0],
                    'full_name': user[1],
                    'email': user[2],
                    'role': user[4]
                }
            }), 200
        else:
            return jsonify({'error': 'Invalid credentials'}), 401

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/register', methods=['POST'])
def test_register():
    conn = None
    cursor = None
    try:
        data = request.get_json()
        full_name = data.get('fullName')
        email = data.get('email')
        password = data.get('password')
        is_admin = data.get('isAdmin', False)
        access_code = data.get('accessCode')

        if not email or not password or not full_name:
            return jsonify({'error': 'Fill in all fields'}), 400
        #Form connection with database
        conn = get_connection()
        cursor = conn.cursor()
        #Create query to look if user exists
        cursor.execute('SELECT user_id, full_name, email, password, role FROM Users WHERE email = %s', (email,))
        user = cursor.fetchone()
        if user:
            return jsonify({'error': 'User already exists'}), 409
        
        # Hash password
        hashed_password = generate_password_hash(password)
    
        query = 'INSERT INTO Users (full_name, email, password, role) VALUES (%s, %s, %s, %s)'
        if is_admin:
            if access_code == ADMIN_ACCESS_CODE:
                cursor.execute(query, (full_name, email, hashed_password, 'Admin'))
            else:
                return jsonify({'error': 'Invalid admin access code'}), 401
        else:
            cursor.execute(query, (full_name, email, hashed_password, 'Volunteer'))
        
        #Need to add if-else statement in case user was not created
        # CHECK IF INSERT WAS SUCCESSFUL
        if cursor.rowcount > 0:  # This is the key check!
            conn.commit()  # Don't forget to commit!
            new_user_id = cursor.lastrowid  # Get the new user's ID
            print(new_user_id)
            
            return jsonify({
                'message': 'User registered successfully!',
                'user_id': new_user_id
            }), 201  # 201 = Created
        else:
            conn.rollback()  # Rollback if something went wrong
            
            return jsonify({'error': 'Failed to create user'}), 500

    except Exception as e:
        print(f"Registration error: {str(e)}")  # Debug print
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