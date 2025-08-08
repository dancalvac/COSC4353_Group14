from flask import Blueprint, jsonify, request
from db import get_connection

volunteer_history_bp = Blueprint('volunteer_history', __name__)

@volunteer_history_bp.route('/volunteer/history', methods=['GET'])
def get_volunteer_history():
    try:
        # In a real app, you would get the user email from a session or token
        userID = request.args.get('userID')

        if not userID:
            return jsonify({"error": "Missing user id"}), 400
        
        #Form connection with database
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        #Create query to insert into volunteer history
        cursor.execute(f'''
            SELECT 
                uh.event_status,
                e.event_id,
                e.event_name,
                e.description,
                CONCAT_WS(', ', e.address_one, e.address_two, e.city, e.state, e.zipcode) AS full_address,
                e.urgency,
                e.event_date,
                GROUP_CONCAT(es.skill SEPARATOR ', ') AS required_skills
            FROM UserHistory uh
            JOIN Events e ON uh.event_id = e.event_id
            LEFT JOIN EventSkills es ON e.event_id = es.event_id
            WHERE uh.user_id = {userID}
            GROUP BY e.event_id, uh.event_status, e.event_name, e.description, e.address_one, e.address_two, e.city, e.state, e.zipcode, e.urgency, e.event_date
        ''')
        history = cursor.fetchall()

        cursor.close()
        conn.close()

        formatted_history = []
        for row in history:
            formatted_history.append({
                "participationStatus": row["event_status"],
                "eventName": row["event_name"],
                "location": row["full_address"],
                "requiredSkills": row["required_skills"] or "N/A",
                "urgency": row["urgency"],
                "eventDate": row["event_date"],
                "eventDescription": row["description"],
            })

        return jsonify({"volunteer_history": formatted_history}), 200
    except Exception as e:
        return jsonify({"error": "Server Error", "error_message": f"{e}"}), 500
    