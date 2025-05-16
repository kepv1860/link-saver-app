from flask import Blueprint, jsonify, request
from src.models.models import db, Link, User, Goal # Assuming User and Goal models exist
from datetime import datetime

links_bp = Blueprint("links_bp", __name__)

# Create a new link
@links_bp.route("/users/<int:user_id>/links", methods=["POST"])
def create_link(user_id):
    data = request.get_json()
    if not data or not data.get("url"):
        return jsonify({"error": "Missing URL"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    new_link = Link(
        url=data["url"],
        title=data.get("title"),
        description=data.get("description"),
        user_id=user_id,
        goal_id=data.get("goal_id") # Optional: associate with a goal
    )
    
    if data.get("goal_id"):
        goal = Goal.query.get(data.get("goal_id"))
        if not goal or goal.user_id != user_id:
            return jsonify({"error": "Goal not found or does not belong to user"}), 404
        new_link.goal_id = data.get("goal_id")

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
            "goal_id": new_link.goal_id
        }
    }), 201

# Get all links for a user
@links_bp.route("/users/<int:user_id>/links", methods=["GET"])
def get_links(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    links = Link.query.filter_by(user_id=user_id).all()
    return jsonify([{
        "id": link.id, 
        "url": link.url, 
        "title": link.title, 
        "description": link.description,
        "user_id": link.user_id,
        "goal_id": link.goal_id
    } for link in links]), 200

# Get a specific link
@links_bp.route("/users/<int:user_id>/links/<int:link_id>", methods=["GET"])
def get_link(user_id, link_id):
    link = Link.query.filter_by(id=link_id, user_id=user_id).first()
    if link:
        return jsonify({
            "id": link.id, 
            "url": link.url, 
            "title": link.title, 
            "description": link.description,
            "user_id": link.user_id,
            "goal_id": link.goal_id
        }), 200
    return jsonify({"error": "Link not found or does not belong to user"}), 404

# Update a link
@links_bp.route("/users/<int:user_id>/links/<int:link_id>", methods=["PUT"])
def update_link(user_id, link_id):
    link = Link.query.filter_by(id=link_id, user_id=user_id).first()
    if not link:
        return jsonify({"error": "Link not found or does not belong to user"}), 404

    data = request.get_json()
    if data.get("url"):
        link.url = data["url"]
    if data.get("title") is not None: # Allow empty string for title
        link.title = data["title"]
    if data.get("description") is not None: # Allow empty string for description
        link.description = data["description"]
    if data.get("goal_id") is not None:
        if data["goal_id"] == "": # Allow disassociating from goal
            link.goal_id = None
        else:
            goal = Goal.query.get(data["goal_id"])
            if not goal or goal.user_id != user_id:
                return jsonify({"error": "Goal not found or does not belong to user"}), 404
            link.goal_id = data["goal_id"]

    db.session.commit()
    return jsonify({
        "message": "Link updated successfully", 
        "link": {
            "id": link.id, 
            "url": link.url, 
            "title": link.title, 
            "description": link.description,
            "user_id": link.user_id,
            "goal_id": link.goal_id
        }
    }), 200

# Delete a link
@links_bp.route("/users/<int:user_id>/links/<int:link_id>", methods=["DELETE"])
def delete_link(user_id, link_id):
    link = Link.query.filter_by(id=link_id, user_id=user_id).first()
    if not link:
        return jsonify({"error": "Link not found or does not belong to user"}), 404

    db.session.delete(link)
    db.session.commit()
    return jsonify({"message": "Link deleted successfully"}), 200
