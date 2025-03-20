from database import Database

def view_database():
    db = Database()
    try:
        # Get all users
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
        print(f"Error viewing database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    view_database() 