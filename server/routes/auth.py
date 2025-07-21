from flask import Blueprint, request, jsonify

auth_bp = Blueprint('auth', __name__)

# Hardcoded credentials for testing
HARDCODED_USERS = {
    'admin@example.com': {
        'password': 'admin123',
        'role': 'admin'
    },
    'volunteer@example.com': {
        'password': 'volunteer123',
        'role': 'volunteer'
    }
}

ADMIN_ACCESS_CODE = 'ADMIN2024'

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        
        # Check if user exists and password matches
        if email in HARDCODED_USERS and HARDCODED_USERS[email]['password'] == password:
            user = HARDCODED_USERS[email]
            return jsonify({
                'message': 'Login successful',
                'user': {
                    'email': email,
                    'role': user['role']
                }
            }), 200
        else:
            return jsonify({'error': 'Invalid email or password'}), 401
            
    except Exception as e:
        return jsonify({'error': 'Server error'}), 500

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        is_admin = data.get('isAdmin', False)
        access_code = data.get('accessCode')
        
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        
        # Check if user already exists
        if email in HARDCODED_USERS:
            return jsonify({'error': 'User already exists'}), 409
        
        # If registering as admin, check access code
        if is_admin:
            if not access_code or access_code != ADMIN_ACCESS_CODE:
                return jsonify({'error': 'Invalid admin access code'}), 401
            role = 'admin'
        else:
            role = 'volunteer'
        
        # Add new user to hardcoded users (in real app, save to database)
        HARDCODED_USERS[email] = {
            'password': password,
            'role': role
        }
        
        return jsonify({
            'message': 'Registration successful',
            'user': {
                'email': email,
                'role': role
            }
        }), 201
        
    except Exception as e:
        return jsonify({'error': 'Server error'}), 500