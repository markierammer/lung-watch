from flask import Flask, request, jsonify
from flask_cors import CORS
from database import Database

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.json
        license_number = data.get('license_number')
        name = data.get('name')
        password = data.get('password')

        if not all([license_number, name, password]):
            return jsonify({
                'success': False,
                'message': 'All fields are required'
            }), 400

        db = Database()
        result = db.register_user(license_number, name, password)
        db.close()

        if result['success']:
            return jsonify(result), 201
        return jsonify(result), 400

    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.json
        license_number = data.get('license_number')
        password = data.get('password')

        if not all([license_number, password]):
            return jsonify({
                'success': False,
                'message': 'All fields are required'
            }), 400

        db = Database()
        result = db.login_user(license_number, password)
        db.close()

        if result['success']:
            return jsonify(result), 200
        return jsonify(result), 401

    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000) 