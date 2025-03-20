from database import Database

def setup_database():
    print("Setting up database and adding test user...")
    db = Database()
    try:
        # Register a test user
        result = db.register_user("TEST001", "Test User", "testpass123")
        print(f"Registration result: {result['message']}")
        
        # View the database contents
        print("\nViewing database contents:")
        db.cursor.execute("SELECT * FROM users")
        users = db.cursor.fetchall()
        
        print("\n=== Database Contents ===")
        print("Total users:", len(users))
        print("\nUser Details:")
        print("-" * 80)
        print(f"{'ID':<5} {'License Number':<20} {'Name':<30} {'Created At'}")
        print("-" * 80)
        
        for user in users:
            print(f"{user[0]:<5} {user[1]:<20} {user[2]:<30} {user[4]}")
            
    except Exception as e:
        print(f"Error setting up database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    setup_database() 