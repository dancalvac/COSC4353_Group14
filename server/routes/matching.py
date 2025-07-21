from flask import Blueprint, request, jsonify

matching_bp = Blueprint('matching', __name__)

@matching_bp.route('/matching', methods=['GET'])
def get_matching_data():
    try:
        # Hard coded values for now. Fetch data from database when it is set up
        sample_volunteers = [
            { "id": 1, "name": "Charity Smith", "skills": "First Aid, ASL" },
            { "id": 2, "name": "Henry Nguyen",   "skills": "Logistics, Driving" },
            { "id": 3, "name": "Max Gibson",    "skills": "Photography, Bilingual" },
            { "id": 4, "name": "Daniel Calvac", "skills": "Dogsitter, Carpenter"} ,
            { "id": 5, "name": "Test User", "skills": "Programmer", "email": "cosc4353group14@grr.la"}
        ]
        sample_events = [
            { "id": 1, "name": "Community Cleanup", "date": "07-15-2025" },
            { "id": 2, "name": "Fundraising Gala",  "date": "08-01-2025" },
            { "id": 3, "name": "Food Drive", "date": "09-10-2025" },
            { "id": 4, "name": "Puppy Pickup", "date": "10-17-2025"}
        ]

        return jsonify({"volunteers": sample_volunteers, "events": sample_events})
    except Exception as e:
         return jsonify({'error': 'Server error'}), 500