from flask import Blueprint, request, jsonify

events_bp = Blueprint('events', __name__)

# hardcoded events later to be replaced with database calls
EVENTS = [
    {
        "id": 1,
        "title": "Community Garden Cleanup",
        "date": "2025-08-15",
        "location": "Memorial Park",
        "description": "Help clean up and prepare the community garden for fall planting.",
        "status": "open",
        "volunteers_needed": 10,
        "volunteers_assigned": 3
    },
    {
        "id": 2,
        "title": "Food Bank Distribution",
        "date": "2025-08-20",
        "location": "Downtown Food Bank",
        "description": "Assist with sorting and distributing food to families in need.",
        "status": "open",
        "volunteers_needed": 15,
        "volunteers_assigned": 7
    },
]

@events_bp.route('/events', methods=['GET'])
def get_events():
    return jsonify({"events": EVENTS})

@events_bp.route('/events/<int:event_id>', methods=['GET'])
def get_event(event_id):
    event = next((event for event in EVENTS if event["id"] == event_id), None)
    if event:
        return jsonify({"event": event})
    return jsonify({"error": "Event not found"}), 404

@events_bp.route('/create/event', methods=['POST'])
def create_event():
    try:
        data = request.get_json()
        event_name = data.get('eventName')
        description = data.get('description')
        location = data.get('location')
        urgency = data.get('urgency')
        skill1 = data.get('skill1')
        skill2 = data.get('skill2')
        skill3 = data.get('skill3')
        skill4 = data.get('skill4')
        skill5 = data.get('skill5')
        event_date = data.get('eventDate')

        if not event_name or not location or not urgency or not skill1 or not event_date:
            return jsonify({'error': 'Fill in all fields'}), 400
        
        HARDCODED_EVENTS[event_name] = {
            'description': description,
            'location': location,
            'urgency': urgency,
            'urgency': urgency,
            'skill1': skill1,
            'skill2': skill2,
            'skill3': skill3,
            'skill4': skill4,
            'skill5': skill5,
            'event_date': event_date,
        }
        print("Created Event!")
        print('Event Name:', event_name, 'Description:', description, 'Location:', location, 'Urgency:', urgency, 'Skill 5:', skill5, 'Event Date:', event_date)
        return jsonify({
            'message': 'backend stuff',
            'event_name': event_name,
            'event': {
                'description': description,
                'location': location,
                'event_date': event_date
            }
        }), 201
    except Exception as e:
        print(f"Error creating new event: {str(e)}")
        return jsonify({'error': 'Server error'}), 500

#@events_bp.request('/edit/event', methods=['PATCH'])
#def edit_event():
    
#@events_bp.request('/delete/event', methods=['DELETE'])
#def delete_event():

