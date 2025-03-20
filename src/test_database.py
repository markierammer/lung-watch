from database import Database

def test_database():
    # Initialize database
    db = Database()
    
    try:
        # Test registration
        print("Testing registration...")
        result = db.register_user("TEST123", "Test User", "testpass123")
        print(f"Registration result: {result['message']}")
        
        # Test duplicate registration
        print("\nTesting duplicate registration...")
        result = db.register_user("TEST123", "Test User", "testpass123")
        print(f"Duplicate registration result: {result['message']}")
        
        # Test login with correct credentials
        print("\nTesting login with correct credentials...")
        result = db.login_user("TEST123", "testpass123")
        print(f"Login result: {result['message']}")
        if result['success']:
            print(f"User details: {result['user']}")
        
        # Test login with wrong password
        print("\nTesting login with wrong password...")
        result = db.login_user("TEST123", "wrongpassword")
        print(f"Login result: {result['message']}")
        
        # Test login with non-existent account
        print("\nTesting login with non-existent account...")
        result = db.login_user("NONEXISTENT", "password")
        print(f"Login result: {result['message']}")
            
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        # Close the connection
        db.close()

if __name__ == "__main__":
    test_database() 