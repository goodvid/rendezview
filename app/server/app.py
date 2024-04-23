from flask import Flask,  request, jsonify, session, redirect
from flask_session import Session
from models import db  # Importing the db instance and models
from flask_cors import CORS, cross_origin
from models import User, Event, EventRating, Status
from types import SimpleNamespace
from dateutil import parser
from sqlalchemy.exc import SQLAlchemyError
from flask_migrate import Migrate
import handle_google_api
import rc_system
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
from pprint import pprint

from flask_jwt_extended import (create_access_token,
                                get_jwt_identity,
                                jwt_required,
                                JWTManager,
                                get_jwt
                                )
from sqlalchemy import or_
from config import ApplicationConfig
from datetime import timedelta
from dateutil import parser
import datetime

from apiFetch.yelpAPI import YelpAPI

import os
import json
import statistics

from blocklist import BLOCKLIST

app = Flask(__name__)
CORS(app, supports_credentials=True)
# CORS(app, resources={r"/api/*": {"origins": "http:///localhost:3000"}})

app.secret_key = "super secret essay"
basedir = os.path.abspath(os.path.dirname(__file__))
app.config.from_object(ApplicationConfig)
jwt = JWTManager(app)

migrate = Migrate(app, db)

db.init_app(app)  # Initialize db with your Flask app


@app.route('/')
def index():
    return "Hello, World!"


@app.route("/auth/google/callback")
def google_auth_callback():
    # ... code to handle the Google response and exchange code for tokens ...

    # Instead of redirecting, return a page with JavaScript to close the window
    return '''
    <html>
    <body>
    <script>
    // Check if this page is opened in a popup window
    if (window.opener) {
        // Send a message to the opener window
        window.opener.postMessage('authentication successful', '*');
        // Close the popup
        window.close();
    }
    </script>
    </body>
    </html>
    '''


@app.route("/authenticate", methods=["GET"])
def link_google_account():
    response = handle_google_api.handle_authentication()
    print(response)
    if response["flag"]:
        email = response["email"]

        # access_token = create_access_token(identity=email, username=email)
        access_token = create_access_token(
            identity={"email": email, "name": email},
            fresh=timedelta(minutes=60),
        )
        # need to get user and strengthen validationm for email
        # but for now its ok, couldn't save stuff to database
        response = jsonify(
            {"access_token": access_token, "message": "success",
                "status": 200, "login_method": "google", "quiz": response["quiz"]}
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
@jwt_required()
def signOutFromGoogle():
    # data = request.json
    # print("------logs-------")
    # print(data)
    # print("------logs-------")
    response = handle_google_api.handle_deauthentication()
    jti = get_jwt()["jti"]
    BLOCKLIST.add(jti)
    if response:
        return jsonify({
            'message': 'success',
            'status': 200
        })
    else:
        return {"message": "Error occurred while attempting to delink account", 'status': 401}


@app.route('/user/login', methods=['POST'])
def create_token():
    email = request.json["email"]
    password = request.json["password"]

    user = User.query.filter_by(email=email).first()
    print(email, password)
    if user and password == user.password:
        access_token = create_access_token(
            identity={"email": email, "name": user.username},
            fresh=timedelta(minutes=60),
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
    duplicate = User.query.filter_by(
        username=request.json["newUsername"]).first()
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
        access_token = create_access_token(
            identity={"email": request.json["newEmail"], "name": username},
            fresh=timedelta(minutes=60),
        )
        user.email = request.json["newEmail"]
        print("check here", get_jwt_identity(), request.json["newEmail"])
        db.session.commit()
    else:
        return jsonify({"message": "Duplicate email not allowed."}), 401

    return jsonify({"message": "Email changed successfully", "access_token": access_token}), 200


@app.route("/user/deleteaccount", methods=["GET"])
@jwt_required()
def deleteaccount():
    current_user = get_jwt_identity()

    deleteprofilepic()
    User.query.filter_by(email=current_user["email"]).delete()
    # db.session.delete(user)
    db.session.commit()

    return jsonify({"message": "Account deleted successfully"}), 200


@app.route("/user/get_status", methods=["POST"])
@jwt_required()
def get_status():
    data = request.json
    other_email = data['email']

    current_user = get_jwt_identity()

    current_email = current_user['email']

    status = Status.query.filter_by(
        user=current_email, friend=other_email).first()

    if status:
        return {'status': '200', 'cur_status': status.status}
    else:
        return {'status': '400'}


@app.route("/user/set_status", methods=["POST"])
@jwt_required()
def set_status():
    data = request.json
    other_email = data['email']
    status_data = data['status']

    current_user = get_jwt_identity()

    u = User.query.filter_by(email=current_user['email']).first()

    current_email = u.id

    status = Status.query.filter_by(
        user=current_email, friend=other_email).first()

    if status != None:
        status.status = status_data
        db.session.commit()
    else:
        new_status = Status(user=current_email,
                            friend=other_email,
                            status=status_data)
        print(new_status.status)
        db.session.add(new_status)
        db.session.commit()

    return {'status': '200', 'new_status': status_data}


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
        identity={"email": request.json["email"], "name": user.username},
        fresh=timedelta(minutes=60),
    )

    return jsonify({"message": "Password reset successfully"}), 200


def saveProfilePic(profile_picture, email):
    picture = profile_picture.filename
    picture_path = os.path.abspath(os.path.join(os.path.dirname(
        __file__), os.pardir, 'public\profile_pics', email + "-" + picture))

    profile_picture.save(picture_path)
    picture_path = picture_path[slice(picture_path.find(
        '\profile_pics'), None)].replace('\\', '/')
    return picture_path


@app.route('/user/register', methods=["POST"])
def register():
    form = jsonify(
        {"email": request.form['email'], "password": request.form['password']})
    email = form.json['email']
    password = form.json['password']

    cur_users = User.query.filter_by(email=email).first()

    if (cur_users != None):
        return {'status': '400', 'message': 'This email belongs to an existing account.'}

    if (len(password) < 7):
        return {'status': '400', 'message': 'Please choose a password that is greater than 6.'}

    if (request.files):
        picture = request.files['profilePicture']
        profilePicPath = saveProfilePic(picture, email)
    else:
        profilePicPath = 'NULL'

    new_user = User(email=email,
                    username=email,
                    password=password,
                    picture=profilePicPath)
    db.session.add(new_user)
    db.session.commit()
    access_token = create_access_token(
        identity={"email": email, "name": email}, fresh=timedelta(minutes=60)
    )
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
                  'latitude': event.latitude,
                  'longitude': event.longitude,
                  'yelpID': event.yelpID,
                  'hostName': event.hostName,
                  'desc': event.desc}
        event_values.append(values)

    # add from saved events sob

    return {'status': '200', 'events': event_values}


@app.route("/events/get_recommended", methods=['GET'])
@jwt_required()
def get_recommended():
    print('hi')

    current_user = get_jwt_identity()
    print(current_user)
    user = User.query.filter_by(email=current_user['email']).first()

    recommendations = rc_system.select_events_to_reccommend(user=user)

    event_values = []

    for event_tuple in recommendations:
        event = event_tuple[0]

        values = {'id': event.eventID,
                  'name': event.name,
                  'time': event.start_date,
                  'location': event.location,
                  'category': event.category,
                  'latitude': event.latitude,
                  'longitude': event.longitude,
                  'yelpID': event.yelpID,
                  'desc': event.desc}
        event_values.append(values)

    return {'status': '200', 'recommendations': event_values}


@app.route('/filtered_events', methods=['GET'])
def get_filtered_events():
    loc = request.args.get(
        'location', default="West Lafayette, IN, USA", type=str)
    sort_on = request.args.get('sort_on', default=None, type=str)
    start_date = request.args.get('start_date', default=None, type=str)
    is_free = request.args.get('is_free', default=None, type=str)
    category = request.args.get('category', default=None, type=str)

    events = Event.query.all()

    event_values = []
    fetched_events = []
    user_events = []

    filters = [loc, sort_on, start_date, is_free, category]
    for event in events:
        values = {'id': event.eventID,
                  'name': event.name,
                  'start_date': event.start_date,
                  'location': event.location,
                  'category': event.category,
                  'latitude': event.latitude,
                  'longitude': event.longitude,
                  'yelpID': event.yelpID,
                  'hostName': event.hostName,
                  'desc': event.desc}

        if event.yelpID is None:  # Filter user_events
            passes_filters = True

            if loc is not None and values["location"] != loc:
                passes_filters = False

            if category is not None and values["category"] != category:
                passes_filters = False

            if start_date is not None:
                values_start_date = datetime.strptime(
                    values["start_date"], '%Y-%m-%d').date()

                # Assuming start_date is a string in "2010-09-24 20:00:00-04:00" (datetime) format
                start_date_datetime = parser.parse(start_date)
                start_date_date = start_date_datetime.date()

                if values_start_date <= start_date_date:
                    passes_filters = False

            if passes_filters:
                user_events.append(values)

        else:
            fetched_events.append(values)

        event_values.append(values)
        events = fetched_events + user_events
        sortedEvents = fetched_events + user_events

        for event in sortedEvents:
            event['start_datetime'] = parser.parse(
                event["start_date"]).replace(tzinfo=None)

        if sort_on == "time_start":
            sortedEvents = sorted(
                sortedEvents, key=lambda x: x['start_datetime'], reverse=True)

    return {'status': '200', 'filters': filters, 'sorted': sortedEvents, 'events': events, 'all_events': event_values, 'fetched_events': fetched_events, 'user_events': user_events}


@app.route("/edit", methods=["POST"])
def edit_event():
    data = request.json

    print(data['eventID']['id'], "check change event")

    event = Event.query.filter_by(eventID=data['eventID']['id']).first()

    event.name = request.json["eventName"] if len(
        request.json["eventName"]) >= 1 else event.name
    event.desc = (
        request.json["eventDesc"] if len(
            request.json["eventDesc"]) >= 1 else event.desc
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
        request.json["startDate"] if len(
            request.json["startDate"]) >= 1 else event.start_date
    )
    event.end_time = (
        request.json["endTime"] if len(
            request.json["endTime"]) >= 1 else event.end_time
    )
    event.category = (
        request.json["tags"] if len(
            request.json["tags"]) >= 1 else event.category
    )
    event.type = (
        request.json["eventType"] if len(
            request.json["eventType"]) >= 1 else event.type
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

    friends = Status.query.filter_by(user=user.id).count()

    print(friends, "friends length")

    return {'status': '200', 'username': username, "friends": friends}


@app.route('/user/getpreferences', methods=['GET'])
@jwt_required()
def getpreferences():
    current_user = get_jwt_identity()

    user = User.query.filter_by(email=current_user["email"]).first()
    preferences = user.preferences

    return {'status': '200', 'preferences': preferences}


@app.route('/user/getprofilepic', methods=['GET'])
@jwt_required()
def getprofilepic():
    current_user = get_jwt_identity()

    user = User.query.filter_by(email=current_user["email"]).first()
    pic = user.picture
    # print("PATH: " + os.path.abspath(os.path.join(os.getcwd(), os.pardir, 'public' + pic)))
    # pic = pic[slice(pic.find('\profile_pics'), None)].replace('\\', '/')

    return {'status': '200', 'profilePic': pic}


@app.route('/user/changeprofilepic', methods=['POST'])
@jwt_required()
def changeprofilepic():
    current_user = get_jwt_identity()

    user = User.query.filter_by(email=current_user["email"]).first()
    email = user.email

    if (request.files):
        picture = request.files['profilePicture']
        deleteprofilepic()
        profilePicPath = saveProfilePic(picture, email)
    else:
        profilePicPath = 'NULL'

    user.picture = profilePicPath
    db.session.commit()

    return {'status': '200', 'profilePic': profilePicPath}


@app.route("/user/deleteprofilepic", methods=["GET"])
@jwt_required()
def deleteprofilepic():
    current_user = get_jwt_identity()

    user = User.query.filter_by(email=current_user["email"]).first()
    # remove profile picture
    if (user.picture and "profile_pics" in user.picture):
        abspath = os.path.abspath(os.path.join(
            os.getcwd(), os.pardir, 'public' + user.picture))
        os.remove(abspath)
    user.picture = ""
    db.session.commit()

    return jsonify({"message": "Profile picture deleted successfully"}), 200


@app.route('/user/get_user', methods=['POST'])
@jwt_required()
def get_user():
    data = request.json
    user = User.query.filter_by(id=data).first()

    if user == None:
        return {'status': '400', 'username': "None", "isFriend": False}
    print(data, "check data")

    current_user = get_jwt_identity()
    curr = User.query.filter_by(email=current_user["email"]).first()
    friend = Status.query.filter_by(user=curr.id, friend=user.id).first()
    print(friend, "friend here")
    if friend:

        return {
            "status": "200",
            "username": user.username,
            "isFriend": True,
            "relationship": friend.status,
        }
    else:
        friend = Status.query.filter_by(friend=curr.id, user=user.id).first()
        if friend:
            return {
                "status": "200",
                "username": user.username,
                "isFriend": False,
                "relationship": "asked to follow",
            }
        return {"status": "200", "username": user.username, "isFriend": False, "relationship": ""}


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
                  'rating': event.rating if event.rating is not None else None,
                  'desc': event.desc if event.desc else "No description"}
        event_values.append(values)

    return {'status': '200', 'events': event_values}


@app.route('/joined_events', methods=["POST", "GET"])
@jwt_required()
def joined_events():
    current_user = get_jwt_identity()
    print(current_user)
    user = User.query.filter_by(email=current_user["email"]).first()

    saved_events = user.saved_events

    events = []

    for event in saved_events:
        print(user.id, "curr user")
        print(len(saved_events), event.userID, event.eventID)
        if event.userID != user.id:

            newe = Event.query.filter_by(
                eventID=event.eventID, userID=event.userID
            ).first()
            print(newe, "ahahahahah")
            values = {
                "id": newe.eventID,
                "name": newe.name if newe.name else "No name",
                "time": newe.start_time if newe.start_time else "No time",
                "date": newe.start_date if newe.start_date else "No date",
                "location": newe.location if newe.location else "No location",
                "desc": newe.desc if newe.desc else "No description",
            }
            events.append(values)

    print("here are saved events", len(events))
    return {"status": "200", "events": events}


@app.route('/set-username', methods=['POST'])
def receive_data():
    # if request.is_json:
    data = request.get_json()
    print("Received data:", data)  # For demonstration, print it to the console
    # send to database
    # item = User(name=current_user, username = data) TODO fix getting current user
    return jsonify({"message": "Data received successfully", "yourData": data}), 200


@app.route("/get_all_usernames", methods=["POST", "GET"])
@jwt_required()
def get_users():
    name = request.get_json()
    print("check json", name)

    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user["email"]).first()

    # query = db.session.query(User.username).all()
    query = db.session.query(User).filter(
        User.username.like("%" + name + "%")).all()

    names = []
    for q in query:
        if q.id == user.id:
            continue
        status = Status.query.filter_by(user=user.id, friend=q.id).first()

        if (status):
            person = {"name": q.username, "isFriend": True,
                      "relationship": status.status, "id": q.id}
            names.append(person)
        else:
            person = {
                "name": q.username,
                "isFriend": False,
                "relationship": "",
                "id": q.id,
            }
            names.append(person)

    print(query, "names", names)
    return {"status": "200", "names": names}


@app.route("/add_friend", methods=["GET", "POST"])
@jwt_required()
def add_friend():
    data = User.query.filter_by(id=request.get_json()).first().id

    print(data, "check data")

    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user["email"]).first()
    friend = Status.query.filter_by(user=user.id, friend=data).first()
    if friend:
        return {"status": 200}
    friend_id = data

    status = "requested"

    requested = Status.query.filter_by(user=data, friend=user.id).first()

    if requested:
        status = "friend"
        requested.status = "friend"

    new_friend = Status(user=user.id, friend=friend_id, status=status)
    db.session.add(new_friend)
    db.session.commit()
    return {"status": "200", "status": status}


@app.route("/delete_friend", methods=["POST"])
@jwt_required()
def delete_friend():
    data = request.json
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user["email"]).first()

    friend = Status.query.filter_by(user=user.id, friend=data).first()

    if friend:
        db.session.delete(friend)

    friend = Status.query.filter_by(user=data, friend=user.id).first()

    if friend:
        friend.status = "requested"

    db.session.commit()

    return {"status": "200"}


@app.route('/get_friends', methods=["POST", "GET"])
@jwt_required()
def get_friends():
    token = get_jwt_identity()
    curr_user = User.query.filter_by(email=token["email"]).first()

    query = Status.query.filter(
        or_(
            Status.user == curr_user.id,
            Status.friend == curr_user.id
        )
    ).all()

    print("hello", query)

    names = []
    requests = []
    for q in query:
        print("user ", type(q.user), q.friend, q.status, type(curr_user.id))

        if str(q.user) == str(curr_user.id):
            print("hello")
            f = User.query.filter_by(id=q.friend).first()
            person = {
                "name": f.username,
                "isFriend": True,
                "relationship": q.status,
                "id": f.id,
            }
            names.append(person)
        else:
            if q.status == "requested":  # meaning both arent friends
                f = User.query.filter_by(id=q.user).first()
                person = {
                    "name": f.username,
                    "isFriend": True,
                    "relationship": q.status,
                    "id": f.id,
                }
                requests.append(person)

        # status = Status.query.filter_by(user=curr_user.id, friend=q.friend).first()

        # print(q.user, q.friend)

    print(requests, "names", names)
    if len(names) == 0 and len(requests) == 0:
        return {"status": 404}
    return {"status": 200, "names": names, "requests": requests}


@app.route('/friend/deny_request', methods=['POST'])
@jwt_required()
def deny_request():
    data = request.json
    print("check here")

    curr = User.query.filter_by(email=get_jwt_identity()['email']).first()

    friend = User.query.filter_by(id=data).first()

    relationship = Status.query.filter_by(
        user=friend.id, friend=curr.id).first()

    if relationship:
        db.session.delete(relationship)
        db.session.commit()
        print("deleted here")
    else:
        return {"status": "400", "message": "friend not found"}
    return {"status": "200"}


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
    # user.saved_events.append(new_event)

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
    events = yelp_api_instance.get_events_based_on_location(
        location=loc, is_free=is_free, sort_on=sort_on, start_date=start_date, category=category)

    # Check the count of fetched events against existing events in the database
    fetched_events_count = len(events)

    try:
        db.session.query(Event).filter(Event.yelpID.isnot(
            None)).delete(synchronize_session=False)
        db.session.query(Event).filter(Event.yelpID.isnot(
            None)).delete(synchronize_session=False)
        # db.session.query(Event).delete()

        eventIDTracking = []
        for event in events:
            # print(event.json(), "check event")
            yelpID = event['id']
            eventDesc = event['description']
            name = event['name']
            yelpLocation = event['location']
            locationAddress = ', '.join(yelpLocation['display_address'])
            eventDateTime = parser.isoparse(event['time_start'])
            category = event['category']
            businessID = event['business_id']
            latitude = event['latitude']
            longitude = event['longitude']

            # For each event, either update the existing record or create a new one
            existingEvent = Event.query.filter_by(yelpID=yelpID).first()

            if existingEvent:
                existingEvent.desc = eventDesc
                existingEvent.name = name
                existingEvent.location = locationAddress
                existingEvent.event_datetime = eventDateTime
                existingEvent.category = category
            else:
                newEvent = Event(name=name, desc=eventDesc, location=locationAddress, start_date=eventDateTime,
                                 category=category, yelpID=yelpID, hostName=businessID, latitude=latitude, longitude=longitude)
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

    if 'error' in business:
        return jsonify({"message": "Events processed", "business": ""}), 200

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


@app.route("/get_user_id", methods=["GET"])
@jwt_required()
def get_user_id():

    msg = ""
    current_user = get_jwt_identity()

    if current_user:
        userEmail = current_user.get('email')
        user = User.query.filter_by(email=userEmail).first()
        if user:
            msg = user.id

    return jsonify({"userID": msg}), 200


@app.route('/rate_event', methods=['POST'])
def rate_event():
    event_id = request.json.get('eventID')
    user_id = request.json.get('userID')
    rating = request.json.get('rating')
    yelp_id = request.json.get('yelpID')

    if (yelp_id):
        existing_rating = EventRating.query.filter_by(
            yelpID=yelp_id, userID=user_id).first()
    else:
        existing_rating = EventRating.query.filter_by(
            eventID=event_id, userID=user_id).first()

    if existing_rating:
        existing_rating.rating = rating
        message = "Event rating updated successfully!"
    else:
        new_rating = EventRating(
            eventID=event_id, yelpID=yelp_id, userID=user_id, rating=rating)
        db.session.add(new_rating)
        message = "Event rated successfully!"

    db.session.commit()

    return jsonify({"message": message}), 201


@app.route('/get_rating', methods=['POST'])
def get_rating():
    event_id = request.json.get('eventID')
    yelp_id = request.json.get('yelpID')
    user_id = request.json.get('userID')

    rating = 0
    if (yelp_id):
        existing_entry = EventRating.query.filter_by(
            yelpID=yelp_id, userID=user_id).first()
    else:
        existing_entry = EventRating.query.filter_by(
            eventID=event_id, userID=user_id).first()

    if existing_entry:
        message = "Successfully got rating"
        rating = existing_entry.rating
    else:
        rating = 0
        message = "Not yet rated"

    return jsonify({"message": message, "rating": rating}), 201


@app.route('/get_avg_rating', methods=['POST'])
def get_avg_rating():
    event_id = request.json.get('eventID')
    yelp_id = request.json.get('yelpID')

    # Get all ratings for event
    if (yelp_id):
        ratingFrom = "yelpID"
        existingEntries = EventRating.query.filter_by(yelpID=yelp_id).all()
        posEntries = EventRating.query.filter_by(
            yelpID=yelp_id, rating=1).all()
    else:
        ratingFrom = "eventID"
        existingEntries = EventRating.query.filter_by(eventID=event_id).all()
        posEntries = EventRating.query.filter_by(
            eventID=event_id, rating=1).all()

    # Calculate everage rating
    if existingEntries:
        numOfRatings = len(existingEntries)
        posRatings = len(posEntries)
        avgRating = round((posRatings / numOfRatings) * 100, 2)

        message = "Successfully got rating"

        if (yelp_id):
            updatingEvent = Event.query.filter_by(yelpID=yelp_id).first()

        else:
            updatingEvent = Event.query.filter_by(eventID=event_id).first()

        updatingEvent.rating = avgRating
        db.session.commit()
    else:
        avgRating = 0
        numOfRatings = 0
        posRatings = 0
        message = "Not yet rated"

    return jsonify({"message": message, "eventID": event_id, "ratingFrom": ratingFrom, "avgRating": avgRating, "numOfRatings": numOfRatings, "posRatings": posRatings}), 200


@app.route('/user/get_host_rating', methods=['GET'])
@jwt_required()
def get_host_rating():
    current_user = get_jwt_identity()

    user = User.query.filter_by(email=current_user["email"]).first()
    userID = user.id

    eventsHosted = Event.query.filter_by(userID=userID).all()

    if eventsHosted:
        eventsHosted = [event.eventID for event in eventsHosted]
    else:
        eventsHosted = []

    eventRatings = []
    for id in eventsHosted:
        eventRatings.extend(Event.query.filter(
            Event.eventID == id,
            Event.rating != None
        ).all())

    # eventRatings = [{"eventID": rating.eventID, "rating": rating.rating} for rating in eventRatings]
    eventRatingsArr = [rating.rating for rating in eventRatings]

    if len(eventRatingsArr) > 0:
        hostRating = round(statistics.mean(eventRatingsArr), 2)
    else:
        hostRating = None
        eventRatingsArr = []

    return {'status': '200', 'userID': userID, "eventsHosted": eventsHosted, "eventRatings": eventRatingsArr, "hostRating": hostRating}


@app.route("/events/addToCalendar", methods=["POST"])
def add_event_to_calendar():
    # the event id that I sent will be different
    data = request.json
    event_id = data.get('eventID')  # Ensure this matches your JS payload
    event = Event.query.filter_by(eventID=event_id).first()
    print("-------Logs------")
    pprint(vars(event))
    print("-------Logs------")
    if event:
        response = handle_google_api.add_to_calendar(event=event)
        if response["status"] == 200:
            return jsonify({"status": 200, "message": "Success"}), 200
        elif response["status"] == 100:
            return jsonify({"status": 400, "message": "This conflicts with another event!"}), 400
        else:
            return jsonify({"status": 400, "message": "Something went wrong with add to calendar"}), 400
    else:
        return jsonify({"status": 404, "message": "Event not found"}), 404


@app.route("/events/removeFromCalendar", methods=["POST"])
def remove_from_calendar():
    # the event id I get back will be slightly different
    data = request.json
    # Ensure this matches your JS payload
    event_id = data.get('eventID')
    event = Event.query.filter_by(eventID=event_id).first()
    if event:
        response = handle_google_api.remove_from_calendar(event=event)
        if response["status"] == 200:
            return jsonify({"status": 200, "message": "Success"}), 200
        else:
            return jsonify({"status": 400, "message": "Something went wrong with add to calendar"}), 400
    else:
        return jsonify({"status": 404, "message": "Event not found"}), 404


@app.route("/events/shareAndAddEvent", methods=["POST"])
def share_calendar_event():
    data = request.json
    event_id = data.get('eventID')
    # Provide a default empty list if not found
    emails_list = data.get('emailsList', [])
    event = Event.query.filter_by(eventID=event_id).first()
    if event:
        response = handle_google_api.add_event_with_people(
            event=event, email_lst=emails_list)
        if response["status"] == 200:
            return jsonify({"status": 200, "message": "Success"}), 200
        else:
            return jsonify({"status": 400, "message": "Something went wrong with add to calendar"}), 400
    else:
        return jsonify({"status": 404, "message": "Event not found"}), 404


@app.route("/events/getRSVPStatus", methods=["POST"])
def get_rsvp_status():
    data = request.json
    event_id = data.get('eventID')
    event = Event.query.filter_by(eventID=event_id).first()
    if event:
        response = handle_google_api.get_rsvp_list(event=event)
        if response["status"] == 200:
            # get the payload
            rsvp_status = response["data"]
            return jsonify({"status": 200, "message": "Success", "data": rsvp_status}), 200
        else:
            return jsonify({"status": 400, "message": "Something went wrong with add to calendar"}), 400
    else:
        return jsonify({"status": 404, "message": "Event not found"}), 404


@app.route("/events/getGoogleID", methods=["POST"])
def getGoogleID():
    data = request.json
    event_id = data.get('eventID')
    event = Event.query.filter_by(eventID=event_id).first()
    if event:
        if event.googleID:
            return jsonify({"status": 200, "message": "exists", "googleID": event.googleID})
        else:
            return jsonify({"status": 400, "message": "Doesn't exist"})
    else:
        return jsonify({"status": 400, "message": "event doesn't exist"})


@app.route("/check_owner", methods=["POST"])
@jwt_required()
def check_owner():
    event_id = request.json.get('eventID')
    # user_id = request.json.get('userID')
    current_user = get_jwt_identity()

    if current_user:
        userEmail = current_user.get('email')
        user = User.query.filter_by(email=userEmail).first()
        if user:
            user_id = user.id

    isOwner = False
    event = Event.query.filter_by(eventID=event_id).first()
    if event and event.userID == user_id:
        isOwner = True

    return jsonify({"userID": user.id, "eventID": event_id, "isOwner": isOwner}), 200


@app.route("/blog/delete_history", methods=["GET"])
@jwt_required()
def delete_blog():
    user = get_jwt_identity()

    curr = User.query.filter_by(email=user["email"]).first()

    curr.blogs.clear()

    db.session.commit()
    # db.session.update()

    return jsonify({"message": "deletion successful"}), 200


@app.route("/check_user", methods=["POST", "GET"])
@jwt_required()
def hello():
    user = get_jwt_identity()
    return jsonify(logged_in=user), 200


if __name__ == '__main__':
    # adding the ::1 creates a loopback allowing
    # mac users to fix cors error and connect using localhost
    app.run(host='::1', debug=True)
