from flask import Blueprint, jsonify
from db import get_connection

test_bp = Blueprint('test', __name__)

@test_bp.route('/test')
def test_route():  # ← Changed name
    return jsonify({'message': 'Hello from Flask!'})  # Better to use consistent JSON

@test_bp.route('/health')
def health():
    return {'status': 'ok'}, 200

@test_bp.route('/api/tables', methods=['GET'])
def tables():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        table_names = [row[0] for row in tables]
        return jsonify({'Tables': table_names}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@test_bp.route('/api/status', methods=['GET'])
def status():
    return jsonify({'status': 'Server is running', 'service': 'Volunteer Management System'})