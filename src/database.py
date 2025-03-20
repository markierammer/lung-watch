import mysql.connector
from mysql.connector import Error
import hashlib
import os

class Database:
    def __init__(self):
        self.connection = None
        self.cursor = None
        try:
            # Get credentials from environment variables or use defaults
            host = os.getenv('DB_HOST', 'localhost')
            user = os.getenv('DB_USER', 'root')
            password = os.getenv('DB_PASSWORD', 'root')  # Don't use empty string as default
            database = os.getenv('DB_NAME', 'lung_watch')
            
            if not password:
                raise Exception("Database password not set. Please set DB_PASSWORD environment variable.")
            
            print(f"Attempting to connect to MySQL with user: {user}")
            self.connection = mysql.connector.connect(
                host=host,
                user=user,
                password=password,
                database=database,
                auth_plugin='mysql_native_password'  # Explicitly specify authentication plugin
            )
            self.cursor = self.connection.cursor()
            self.create_tables()
            print("Successfully connected to MySQL database")
        except Error as e:
            print(f"Error connecting to MySQL Database: {e}")
            raise Exception("Failed to connect to database. Please check your MySQL credentials and make sure the database exists.")

    def create_tables(self):
        if not self.connection or not self.cursor:
            raise Exception("Database connection not established")
            
        try:
            # Create users table with simplified structure
            self.cursor.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    license_number VARCHAR(50) UNIQUE NOT NULL,
                    name VARCHAR(100) NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            self.connection.commit()
            print("Users table created/verified successfully")
        except Error as e:
            print(f"Error creating tables: {e}")
            raise

    def hash_password(self, password):
        """Hash a password using SHA-256"""
        return hashlib.sha256(password.encode()).hexdigest()

    def register_user(self, license_number, name, password):
        """Register a new user"""
        if not self.connection or not self.cursor:
            raise Exception("Database connection not established")
            
        try:
            # Check if user already exists
            if self.check_license_exists(license_number):
                return {"success": False, "message": "License number already registered"}
            
            hashed_password = self.hash_password(password)
            query = """
                INSERT INTO users (license_number, name, password)
                VALUES (%s, %s, %s)
            """
            self.cursor.execute(query, (license_number, name, hashed_password))
            self.connection.commit()
            print(f"Successfully registered user: {name}")
            return {"success": True, "message": "Registration successful"}
        except Error as e:
            print(f"Error registering user: {e}")
            return {"success": False, "message": "Registration failed"}

    def login_user(self, license_number, password):
        """Authenticate a user"""
        if not self.connection or not self.cursor:
            raise Exception("Database connection not established")
            
        try:
            # First check if user exists
            if not self.check_license_exists(license_number):
                return {"success": False, "message": "Account not found. Please register first."}
            
            hashed_password = self.hash_password(password)
            query = """
                SELECT id, license_number, name
                FROM users
                WHERE license_number = %s AND password = %s
            """
            self.cursor.execute(query, (license_number, hashed_password))
            user = self.cursor.fetchone()
            
            if user:
                print(f"Login successful for user: {user[2]}")
                return {
                    "success": True,
                    "message": "Login successful",
                    "user": {
                        'id': user[0],
                        'license_number': user[1],
                        'name': user[2]
                    }
                }
            return {"success": False, "message": "Invalid credentials"}
        except Error as e:
            print(f"Error logging in user: {e}")
            return {"success": False, "message": "Login failed"}

    def check_license_exists(self, license_number):
        """Check if a license number already exists"""
        if not self.connection or not self.cursor:
            raise Exception("Database connection not established")
            
        try:
            query = "SELECT COUNT(*) FROM users WHERE license_number = %s"
            self.cursor.execute(query, (license_number,))
            count = self.cursor.fetchone()[0]
            return count > 0
        except Error as e:
            print(f"Error checking license number: {e}")
            return False

    def close(self):
        """Close the database connection"""
        if self.cursor:
            self.cursor.close()
        if self.connection and self.connection.is_connected():
            self.connection.close()
            print("Database connection closed")
