from flask import Flask,  request, jsonify, session
from flask_session import Session
from models import db  # Importing the db instance and models
from flask_cors import CORS, cross_origin
from models import User, Event
from types import SimpleNamespace
from dateutil import parser
from sqlalchemy.exc import SQLAlchemyError
from flask_migrate import Migrate
import handle_google_api
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

from config import ApplicationConfig

from apiFetch.yelpAPI import YelpAPI

import os
import json

app = Flask(__name__)
CORS(app, supports_credentials=True)
# CORS(app, resources={r"/api/*": {"origins": "http:///127.0.0.1:3000"}})

app.secret_key = "super secret essay"
basedir = os.path.abspath(os.path.dirname(__file__))
app.config.from_object(ApplicationConfig)
jwt = JWTManager(app)

migrate = Migrate(app, db)

db.init_app(app)  # Initialize db with your Flask app


@app.route('/')
def index():
    return "Hello, World!"


@app.route("/authenticate", methods=["GET"])
def link_google_account():
    response = handle_google_api.handle_authentication()
    print(response)
    if response["flag"]:
        email = response["email"]
        # access_token = create_access_token(identity=email, username=email)
        access_token = create_access_token(
            identity={"email": email, "name": email}
        )
        # need to get user and strengthen validationm for email
        # but for now its ok, couldn't save stuff to database
        response = jsonify(
            {"access_token": access_token, "message": "success", "status": 200}
        )
        # Specify the status code explicitly if needed, though 'status' within the JSON is also informative
        response.status_code = 200
        return response
    else:
        return {
            "message": "Error occurred while attempting to link accounts",
            "status": 401,
        }

@app.route("/delinkGoogle", methods=["GET"])
def signOutFromGoogle():
    response = handle_google_api.handle_deauthentication()
    if response:
        return jsonify({
            'message': 'success',
            'status': 200
        })
    else:
        return {"message": "Error occurred while attempting to link accounts", 'status': 401}

@app.route('/user/login', methods=['POST'])
def create_token():
    email = request.json["email"]
    password = request.json["password"]

    user = User.query.filter_by(email=email).first()
    print(email, password)
    if user and password == user.password:
        access_token = create_access_token(
            identity={"email": email, "name": user.username}
        )
        return jsonify(access_token=access_token)
    else:
        return jsonify({"message": "bad username or password"}), 401


@app.route("/user/username", methods=["POST"])
@jwt_required()
def username():
    current_user = get_jwt_identity()

    print(current_user, request.json)
    user = User.query.filter_by(email=current_user['email']).first()
    check = User.query.filter_by(username=request.json["username"]).first()
    if not check and user:
        user.username = request.json["username"]

        db.session.commit()
    else:
        return jsonify({"message": "duplicate username not allowed"}), 401
    return jsonify(logged_in_as=current_user['email']), 200


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
    print(request.json, current_user)

    user = User.query.filter_by(email=current_user["email"]).first()

    duplicate = User.query.filter_by(email=request.json["newEmail"]).first()
    if not duplicate and user:
        username = user.username
        access_token = create_access_token(identity={'email':request.json["newEmail"], 'name':username})
        user.email = request.json["newEmail"]
        print("check here", get_jwt_identity(), request.json["newEmail"])
        db.session.commit()
    else:
        return jsonify({"message": "Duplicate email not allowed."}), 401

    return jsonify({"message": "Email changed successfully", "access_token":access_token}), 200

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
    access_token = create_access_token(
        identity={"email": request.json["email"], "name": user.username}
    )

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
    access_token = create_access_token(identity={"email": email, "name": email})
    return jsonify({"message": "Account created!", "status": 200, "access_token": access_token})
    # return jsonify(access_token), 200


@app.route('/events', methods=['GET'])
def get_events():

    events = Event.query.all()

    event_values = []

    for event in events:
        
        values = {'id': event.eventID,
                    'name': event.name,
                    'time': event.start_date,
                    'location': event.location,
                    'category': event.category,
                    'desc': event.desc}
        event_values.append(values)

    # add from saved events sob

    return {'status': '200', 'events': event_values}


@app.route("/event/edit", methods=["POST"])
def edit_event():
    data = request.json

    print(data['eventID']['id'], "check change event")

    event = Event.query.filter_by(eventID=data['eventID']['id']).first()

    event.name = request.json["eventName"] if len(request.json["eventName"]) >= 1 else event.name
    event.desc = (
        request.json["eventDesc"] if len(request.json["eventDesc"]) >= 1 else event.desc
    )
    event.hostName = (
        request.json["hostName"]
        if len(request.json["hostName"]) >= 1
        else event.hostName
    )
    event.start_time = (
        request.json["startTime"]
        if len(request.json["startTime"]) >= 1
        else event.start_time
    )
    event.start_date = (
        request.json["startDate"] if len(request.json["startDate"]) >= 1 else event.start_date
    )
    event.end_time = (
        request.json["endTime"] if len(request.json["endTime"]) >= 1 else event.end_time
    )
    event.category = (
        request.json["tags"] if len(request.json["tags"]) >= 1 else event.category
    )
    event.type = (
        request.json["eventType"] if len(request.json["eventType"]) >= 1 else event.type
    )
    event.location = (
        request.json["location"]
        if len(request.json["location"]) >= 1
        else event.location
    )

    db.session.commit()

    return jsonify({"message": "event set", "eventID": data["eventID"]["id"]}), 200

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

    current_user = get_jwt_identity()
    print(current_user)

    user = User.query.filter_by(email=current_user['email']).first()

    events = Event.query.filter_by(userID=user.id)

    event_values = []

    for event in events:
        print("check events", event.start_time)
        values = {'id': event.eventID,
                    'name': event.name if event.name else "No name",
                    'time': event.start_time if event.start_time else "No time",
                    'date': event.start_date if event.start_date else "No date",
                    'location': event.location if event.location else "No location",
                    'desc': event.desc if event.desc else "No description"}
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
    user = User.query.filter_by(email=current_user["email"]).first()
    user.saved_events.clear()
    db.session.commit()

    return jsonify({"message": "events deleted"}), 200


@app.route("/profile/preferences", methods=["POST"])
@jwt_required()
def set_preferences():
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user["email"]).first()
    user.preferences = str(request.json["results"])
    db.session.commit()
    return jsonify({"message": "prefs set"}), 200


@app.route("/profile/join-event", methods=["POST"])
@jwt_required()
def join_event():

    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user["email"]).first()

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
    # get from api
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user["email"]).first()

    print("jsjsjsjsj ", current_user, request.json)
    name = request.json["eventName"]
    eventDesc = request.json["eventDesc"]
    hostName = request.json["hostName"]
    start_time = request.json["startTime"]
    start_date = request.json["startDate"]
    end_time = request.json["endTime"]
    category = request.json["tags"]
    eventType = request.json["eventType"]
    location = request.json["location"]
    userID = user.id

    new_event = Event(
        name=name,
        desc=eventDesc,
        location=location,
        hostName=hostName,
        userID=userID,
        category=category,
        type=eventType,
        start_time=start_time,
        end_time=end_time,
        start_date=start_date
    )
    print(new_event.desc, "description", eventDesc)
    db.session.add(new_event)
    user.saved_events.append(new_event)

    db.session.commit()
    return jsonify({"message": "event set", "eventID": new_event.eventID}), 200

@app.route("/events/api", methods=["POST", "GET"])
def fetch_api_events():
    # Uncomment the next line to dynamically set the location based on query parameter
    loc = request.args.get('location', default=None, type=str)
    sort_on = request.args.get('sort_on', default=None, type=str)
    start_date = request.args.get('start_date', default=None, type=str)
    is_free = request.args.get('is_free', default=None, type=str)
    category = request.args.get('category', default=None, type=str)

    yelp_api_instance = YelpAPI()
    events = yelp_api_instance.get_events_based_on_location(location=loc, is_free=is_free, sort_on=sort_on, start_date=start_date, category=category)
    
    # # Check the count of fetched events against existing events in the database
    fetched_events_count = len(events)

    try:
        db.session.query(Event).filter(Event.yelpID.isnot(None)).delete(synchronize_session=False)

        eventIDTracking = []
        for event in events:
            yelpID = event['id']
            eventDesc = event['description']
            name = event['name']
            yelpLocation = event['location']
            locationAddress = ', '.join(yelpLocation['display_address'])
            eventDateTime = parser.isoparse(event['time_start'])
            category = event['category']
            businessID = event['business_id']

            # For each event, either update the existing record or create a new one
            existingEvent = Event.query.filter_by(yelpID=yelpID).first()

            if existingEvent:
                existingEvent.desc = eventDesc
                existingEvent.name = name
                existingEvent.location = locationAddress
                existingEvent.event_datetime = eventDateTime
                existingEvent.category = category
            else:
                newEvent = Event(name=name, desc=eventDesc, location=locationAddress, start_date=eventDateTime, category=category, yelpID=yelpID, hostName=businessID)
                db.session.add(newEvent)
                db.session.flush()  
                eventIDTracking.append(newEvent.eventID)

        db.session.commit()
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"message": "An error occurred while processing events", "error": str(e)}), 500

    return jsonify({"message": "Events processed", "eventIDs": eventIDTracking, "count": fetched_events_count, "events": events}), 200



@app.route("/events/business", methods=["GET"])
def fetch_business():
    businessID = request.args.get('businessID', default=None, type=str)

    yelp_api_instance = YelpAPI()
    business = yelp_api_instance.get_business_from_id(businessID=businessID)

    return jsonify({"message": "Events processed", "business": business}), 200

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
