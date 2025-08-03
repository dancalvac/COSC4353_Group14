from flask import Blueprint, request, jsonify
import os
import requests
from dotenv import load_dotenv
from db import get_connection

load_dotenv() # Load .env file

ONESIGNAL_APP_ID = os.getenv('ONESIGNAL_APP_ID')
ONESIGNAL_API_KEY = os.getenv('ONESIGNAL_API_KEY')

notifications_bp = Blueprint('notification', __name__)
get_notifications_bp = Blueprint('get_notification', __name__)

@notifications_bp.route('/send_notification', methods=['POST'])
def send_email_notifications():
    try:
        data = request.get_json()
        emails = data.get('emails')
        event = data.get('event')

        if not emails or not event:
            return jsonify({"error": "Missing emails or event_name"}), 400
        elif not isinstance(emails, list):
            return jsonify({"error": "Email field must be a list"}), 400

        url = "https://api.onesignal.com/notifications?c=email"
        headers = {
            "Authorization": f"Key {ONESIGNAL_API_KEY}",
            "Content-Type": "application/json"
        }
        payload = {
            "app_id": f"{ONESIGNAL_APP_ID}",
            "email_subject": "Volunteer Assignment",
            "target_channel": "email",
            "email_from_name": "Cosc 4353 Group 14 ",
            "email_body": f"You have been assigned to {event}.",
            "email_to": emails
        }
        try:
            response = requests.post(url, json=payload, headers=headers)
            return jsonify({"status": "Notification sent", "details": response.json()}), 200
        except requests.exceptions.RequestException as e:
            return jsonify({"error": "Failed to send notification", "details": str(e)}), 500
    except Exception as e:
        return jsonify({'error': 'Server error'}), 500
    
@get_notifications_bp.route('/get_notification', methods=['GET'])
def get_notifications():
    try:
        userID = request.args.get('userID')

        if not userID:
            return jsonify({'error': 'Missing user_id'}), 400

        #Form connection with database
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        #Create query to pull data from volunteer history and events
        cursor.execute(f'''
            SELECT 
                e.event_name,
                CONCAT_WS(', ', e.address_one, e.address_two, e.city, e.state) AS location,
                e.event_date,
                e.urgency
            FROM UserHistory uh
            JOIN Events e ON uh.event_id = e.event_id
            WHERE uh.user_id = {userID}
        ''')
        rows = cursor.fetchall()
        
        notifications = [
            {
                "id": 1,
                "message": f"You have been selected to work at {row['event_name']}! This event is located at {row['location']} and will occur at {row['event_date']}.",
                "date": "", # Not sure what do with this field so leave it blank
                "priority": row['urgency'].lower()
            }
            for row in rows
        ]

        cursor.close()
        conn.close()

        return jsonify({'notifications': notifications}), 200
        
    except Exception as e:
        return jsonify({'error': 'Server error'}), 500
