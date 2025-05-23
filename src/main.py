import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory
from flask_cors import CORS # Import CORS
from src.models.models import db # Updated to import from models.py

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
# Import config for CORS settings
from src.config import CORS_ORIGINS

# Enable CORS for all configured origins and allow credentials
CORS(app, origins=CORS_ORIGINS, supports_credentials=True)
app.config['SECRET_KEY'] = 'asdf#FGSgvasgf$5$WGT'

# Configure SQLite database
# Ensure the instance_path exists or is created before the app runs in a real scenario
instance_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'instance')
if not os.path.exists(instance_path):
    os.makedirs(instance_path)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(instance_path, 'link_saver.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Import models here before create_all
from src.models.models import User, Link, Goal 

# Create database tables
with app.app_context():
    db.create_all()

# Register blueprints
from src.routes.user import user_bp
from src.routes.links import links_bp
from src.routes.goals import goals_bp

app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(links_bp, url_prefix='/api') # All under /api for consistency
app.register_blueprint(goals_bp, url_prefix='/api') # All under /api for consistency

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
            return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

