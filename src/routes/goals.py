from flask import Blueprint, jsonify, request
from src.models.models import db, Goal, User # Assuming User model exists
from datetime import datetime
import os
import json
import google.generativeai as genai # Import the library

goals_bp = Blueprint("goals_bp", __name__)

# Configure Gemini AI - Using environment variable with fallback
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "AIzaSyDGy-amaQ4G-iHeZgAsZ5U8JLgc0ZouAAY")
genai.configure(api_key=GEMINI_API_KEY) # Configure the API key

# Create a new goal and generate questions
@goals_bp.route("/users/<int:user_id>/goals", methods=["POST"])
def create_goal(user_id):
    data = request.get_json()
    if not data or not data.get("title"):
        return jsonify({"error": "Missing title"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    new_goal = Goal(
        title=data["title"],
        user_id=user_id,
        status="generating_questions" # Initial status
    )
    db.session.add(new_goal)
    db.session.commit() # Commit to get the ID for the AI part

    try:
        # Changed model name to one of the available text models
        model = genai.GenerativeModel(model_name="models/gemini-1.5-pro-latest") 
        prompt = f"Generate 4-5 specific questions to understand someone's background and goals related to: \"{new_goal.title}\". Format the response as a JSON array of strings. Each question should help understand their current level and specific goals. Example format: [\"What is your current experience with English?\"]"
        
        response = model.generate_content(prompt)
        questions_text = response.text
        
        try:
            # Extract JSON content from the response if it's wrapped in markdown code blocks
            if "```json" in questions_text:
                questions_text = questions_text.split("```json")[1].split("```")[0].strip()
            elif "```" in questions_text:
                questions_text = questions_text.split("```")[1].split("```")[0].strip()
                
            questions_list = json.loads(questions_text) # Using json.loads instead of eval
            if not isinstance(questions_list, list) or not all(isinstance(q, str) for q in questions_list):
                raise ValueError("AI response for questions is not a list of strings")
            new_goal.questions = [{ "question": q, "answer": "" } for q in questions_list]
            new_goal.status = "questions_ready"
        except Exception as e:
            print(f"Error parsing AI questions: {e}, response: {questions_text}")
            new_goal.questions = [{ "question": "Could not parse questions from AI.", "answer": "" }]
            new_goal.status = "error"
            new_goal.error_message = f"Error parsing AI questions: {str(e)[:500]}"

    except Exception as e:
        print(f"Error generating AI questions: {e}")
        new_goal.status = "error"
        new_goal.error_message = f"Error generating AI questions: {str(e)[:500]}"

    db.session.commit()
    
    return jsonify({
        "message": "Goal created successfully", 
        "goal": {
            "id": new_goal.id, 
            "title": new_goal.title, 
            "user_id": new_goal.user_id,
            "status": new_goal.status,
            "progress": new_goal.progress,
            "questions": new_goal.questions,
            "error_message": new_goal.error_message
        }
    }), 201

# Get all goals for a user
@goals_bp.route("/users/<int:user_id>/goals", methods=["GET"])
def get_goals(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    goals = Goal.query.filter_by(user_id=user_id).all()
    return jsonify([{
        "id": goal.id, 
        "title": goal.title, 
        "user_id": goal.user_id,
        "status": goal.status,
        "progress": goal.progress,
        "questions": goal.questions,
        "todos": goal.todos,
        "error_message": goal.error_message
    } for goal in goals]), 200

# Get a specific goal
@goals_bp.route("/users/<int:user_id>/goals/<int:goal_id>", methods=["GET"])
def get_goal(user_id, goal_id):
    goal = Goal.query.filter_by(id=goal_id, user_id=user_id).first()
    if goal:
        return jsonify({
            "id": goal.id, 
            "title": goal.title, 
            "user_id": goal.user_id,
            "status": goal.status,
            "progress": goal.progress,
            "questions": goal.questions,
            "todos": goal.todos,
            "error_message": goal.error_message
        }), 200
    return jsonify({"error": "Goal not found or does not belong to user"}), 404

# Answer a question for a goal and generate todos if all answered
@goals_bp.route("/users/<int:user_id>/goals/<int:goal_id>/questions/<int:question_index>", methods=["PUT"])
def answer_question(user_id, goal_id, question_index):
    goal = Goal.query.filter_by(id=goal_id, user_id=user_id).first()
    if not goal:
        return jsonify({"error": "Goal not found or does not belong to user"}), 404

    if not goal.questions or question_index >= len(goal.questions):
        return jsonify({"error": "Question not found"}), 404

    data = request.get_json()
    if "answer" not in data:
        return jsonify({"error": "Missing answer"}), 400

    current_questions = list(goal.questions) if goal.questions else []
    current_questions[question_index]["answer"] = data["answer"]
    goal.questions = current_questions

    all_answered = all(q.get("answer", "").strip() != "" for q in goal.questions)

    if all_answered:
        goal.status = "generating_todos"
        db.session.commit()

        try:
            # Changed model name to one of the available text models
            model = genai.GenerativeModel(model_name="models/gemini-1.5-pro-latest") 
            answers_context = "\n".join([f"Q: {q['question']}\nA: {q['answer']}" for q in goal.questions])
            prompt = f"Based on this goal and answers, create a detailed todo list with realistic timeframes:\nGoal: {goal.title}\n{answers_context}\nFormat the response as a JSON array of objects, each with: \"task\": A specific, actionable task, \"timeframe\": A realistic time estimate (e.g., \"2 hours\", \"3 days\"), \"completed\": false. Example format: [{{ \"task\": \"Practice speaking\", \"timeframe\": \"2 hours per week\", \"completed\": false }}]"
            
            response = model.generate_content(prompt)
            todos_text = response.text

            try:
                # Extract JSON content from the response if it's wrapped in markdown code blocks
                if "```json" in todos_text:
                    todos_text = todos_text.split("```json")[1].split("```")[0].strip()
                elif "```" in todos_text:
                    todos_text = todos_text.split("```")[1].split("```")[0].strip()
                    
                todos_list = json.loads(todos_text) # Using json.loads instead of eval
                if not isinstance(todos_list, list) or not all(isinstance(t, dict) for t in todos_list):
                    raise ValueError("AI response for todos is not a list of objects")
                goal.todos = [{ "task": t.get("task", "N/A"), "timeframe": t.get("timeframe", "N/A"), "completed": False } for t in todos_list]
                goal.status = "active"
            except Exception as e:
                print(f"Error parsing AI todos: {e}, response: {todos_text}")
                goal.todos = [{ "task": "Could not parse todos from AI.", "timeframe": "N/A", "completed": False }]
                goal.status = "error"
                goal.error_message = f"Error parsing AI todos: {str(e)[:500]}"

        except Exception as e:
            print(f"Error generating AI todos: {e}")
            goal.status = "error"
            goal.error_message = f"Error generating AI todos: {str(e)[:500]}"
    else:
        goal.status = "questions_ready"

    db.session.commit()
    return jsonify({"message": "Answer submitted", "goal": {"id": goal.id, "questions": goal.questions, "status": goal.status, "todos": goal.todos, "error_message": goal.error_message}}), 200

# Toggle todo complete status
@goals_bp.route("/users/<int:user_id>/goals/<int:goal_id>/todos/<int:todo_index>", methods=["PUT"])
def toggle_todo(user_id, goal_id, todo_index):
    goal = Goal.query.filter_by(id=goal_id, user_id=user_id).first()
    if not goal:
        return jsonify({"error": "Goal not found or does not belong to user"}), 404

    if not goal.todos or todo_index >= len(goal.todos):
        return jsonify({"error": "Todo not found"}), 404
    
    current_todos = list(goal.todos) if goal.todos else []
    current_todos[todo_index]["completed"] = not current_todos[todo_index].get("completed", False)
    goal.todos = current_todos

    completed_count = sum(1 for t in goal.todos if t.get("completed"))
    goal.progress = int((completed_count / len(goal.todos)) * 100) if goal.todos else 0
    goal.status = "completed" if goal.progress == 100 else "active"

    db.session.commit()
    return jsonify({"message": "Todo status updated", "goal": {"id": goal.id, "todos": goal.todos, "progress": goal.progress, "status": goal.status}}), 200

# Delete a goal
@goals_bp.route("/users/<int:user_id>/goals/<int:goal_id>", methods=["DELETE"])
def delete_goal(user_id, goal_id):
    goal = Goal.query.filter_by(id=goal_id, user_id=user_id).first()
    if not goal:
        return jsonify({"error": "Goal not found or does not belong to user"}), 404

    db.session.delete(goal)
    db.session.commit()
    return jsonify({"message": "Goal deleted successfully"}), 200

# Update goal title (basic update example)
@goals_bp.route("/users/<int:user_id>/goals/<int:goal_id>", methods=["PUT"])
def update_goal_title(user_id, goal_id):
    goal = Goal.query.filter_by(id=goal_id, user_id=user_id).first()
    if not goal:
        return jsonify({"error": "Goal not found or does not belong to user"}), 404

    data = request.get_json()
    if "title" in data:
        goal.title = data["title"]
    
    db.session.commit()
    return jsonify({"message": "Goal title updated", "goal": {"id": goal.id, "title": goal.title}}), 200

