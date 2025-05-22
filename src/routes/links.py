from flask import Blueprint, jsonify, request
from src.models.models import db, Link, User # Removed Goal for now as it's not in current scope
from datetime import datetime

# Placeholder for a function that would get current user ID from a token
# In a real app, this would involve JWT decoding or session management
def get_current_user_id_from_token():
    # For now, let's assume a header 'X-User-Id' is passed for testing, or a default user
    # THIS IS NOT SECURE AND IS FOR PLACEHOLDER PURPOSES ONLY
    return request.headers.get("X-User-Id", 1) # Default to user 1 if no header

links_bp = Blueprint("links_bp", __name__)

# Create a new link for the authenticated user
@links_bp.route("/links", methods=["POST"])
def create_link():
    user_id = get_current_user_id_from_token() # Get user_id from token/session
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found or not authenticated"}), 401

    data = request.get_json()
    if not data or not data.get("url"):
        return jsonify({"error": "Missing URL"}), 400

    new_link = Link(
        url=data["url"],
        title=data.get("title"),
        description=data.get("description"),
        user_id=user_id,
        tags=data.get("tags") # Assuming tags is a list of strings
        # goal_id=data.get("goal_id") # Optional: associate with a goal - removing for now
    )
    
    # if data.get("goal_id"):
    #     goal = Goal.query.get(data.get("goal_id"))
    #     if not goal or goal.user_id != user_id:
    #         return jsonify({"error": "Goal not found or does not belong to user"}), 404
    #     new_link.goal_id = data.get("goal_id")

    db.session.add(new_link)
    db.session.commit()
    return jsonify({
        "message": "Link created successfully", 
        "link": {
            "id": new_link.id, 
            "url": new_link.url, 
            "title": new_link.title, 
            "description": new_link.description,
            "user_id": new_link.user_id,
            "tags": new_link.tags,
            # "goal_id": new_link.goal_id
            "created_at": new_link.created_at.isoformat() if new_link.created_at else None,
            "updated_at": new_link.updated_at.isoformat() if new_link.updated_at else None
        }
    }), 201

# Get all links for the authenticated user
@links_bp.route("/links", methods=["GET"])
def get_links():
    user_id = get_current_user_id_from_token()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found or not authenticated"}), 401
    
    links = Link.query.filter_by(user_id=user_id).order_by(Link.created_at.desc()).all()
    return jsonify([{
        "id": link.id, 
        "url": link.url, 
        "title": link.title, 
        "description": link.description,
        "user_id": link.user_id,
        "tags": link.tags,
        # "goal_id": link.goal_id,
        "created_at": link.created_at.isoformat() if link.created_at else None,
        "updated_at": link.updated_at.isoformat() if link.updated_at else None
    } for link in links]), 200

# Get a specific link for the authenticated user
@links_bp.route("/links/<int:link_id>", methods=["GET"])
def get_link(link_id):
    user_id = get_current_user_id_from_token()
    link = Link.query.filter_by(id=link_id, user_id=user_id).first()
    if link:
        return jsonify({
            "id": link.id, 
            "url": link.url, 
            "title": link.title, 
            "description": link.description,
            "user_id": link.user_id,
            "tags": link.tags,
            # "goal_id": link.goal_id,
            "created_at": link.created_at.isoformat() if link.created_at else None,
            "updated_at": link.updated_at.isoformat() if link.updated_at else None
        }), 200
    return jsonify({"error": "Link not found or does not belong to user"}), 404

# Update a link for the authenticated user
@links_bp.route("/links/<int:link_id>", methods=["PUT"])
def update_link(link_id):
    user_id = get_current_user_id_from_token()
    link = Link.query.filter_by(id=link_id, user_id=user_id).first()
    if not link:
        return jsonify({"error": "Link not found or does not belong to user"}), 404

    data = request.get_json()
    if data.get("url"):
        link.url = data["url"]
    if "title" in data: # Allow empty string for title
        link.title = data["title"]
    if "description" in data: # Allow empty string for description
        link.description = data["description"]
    if "tags" in data: # Assuming tags is a list of strings
        link.tags = data["tags"]
    # if data.get("goal_id") is not None:
    #     if data["goal_id"] == "": # Allow disassociating from goal
    #         link.goal_id = None
    #     else:
    #         goal = Goal.query.get(data["goal_id"])
    #         if not goal or goal.user_id != user_id:
    #             return jsonify({"error": "Goal not found or does not belong to user"}), 404
    #         link.goal_id = data["goal_id"]
    link.updated_at = datetime.utcnow()

    db.session.commit()
    return jsonify({
        "message": "Link updated successfully", 
        "link": {
            "id": link.id, 
            "url": link.url, 
            "title": link.title, 
            "description": link.description,
            "user_id": link.user_id,
            "tags": link.tags,
            # "goal_id": link.goal_id,
            "created_at": link.created_at.isoformat() if link.created_at else None,
            "updated_at": link.updated_at.isoformat() if link.updated_at else None
        }
    }), 200

# Delete a link for the authenticated user
@links_bp.route("/links/<int:link_id>", methods=["DELETE"])
def delete_link(link_id):
    user_id = get_current_user_id_from_token()
    link = Link.query.filter_by(id=link_id, user_id=user_id).first()
    if not link:
        return jsonify({"error": "Link not found or does not belong to user"}), 404

    db.session.delete(link)
    db.session.commit()
    # return jsonify({"message": "Link deleted successfully"}), 200
    return "", 204 # Standard practice for DELETE success

