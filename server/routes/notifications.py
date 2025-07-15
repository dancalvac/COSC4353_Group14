from flask import Blueprint, request, jsonify
import os
import requests
from dotenv import load_dotenv

load_dotenv() # Load .env file

ONESIGNAL_APP_ID = os.getenv('ONESIGNAL_APP_ID')
ONESIGNAL_API_KEY = os.getenv('ONESIGNAL_API_KEY')

notifications_bp = Blueprint('notification', __name__)

@notifications_bp.route('/send_notification', methods=['POST'])
def send_email_notifications():
    try:
        data = request.get_json()
        emails = data.get('emails')
        event = data.get('event')

        if not emails or not event:
            return jsonify({"error": "Missing emails or event_name"}), 400

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
            return jsonify({"status": "Notification sent", "details": response.json()})
        except requests.exceptions.RequestException as e:
            return jsonify({"error": "Failed to send notification", "details": str(e)}), 500
    except Exception as e:
        return jsonify({'error': 'Server error'}), 500
