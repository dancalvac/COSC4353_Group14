from flask import Blueprint, request, jsonify
from db import get_connection

events_bp = Blueprint('events', __name__)


@events_bp.route('/create/event', methods=['POST'])
def create_event():
    try:
        data = request.get_json()
        eventName = data.get('eventName')
        description = data.get('description')
        address_one = data.get('addressOne')
        address_two = data.get('addressTwo')
        city = data.get('city')
        state = data.get('state')
        zipcode = data.get('zipcode')
        urgency = data.get('urgency')
        max_volunteers = data.get('maxVolunteers')
        eventDate = data.get('eventDate')
        skills = data.get('skills', [])

        # Validate required fields
        if not all([eventName, address_one, city, state, zipcode, urgency, max_volunteers, eventDate, skills]):
            return jsonify({'error': 'Fill in all fields'}), 400

        conn = get_connection()
        cursor = conn.cursor()

        insert_event_query = """
            INSERT INTO Events (event_name, description, address_one, address_two, city, state, zipcode, urgency, max_volunteers, event_date)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(insert_event_query, (
            eventName, description, address_one, address_two, city, state, zipcode, urgency, max_volunteers, eventDate
        ))
        event_id = cursor.lastrowid

        insert_skill_query = "INSERT INTO EventSkills (event_id, skill) VALUES (%s, %s)"
        for skill in skills:
            cursor.execute(insert_skill_query, (event_id, skill))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({'message': 'Event Created!'}), 201

    except Exception as e:
        print(f"Error creating new event: {str(e)}")
        return jsonify({'error': 'Server error'}), 500

@events_bp.route('/display/events', methods=['GET'])
def display_events():
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('''
            SELECT 
                e.event_id,
                e.event_name,
                e.description,
                CONCAT_WS(', ', e.address_one, e.address_two, e.city, e.state, e.zipcode) AS location,
                e.urgency,
                e.event_date,
                e.max_volunteers,
                COALESCE(GROUP_CONCAT(es.skill ORDER BY es.skill SEPARATOR ', '), '') AS skills
            FROM Events e
            LEFT JOIN EventSkills es ON e.event_id = es.event_id
            GROUP BY e.event_id
        ''')
        events = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify({"Events": events}), 200
    except Exception as e:
        print(f"Failed to display events: {str(e)}")
        return jsonify({'error': 'Server error'}), 500

@events_bp.route('/event/<int:event_id>', methods=['GET'])
def get_event(event_id):
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Events WHERE event_id = %s", (event_id,))
        event = cursor.fetchone()
        cursor.close()
        conn.close()
        if event:
            return jsonify({"event": event}), 200
        else:
            return jsonify({"error": "Event not found"}), 404
    except Exception as e:
        return jsonify({'error': 'Server error'}), 500

@events_bp.route('/edit/event/<int:event_id>', methods=['PATCH'])
def edit_event(event_id):
    try:
        data = request.get_json()
        # Update only the fields you want to allow editing
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE Events SET event_name=%s, description=%s, urgency=%s, event_date=%s, max_volunteers=%s
            WHERE event_id=%s
        """, (
            data.get('event_name'),
            data.get('description'),
            data.get('urgency'),
            data.get('event_date'),
            data.get('max_volunteers'),
            event_id
        ))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Event updated!'}), 200
    except Exception as e:
        print(f"Error updating event: {str(e)}")
        return jsonify({'error': 'Server error'}), 500
    

#@events_bp.request('/delete/event', methods=['DELETE'])
#def delete_event():