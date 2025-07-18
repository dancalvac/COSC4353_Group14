from flask import Blueprint, jsonify, request

volunteer_history_bp = Blueprint('volunteer_history', __name__)

# Sample volunteer history data - you would later retrieve this from a database
VOLUNTEER_HISTORY = {
    "volunteer1@example.com": [
        {
            "participationStatus": "Completed",
            "eventName": "Food Bank Fair",
            "location": "1234 Main Street, Houston, TX",
            "requiredSkills": "Teamwork, Communication",
            "urgency": "Medium",
            "eventDate": "February 14, 2024",
            "eventDescription": "Lorem ipsum dolor sit amet"
        },
        {
            "participationStatus": "Upcoming",
            "eventName": "Community Garden Cleanup",
            "location": "5678 Park Avenue, Houston, TX",
            "requiredSkills": "Physical labor, Gardening",
            "urgency": "Low",
            "eventDate": "August 25, 2025",
            "eventDescription": "Help clean up and prepare the community garden for fall planting."
        }
    ]
}

@volunteer_history_bp.route('/volunteer/history', methods=['GET'])
def get_volunteer_history():
    # In a real app, you would get the user email from a session or token
    email = request.args.get('email', 'volunteer1@example.com')
    
    # Return the volunteer's history or an empty list if not found
    history = VOLUNTEER_HISTORY.get(email, [])
    return jsonify({"volunteer_history": history})