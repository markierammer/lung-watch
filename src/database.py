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
            self.cursor = self.connection.cursor(dictionary=True)  # Use dictionary cursor
            self.create_tables()
            print("Successfully connected to MySQL database")
        except Error as e:
            print(f"Error connecting to MySQL Database: {e}")
            raise Exception("Failed to connect to database. Please check your MySQL credentials and make sure the database exists.")

    def create_tables(self):
        if not self.connection or not self.cursor:
            raise Exception("Database connection not established")
            
        try:
            # Create users table with new fields
            self.cursor.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    license_number VARCHAR(50) UNIQUE NOT NULL,
                    name VARCHAR(100) NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    email VARCHAR(255),
                    specialization VARCHAR(100),
                    hospital VARCHAR(255),
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

    def register_user(self, license_number, name, password, email=None, specialization=None, hospital=None):
        try:
            # Check if user already exists
            self.cursor.execute("SELECT * FROM users WHERE license_number = %s", (license_number,))
            if self.cursor.fetchone():
                return False, "License number already registered"

            # Hash the password
            hashed_password = hashlib.sha256(password.encode()).hexdigest()

            # Insert new user
            query = """
                INSERT INTO users (license_number, name, password, email, specialization, hospital)
                VALUES (%s, %s, %s, %s, %s, %s)
            """
            values = (license_number, name, hashed_password, email, specialization, hospital)
            
            print("Executing query with values:", values)  # Debug print
            self.cursor.execute(query, values)
            self.connection.commit()

            # Get the user data to return
            self.cursor.execute("""
                SELECT id, license_number, name, email, specialization, hospital
                FROM users WHERE license_number = %s
            """, (license_number,))
            user = self.cursor.fetchone()
            
            print("Successfully registered user:", user)  # Debug print
            return True, user

        except Error as e:
            print(f"Error in register_user: {e}")
            self.connection.rollback()
            return False, str(e)

    def login_user(self, license_number, password):
        try:
            # Hash the password
            hashed_password = hashlib.sha256(password.encode()).hexdigest()

            # Get user with all fields except password
            query = """
                SELECT id, license_number, name, email, specialization, hospital
                FROM users 
                WHERE license_number = %s AND password = %s
            """
            self.cursor.execute(query, (license_number, hashed_password))
            user = self.cursor.fetchone()
            
            if user:
                print("Login successful for user:", user)
                return True, user
            return False, "Invalid credentials"

        except Error as e:
            print(f"Error in login_user: {e}")
            return False, str(e)

    def check_license_exists(self, license_number):
        """Check if a license number already exists"""
        if not self.connection or not self.cursor:
            raise Exception("Database connection not established")
            
        try:
            query = "SELECT COUNT(*) as count FROM users WHERE license_number = %s"
            self.cursor.execute(query, (license_number,))
            result = self.cursor.fetchone()
            return result['count'] > 0
        except Error as e:
            print(f"Error checking license number: {e}")
            return False

    def __del__(self):
        if hasattr(self, 'connection') and self.connection.is_connected():
            self.cursor.close()
            self.connection.close()
            print("Database connection closed")
