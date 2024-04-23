from flask import Flask,  request, jsonify, session, redirect
from flask_session import Session
from models import db  # Importing the db instance and models
from flask_cors import CORS, cross_origin
from models import User, Event, EventRating
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

from config import ApplicationConfig

from apiFetch.yelpAPI import YelpAPI

import os
import json
import statistics

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
            identity={"email": email, "name": email}
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
def signOutFromGoogle():
    # data = request.json
    # print("------logs-------")
    # print(data)
    # print("------logs-------")
    response = handle_google_api.handle_deauthentication()
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
            identity={'email': request.json["newEmail"], 'name': username})
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
    access_token = create_access_token(
        identity={"email": email, "name": email})
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
                  'desc': event.desc}
        event_values.append(values)

    # add from saved events sob

    return {'status': '200', 'events': event_values}


@app.route("/event/edit", methods=["POST"])
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
                  'rating': event.rating if event.rating is not None else None,
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
    events = yelp_api_instance.get_events_based_on_location(
        location=loc, is_free=is_free, sort_on=sort_on, start_date=start_date, category=category)

    # # Check the count of fetched events against existing events in the database
    fetched_events_count = len(events)

    try:
        db.session.query(Event).filter(Event.yelpID.isnot(
            None)).delete(synchronize_session=False)
        db.session.query(Event).filter(Event.yelpID.isnot(
            None)).delete(synchronize_session=False)
        # db.session.query(Event).delete()

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
                newEvent = Event(name=name, desc=eventDesc, location=locationAddress,
                                 start_date=eventDateTime, category=category, yelpID=yelpID)
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

    return jsonify({"message": message, "eventID": event_id, "ratingFrom": ratingFrom, "avgRating": avgRating, "numOfRatings": numOfRatings, "posRatings": posRatings}), 201


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
    if eventRatingsArr:
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


@app.route("/events/dummyCall", methods=["POST"])
@jwt_required()
def dummy_call():
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user['email']).first()
    print("-------logs-------")
    event_obj_lst = rc_system.select_events_to_reccommend(user=user)
    print(event_obj_lst)
    print(type(event_obj_lst))
    #  "events": event_obj_lst
    print("-------logs-------")

    return jsonify({"status": 200}), 200


@jwt_required
def hello():
    user = get_jwt_identity()
    return jsonify(logged_in=user), 200


if __name__ == '__main__':
    # adding the ::1 creates a loopback allowing
    # mac users to fix cors error and connect using localhost
    app.run(host='::1', debug=True)
