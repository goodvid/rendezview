from flask import Flask,  request, jsonify, session
from flask_session import Session
from models import db  # Importing the db instance and models
from flask_cors import CORS
from models import User

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

from config import ApplicationConfig


import os


app = Flask(__name__)
CORS(app, supports_credentials=True)

app.secret_key = "super secret essay"
basedir = os.path.abspath(os.path.dirname(__file__))
app.config.from_object(ApplicationConfig)
jwt = JWTManager(app)


db.init_app(app)  # Initialize db with your Flask app

@app.route('/')
def index():
    return "Hello, World!"


@app.route('/user/login', methods=['POST'])
def create_token():
    email = request.json["email"]
    password = request.json["password"]

    user = User.query.filter_by(email=email).first()

    if user and password == user.password:
        access_token = create_access_token(identity=email)
        return jsonify(access_token=access_token)
    else:
        return jsonify({"message":"bad username or password"}), 401


@app.route("/user/username", methods=["POST"])
@jwt_required()
def username():
    current_user = get_jwt_identity()
    
    print(current_user, request.json)
    user = User.query.filter_by(email=current_user).first()
    user.username = request.json["username"]
    db.session.commit()

    return jsonify(logged_in_as=current_user), 200

@app.route("/profile/clearhistory", methods=["GET"])
@jwt_required()
def deleteEventHistory():
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()
    user.events = None
    db.session.commit()
    
    return jsonify({"message": "events deleted"}), 200


if __name__ == '__main__':
    app.run(debug=True)
