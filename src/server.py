from flask import Flask, request, jsonify
from flask_cors import CORS
from database import Database

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

db = Database()

@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        print("Received registration data:", data)  # Debug print
        
        # Check required fields
        required_fields = ['license_number', 'name', 'password']
        if not all(field in data for field in required_fields):
            return jsonify({
                'success': False,
                'message': 'Missing required fields'
            }), 400

        # Get optional fields
        email = data.get('email')
        specialization = data.get('specialization')
        hospital = data.get('hospital')

        success, result = db.register_user(
            data['license_number'],
            data['name'],
            data['password'],
            email,
            specialization,
            hospital
        )

        if success:
            return jsonify({
                'success': True,
                'user': result
            }), 201
        
        return jsonify({
            'success': False,
            'message': result
        }), 400

    except Exception as e:
        print(f"Error in register endpoint: {e}")  # Debug print
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        if not data or 'license_number' not in data or 'password' not in data:
            return jsonify({
                'success': False,
                'message': 'Missing credentials'
            }), 400

        success, result = db.login_user(data['license_number'], data['password'])
        
        if success:
            return jsonify({
                'success': True,
                'user': result
            }), 200
        
        return jsonify({
            'success': False,
            'message': result
        }), 401

    except Exception as e:
        print(f"Error in login endpoint: {e}")
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000) 