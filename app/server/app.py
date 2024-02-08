from flask import Flask,  request, jsonify
from models import db  # Importing the db instance and models
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'  # or your actual database URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)  # Initialize db with your Flask app

@app.route('/')
def index():
    return "Hello, World!"



if __name__ == '__main__':
    app.run(debug=True)
