from flask import Blueprint, jsonify, request
from src.models.models import db, User
from werkzeug.security import generate_password_hash, check_password_hash
import re # For email validation
import jwt # For token generation
import datetime # For token expiration
from functools import wraps # For decorator
from flask import current_app # To access app.config

user_bp = Blueprint("user_bp", __name__)

# Helper for email validation
def is_valid_email(email):
    regex = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
    return re.match(regex, email)

# --- Token Verification Decorator ---
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            auth_header = request.headers["Authorization"]
            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]

        if not token:
            return jsonify({"message": "Token is missing!"}), 401

        try:
            data = jwt.decode(token, current_app.config["SECRET_KEY"], algorithms=["HS256"])
            current_user = User.query.get(data["user_id"])
            if not current_user:
                return jsonify({"message": "Token is invalid or user not found!"}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token has expired!"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Token is invalid!"}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated

@user_bp.route("/register", methods=["POST"])
def register_user():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body is missing"}), 400

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    phone_number = data.get("phone_number")
    profile_image_url = data.get("profile_image_url")

    if not username or not email or not password:
        return jsonify({"error": "Missing username, email, or password"}), 400

    if not is_valid_email(email):
        return jsonify({"error": "Invalid email format"}), 400
    
    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters long"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"error": f"User with username {username} already exists"}), 409
    if User.query.filter_by(email=email).first():
        return jsonify({"error": f"User with email {email} already exists"}), 409

    new_user = User(username=username, email=email, phone_number=phone_number, profile_image_url=profile_image_url)
    new_user.set_password(password) 

    db.session.add(new_user)
    db.session.commit()
    return jsonify({
        "message": "User registered successfully", 
        "user": {
            "id": new_user.id, 
            "username": new_user.username, 
            "email": new_user.email,
            "phone_number": new_user.phone_number,
            "profile_image_url": new_user.profile_image_url
        }
    }), 201

@user_bp.route("/login", methods=["POST"])
def login_user():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body is missing"}), 400

    email = data.get("email") 
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400

    user = User.query.filter_by(email=email).first()

    if user and user.check_password(password):
        token = jwt.encode({
            "user_id": user.id,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24) # Token expires in 24 hours
        }, current_app.config["SECRET_KEY"], algorithm="HS256")
        
        return jsonify({
            "message": "Login successful",
            "token": token,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "phone_number": user.phone_number,
                "profile_image_url": user.profile_image_url
            }
        }), 200
    
    return jsonify({"error": "Invalid email or password"}), 401

@user_bp.route("/users/<int:user_id_from_url>/profile", methods=["GET"])
@token_required
def get_user_profile(current_user, user_id_from_url):
    if current_user.id != user_id_from_url:
        return jsonify({"error": "Access denied: You can only view your own profile."}), 403
    
    return jsonify({
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "phone_number": current_user.phone_number,
        "profile_image_url": current_user.profile_image_url
    }), 200

@user_bp.route("/users/<int:user_id_from_url>/profile", methods=["PUT"])
@token_required
def update_user_profile(current_user, user_id_from_url):
    if current_user.id != user_id_from_url:
        return jsonify({"error": "Access denied: You can only update your own profile."}), 403

    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body is missing"}), 400

    if "username" in data and data["username"] != current_user.username:
        new_username = data["username"]
        if User.query.filter(User.id != current_user.id, User.username == new_username).first():
            return jsonify({"error": f"Username {new_username} is already taken"}), 409
        current_user.username = new_username
    
    if "email" in data and data["email"] != current_user.email:
        new_email = data["email"]
        if not is_valid_email(new_email):
            return jsonify({"error": "Invalid email format"}), 400
        if User.query.filter(User.id != current_user.id, User.email == new_email).first():
            return jsonify({"error": f"Email {new_email} is already registered"}), 409
        current_user.email = new_email

    if "phone_number" in data:
        current_user.phone_number = data["phone_number"]
    
    if "profile_image_url" in data:
        current_user.profile_image_url = data["profile_image_url"]

    if "password" in data and data["password"]:
        if len(data["password"]) < 6:
            return jsonify({"error": "New password must be at least 6 characters long"}), 400
        current_user.set_password(data["password"])

    db.session.commit()
    return jsonify({
        "message": "Profile updated successfully",
        "user": {
            "id": current_user.id,
            "username": current_user.username,
            "email": current_user.email,
            "phone_number": current_user.phone_number,
            "profile_image_url": current_user.profile_image_url
        }
    }), 200

