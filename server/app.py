from flask import Flask
import os
from flask_cors import CORS
from routes.auth import auth_bp
from routes.test import test_bp
from routes.profile import profile_bp
from routes.notifications import notifications_bp
from routes.matching import matching_bp
from routes.events import events_bp
from routes.volunteer_history import volunteer_history_bp

def create_app():
    app = Flask(__name__)
    CORS(app)  # Allow requests from React frontend
    
    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(test_bp)
    app.register_blueprint(profile_bp)
    app.register_blueprint(notifications_bp)
    app.register_blueprint(matching_bp)
    app.register_blueprint(events_bp)
    app.register_blueprint(volunteer_history_bp)

    return app

# The global 'app' instance that Gunicorn will import
app = create_app()

#if __name__ == '__main__':
    # Railway will provide the PORT environment variable
 #   port = int(os.environ.get('PORT', 5001)) # Default to 5000 for local dev
    
  #  app.run(host='0.0.0.0', port=port, debug=True)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    # Railway provides RAILWAY_ENVIRONMENT (not RAILWAY_ENVIRONMENT_NAME)
    is_production = os.environ.get('RAILWAY_ENVIRONMENT') == 'production'
    app.run(host='0.0.0.0', port=port, debug=not is_production)