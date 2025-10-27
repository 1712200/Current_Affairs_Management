from flask import Flask, jsonify, request
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor

app = Flask(__name__)
CORS(app)

# PostgreSQL connection
def get_db_connection():
    conn = psycopg2.connect(
        host="localhost",
        database="usersdb",
        user="postgres",
        password="Pass@word",
        port=5432
    )
    return conn

# ---------------- ROUTES ----------------

# Get all users
@app.route('/api/users', methods=['GET'])
def get_users():
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute('SELECT * FROM users ORDER BY id ASC')
        users = cur.fetchall()
        cur.close()
        conn.close()
        return jsonify(users)
    except Exception as e:
        print("Error fetching users:", e)
        return jsonify({"error": "Server error"}), 500


# Add new user
@app.route('/api/users', methods=['POST'])
def add_user():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        mobile = data.get('mobile')
        department = data.get('department')
        role = data.get('role')
        work_location = data.get('work_location')

        if not name or not email:
            return jsonify({"error": "Name and Email are required"}), 400

        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("""
            INSERT INTO users (name, email, mobile, department, role, work_location)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING *;
        """, (name, email, mobile, department, role, work_location))
        new_user = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        return jsonify(new_user)
    except Exception as e:
        print("Error adding user:", e)
        return jsonify({"error": "Server error while adding user"}), 500


# Update user
@app.route('/api/users/<int:id>', methods=['PUT'])
def update_user(id):
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        mobile = data.get('mobile')
        department = data.get('department')
        role = data.get('role')
        work_location = data.get('work_location')

        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("""
            UPDATE users
            SET name=%s, email=%s, mobile=%s, department=%s, role=%s, work_location=%s
            WHERE id=%s RETURNING *;
        """, (name, email, mobile, department, role, work_location, id))
        updated_user = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()

        if updated_user is None:
            return jsonify({"error": "User not found"}), 404
        return jsonify(updated_user)
    except Exception as e:
        print("Error updating user:", e)
        return jsonify({"error": "Server error"}), 500


# Delete user
@app.route('/api/users/<int:id>', methods=['DELETE'])
def delete_user(id):
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("DELETE FROM users WHERE id=%s RETURNING *;", (id,))
        deleted_user = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()

        if deleted_user is None:
            return jsonify({"error": "User not found"}), 404
        return jsonify({"message": "User deleted successfully"})
    except Exception as e:
        print("Error deleting user:", e)
        return jsonify({"error": "Server error"}), 500


# ---------------- RUN SERVER ----------------
if __name__ == '__main__':
    print("Flask server running on http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
