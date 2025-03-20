from database import Database

def test_login():
    print("=== Testing Login Functionality ===\n")
    db = Database()
    
    try:
        # Test Case 1: Login with correct credentials
        print("Test Case 1: Login with correct credentials")
        print("License: TEST123, Password: testpass123")
        result = db.login_user("TEST123", "testpass123")
        print(f"Result: {result['message']}")
        if result['success']:
            print(f"User details: {result['user']}")
        print("-" * 50)
        
        # Test Case 2: Login with wrong password
        print("\nTest Case 2: Login with wrong password")
        print("License: TEST123, Password: wrongpassword")
        result = db.login_user("TEST123", "wrongpassword")
        print(f"Result: {result['message']}")
        print("-" * 50)
        
        # Test Case 3: Login with non-existent license
        print("\nTest Case 3: Login with non-existent license")
        print("License: NONEXISTENT, Password: anypassword")
        result = db.login_user("NONEXISTENT", "anypassword")
        print(f"Result: {result['message']}")
        print("-" * 50)
        
        # Test Case 4: Login with another valid user
        print("\nTest Case 4: Login with another valid user")
        print("License: TEST001, Password: testpass123")
        result = db.login_user("TEST001", "testpass123")
        print(f"Result: {result['message']}")
        if result['success']:
            print(f"User details: {result['user']}")
        print("-" * 50)
        
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    test_login() 