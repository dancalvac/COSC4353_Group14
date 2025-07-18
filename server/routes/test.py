from flask import Blueprint, jsonify

test_bp = Blueprint('test', __name__)

@test_bp.route('/test', methods=['GET'])
def test():
    return jsonify({'message': 'Hello from Flask!'})

@test_bp.route('/api/status', methods=['GET'])
def status():
    return jsonify({'status': 'Server is running', 'service': 'Volunteer Management System'})