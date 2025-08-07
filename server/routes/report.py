from flask import Blueprint, jsonify
from db import get_connection

datareport_bp = Blueprint('datareport', __name__)

@datareport_bp.route('/datareport/report', methods=['GET'])
def get_volunteer_report():
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        # Get all volunteers with their info
        cursor.execute("""
            SELECT user_id, full_name, email, city, state, preferences
            FROM Users
            WHERE role = 'Volunteer'
        """)
        volunteers = cursor.fetchall()

        # For each volunteer, get their event history (event names)
        for volunteer in volunteers:
            cursor.execute("""
                SELECT e.event_name
                FROM UserHistory uh
                JOIN Events e ON uh.event_id = e.event_id
                WHERE uh.user_id = %s
            """, (volunteer['user_id'],))
            events = [row['event_name'] for row in cursor.fetchall()]
            volunteer['event_history'] = events

        cursor.close()
        conn.close()
        return jsonify({"volunteers": volunteers}), 200
    except Exception as e:
        print(f"Error in /datareport/report: {e}")
        return jsonify({'error': 'Server error'}), 500

@datareport_bp.route('/datareport/event_report', methods=['GET'])
def get_event_report():
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        # Get all events with required info, sorted by event_date ascending
        cursor.execute("""
            SELECT event_id, event_name, city, state, event_date, urgency, max_volunteers
            FROM Events
            ORDER BY event_date ASC
        """)
        events = cursor.fetchall()

        # For each event, get the list of volunteer names signed up
        for event in events:
            cursor.execute("""
                SELECT u.full_name
                FROM UserHistory uh
                JOIN Users u ON uh.user_id = u.user_id
                WHERE uh.event_id = %s
            """, (event['event_id'],))
            volunteers = [row['full_name'] for row in cursor.fetchall()]
            event['volunteers'] = volunteers

        cursor.close()
        conn.close()
        return jsonify({"events": events}), 200
    except Exception as e:
        print(f"Error in /datareport/event_report: {e}")
        return jsonify({'error': 'Server error'}), 500