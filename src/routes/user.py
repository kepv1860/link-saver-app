from flask import Blueprint, jsonify, request
from src.models.models import db, User # Corrected import

user_bp = Blueprint("user_bp", __name__)

@user_bp.route("/test_db_add", methods=["POST"])
def test_db_add():
    data = request.get_json()
    if not data or not data.get("username") or not data.get("email"):
        return jsonify({"error": "Missing username or email"}), 400
    
    # Check if user already exists by username or email
    existing_user_by_username = User.query.filter_by(username=data["username"]).first()
    existing_user_by_email = User.query.filter_by(email=data["email"]).first()

    if existing_user_by_username:
        return jsonify({"error": f"User with username '{data['username']}' already exists"}), 400
    if existing_user_by_email:
        return jsonify({"error": f"User with email '{data['email']}' already exists"}), 400

    new_user = User(username=data["username"], email=data["email"])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User added successfully", "user": {"id": new_user.id, "username": new_user.username, "email": new_user.email}}), 201

@user_bp.route("/test_db_get/<username>", methods=["GET"])
def test_db_get(username):
    user = User.query.filter_by(username=username).first()
    if user:
        return jsonify({"id": user.id, "username": user.username, "email": user.email})
    return jsonify({"error": "User not found"}), 404
