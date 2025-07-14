from flask import Blueprint, request, jsonify

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
        'skills': {
            'skill1': '',
            'skill2': '',
            'skill3': ''
        }
    }
}

@profile_bp.route('/volunteer/profile', methods=['POST'])
def get_profile():
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

        if not email or not name or not password or not address1 or not city or not state or not zipcode:
            return jsonify({'error': 'Fill in fields with *'}), 400
        
        HARDCODED_VOLUNTEER_PROFILE[email] = {
            'password': password,
            'role': 'volunteer',
            'address1': address1,
            'address2': address2,
            'city': city,
            'state': state,
            'zipcode': zipcode,
            'preferences': preferences
        }

        return jsonify({
            'message': 'Profile Updated!',
            'user': {
                'email': email
            }
        }), 201
    except Exception as e:
        return jsonify({'error': 'Server error'}), 500
