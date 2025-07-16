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
        'skill1': '',
        'skill2': '',
        'skill3': ''
    }
}

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

