from flask import Blueprint, request, jsonify
from db import get_connection
from datetime import datetime

matching_bp = Blueprint('matching', __name__)
update_volunteer_history_bp = Blueprint('update_volunteer_history', __name__)

@matching_bp.route('/matching', methods=['GET'])
def get_matching_data():
    try:
        #Form connection with database
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        #Create query to grab all events that have not hit the max volunteer limit
        cursor.execute('''
            SELECT 
                e.event_id, 
                e.event_name, 
                e.event_date
            FROM Events e
            LEFT JOIN (
                SELECT event_id, COUNT(*) AS assigned_count
                FROM UserHistory
                WHERE event_status = 'Assigned'
                GROUP BY event_id
            ) uh ON e.event_id = uh.event_id
            WHERE COALESCE(uh.assigned_count, 0) < e.max_volunteers
        ''')
        events = cursor.fetchall()

        sample_events = [
            {
                "id": row["event_id"],
                "name": row["event_name"],
                "date": row["event_date"].strftime('%m-%d-%Y')
            }
            for row in events
        ]

        # Create query to look for all users that do not have an event assigned to them
        cursor.execute("""
            SELECT Users.user_id, Users.full_name, GROUP_CONCAT(UserSkills.skill SEPARATOR ", ") AS skills, Users.email
            FROM Users
            JOIN UserSkills ON Users.user_id = UserSkills.user_id
            WHERE NOT EXISTS (
                    SELECT 1 
                    FROM UserHistory 
                    WHERE UserHistory.user_id = Users.user_id 
                    AND UserHistory.event_status = 'Assigned'
                )
            GROUP BY Users.user_id;
        """)
        volunteers = cursor.fetchall()

        cursor.close()
        conn.close()

        sample_volunteers = [
            {
                "id": row["user_id"],
                "name": row["full_name"],
                "skills": row["skills"],
                "email": row["email"]
            }
            for row in volunteers
        ]

        return jsonify({"volunteers": sample_volunteers, "events": sample_events})
    except Exception as e:
         return jsonify({'error': 'Server error', 'error_message': f'{e}'}), 500
    
@matching_bp.route('/update_volunteer_history', methods=['POST'])
def add_event_to_user_history():
    try:   
        data = request.get_json()
        user_id = data.get('user_id')
        event_id = data.get('event_id')
        event_date = data.get('event_date')

        if not (user_id and event_id and event_date):
            return jsonify({"error":"User ID or Event ID or Event Date is null"}), 400
        
        try:
            # Expecting MM-DD-YYYY input; parse and format to MySQL DATETIME string
            formatted_event_date = datetime.strptime(event_date, "%m-%d-%Y").strftime("%Y-%m-%d 12:00:00")
        except ValueError:
            return jsonify({"error": "Invalid date format, expected MM-DD-YYYY"}), 400

        #Form connection with database
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        #Create query to first get the number of already assigned users to the given event
        cursor.execute('''
            SELECT 
                e.max_volunteers,
                COUNT(uh.user_id) AS assigned_count
            FROM Events e
            LEFT JOIN UserHistory uh 
                ON e.event_id = uh.event_id AND uh.event_status = 'Assigned'
            WHERE e.event_id = %s
            GROUP BY e.event_id
        ''', (event_id,))
        row = cursor.fetchone()

        # Validate assigned count is less than max volunteers
        if row and row['assigned_count'] >= row['max_volunteers']:
            return jsonify({'error': 'Event is already at max capacity'}), 400
        
        # Update database when we know assigned count is less than max
        cursor.execute('''
            INSERT INTO UserHistory (event_status, event_id, user_id, assigned_date) 
            VALUES (%s, %s, %s, %s)
        ''', ("Assigned", event_id, user_id, formatted_event_date))
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({'status': 'Success'}), 200
    except Exception as e:
        return jsonify({'error': 'Server error', 'error_message': f'{e}'}), 500