from flask import Flask,  request, jsonify, session
from flask_session import Session
from models import db  # Importing the db instance and models
from flask_cors import CORS, cross_origin
from models import User, Event
from types import SimpleNamespace

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

from config import ApplicationConfig

import os
import json

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
    print(user)
    if user and password == user.password:
        access_token = create_access_token(identity={'email': email, 'name': user.username})
        return jsonify(access_token=access_token)
    else:
        return jsonify({"message": "bad username or password"}), 401


@app.route("/user/username", methods=["POST"])
@jwt_required()
def username():
    current_user = get_jwt_identity()

    print(current_user, request.json)
    user = User.query.filter_by(email=current_user).first()
    check = User.query.filter_by(username=request.json["username"]).first()
    if not check:
        user.username = request.json["username"]

        db.session.commit()
    else:
        return jsonify({"message": "duplicate username not allowed"}), 401
    return jsonify(logged_in_as=current_user), 200


@app.route("/user/changeusername", methods=["POST"])
@jwt_required()
def changeusername():
    current_user = get_jwt_identity()
    print("Request: ")
    print(request.json)

    user = User.query.filter_by(email=current_user["email"]).first()
    duplicate = User.query.filter_by(username=request.json["newUsername"]).first()
    if not duplicate:
        user.username = request.json["newUsername"]
        db.session.commit()
    else:
        return jsonify({"message": "Duplicate username not allowed."}), 401

    return jsonify({"message": "Username changed successfully"}), 200


@app.route("/user/changepassword", methods=["POST"])
@jwt_required()
def changepassword():
    current_user = get_jwt_identity()
    print("Request: ")
    print(request.json)

    user = User.query.filter_by(email=current_user["email"]).first()
    if (len(request.json["newPassword"]) > 6):
        user.password = request.json["newPassword"]
        db.session.commit()
    else:
        return jsonify({"message": "Short password not allowed."}), 401

    return jsonify({"message": "Password changed successfully"}), 200


@app.route("/user/changeemail", methods=["POST"])
@jwt_required()
def changeemail():
    current_user = get_jwt_identity()
    print("Request: ")
    print(request.json)

    user = User.query.filter_by(email=current_user["email"]).first()
    duplicate = User.query.filter_by(email=request.json["newEmail"]).first()
    if not duplicate:
        user.email = request.json["newEmail"]
        db.session.commit()
    else:
        return jsonify({"message": "Duplicate email not allowed."}), 401

    return jsonify({"message": "Email changed successfully"}), 200


@app.route("/user/deleteaccount", methods=["GET"])
@jwt_required()
def deleteaccount():
    current_user = get_jwt_identity()
    
    User.query.filter_by(email=current_user["email"]).delete()
    # db.session.delete(user)
    db.session.commit()

    return jsonify({"message": "Account deleted successfully"}), 200


@app.route("/user/resetpassword", methods=["POST"])
def resetpassword():
    print("Request: ")
    print(request.json)

    user = User.query.filter_by(email=request.json["email"]).first()
    if (user == None):
        return jsonify({'message': 'This email does not belong to an existing account.'}), 400
    
    if (len(request.json["newPassword"]) < 7):
        return jsonify({'message': 'Password is too short.'}), 401

    user.password = request.json["newPassword"]
    db.session.commit()
    access_token = create_access_token(identity=request.json["email"])

    return jsonify({"message": "Password reset successfully"}), 200


@app.route('/user/register', methods=["POST"])
def register():
    data = request.json
    email = data['email']
    password = data['password']

    cur_users = User.query.filter_by(email=email).first()

    if (cur_users != None):
        return {'status': '400', 'message': 'This email belongs to an existing account.'}

    if (len(password) < 7):
        return {'status': '400', 'message': 'Please choose a password that is greater than 6.'}
    new_user = User(email=email,
                    username=email,
                    password=password)
    db.session.add(new_user)
    db.session.commit()
    access_token = create_access_token(identity=email)
    return jsonify({"message": "Account created!", "status": 200, "access_token": access_token})
    # return jsonify(access_token), 200


@app.route('/events', methods=['GET'])
def get_events():

    events = Event.query.all()

    event_values = []

    for event in events:
        values = {'id': event.eventID,
                    'name': event.name,
                    'time': event.event_datetime,
                    'location': event.location}
        event_values.append(values)

    return {'status': '200', 'events': event_values}


@app.route('/user/getusername', methods=['GET'])
@jwt_required()
def getusername():
    current_user = get_jwt_identity()

    user = User.query.filter_by(email=current_user["email"]).first()
    username = user.username

    return {'status': '200', 'username': username}


@app.route('/user_events', methods=['GET'])
@jwt_required()
def get_user_events():

    user = get_jwt_identity()
    print(user)

    events = Event.query.filter_by(host=user['name'])

    event_values = []

    for event in events:
        values = {'id': event.eventID,
                    'name': event.name,
                    'time': event.event_datetime,
                    'location': event.location}
        event_values.append(values)

    return {'status': '200', 'events': event_values}


@app.route('/set-username', methods=['POST'])
def receive_data():
    # if request.is_json:
    data = request.get_json()
    print("Received data:", data)  # For demonstration, print it to the console
    # send to database
    # item = User(name=current_user, username = data) TODO fix getting current user
    return jsonify({"message": "Data received successfully", "yourData": data}), 200


@app.route('/delete_event', methods=['POST'])
def delete_event():
    data = request.json

    print(data['event'])

    event = Event.query.filter_by(eventID=data['event']['eventID']).first()

    db.session.delete(event)
    db.session.commit()

    return {'status': '200'}

@app.route("/profile/clearhistory", methods=["GET"])
@jwt_required()
def deleteEventHistory():
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()
    user.saved_events.clear()
    db.session.commit()

    return jsonify({"message": "events deleted"}), 200


@app.route("/profile/preferences", methods=["POST"])
@jwt_required()
def set_preferences():
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()
    user.preferences = str(request.json["results"])
    db.session.commit()
    return jsonify({"message": "prefs set"}), 200


@app.route("/profile/join-event", methods=["POST"])
@jwt_required()
def join_event():

    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()

    eventID = request.json["event id"]

    event = Event.query.filter_by(eventID=eventID).first()

    if event and user:
        user.saved_events.append(event)
        db.session.commit()
        print(user.saved_events)
        return jsonify({"message": "event joined"}), 200


@app.route("/event/create", methods=["POST"])
@jwt_required()
def create_event():
    #get from api
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()

    name = request.json["eventName"]
    eventDesc = request.json["eventDesc"]
    hostName = request.json["hostName"]
    category = request.json["tags"]
    eventType = request.json["eventType"]
    location = request.json["location"]
    userID = user.id

    new_event = Event(name=name, desc=eventDesc, location=location,
                      hostName=hostName, userID=userID, category=category, type=eventType)
    print(new_event)
    db.session.add(new_event)
    user.saved_events.append(new_event)
    db.session.commit()
    return jsonify({"message": "event set", "eventID": new_event.eventID}), 200


@app.route("/event/details", methods=["POST"])
def get_details():
    id = request.json["id"]
    print("eheheh", request.json)
    event = Event.query.filter_by(eventID=id).first()
    event_json = event.as_dict()
    print(event_json)

    if not event:
        return jsonify({"message": "event not found"}), 404

    return jsonify(event_json=event_json)


# @app.route("/check_user", methods = ["POST"])
@jwt_required
def hello():
    user = get_jwt_identity()
    return jsonify(logged_in=user), 200


if __name__ == '__main__':
    app.run(debug=True)
