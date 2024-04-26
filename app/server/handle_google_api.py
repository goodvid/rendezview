from apiFetch.googleAPI import GoogleAPI
from models import db
from models import User, Event, Group
import os
from geopy.geocoders import Nominatim
from timezonefinder import TimezoneFinder
from pprint import pprint
import traceback
from datetime import datetime, timedelta
import re


'''
Note: Need to figure out how I can have my code remember that an event was already added
when I added to the database. I am trying to use useEffect and stuff but it isn't working
so figure this out tomorrow. And also the reccommendation stuff. 
'''


# returns a list of emails
def get_group_list(email, event):
    print("-----------logs------------")
    # user = User.query.filter_by(email=email).first()
    # user_email = user.email
    # print(user_email)
    group = Group.query.filter_by(user=email).first()
    friends = group.friends
    friend_lst = friends.split(",")
    pattern = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    for friend in friend_lst:
        if re.match(friend, pattern):
            continue
        else:
            print({'status': 400, 'message': f'This email is invalid: {friend}'})

    # print('heereeee')
    print(email, friend_lst, event)
    response = add_event_with_people(event=event, email_lst=friend_lst)

    # print(friends)
    print("-----------logs------------")
    return response


def find_time_zone(address):
    # if problems arise, gotta replace user_age with something
    # useful like email or use case of application
    geolocator = Nominatim(user_agent="RendeView")
    location = geolocator.geocode(address)

    tf = TimezoneFinder()
    timezone = tf.timezone_at(lat=location.latitude, lng=location.longitude)

    return timezone


def add_to_calendar(event):
    try:
        google_api_instance = GoogleAPI(os.getcwd())
        credentials = google_api_instance.user_token_exists()
        if credentials == False:
            # user is not authenticated with google so
            # this feature is not allowed hence we return false
            return {"flag": False, "status": 400, "message": "User authentication failed"}
        event_name = event.name
        event_description = event.desc
        event_title = f"{event_name} - {event_description}"
        # for now I will just make the end_date the same
        # as the start date ---------
        # date_time_str = event.start_date
        # ------- Time stuff --------
        # itemlst = date_time_str.split(" ")
        # timelst = itemlst[1].split("-")
        # event_start_date = itemlst[0]
        # event_start_time = timelst[0]
        datetime_str = event.start_date.split(
            'T')[0] + 'T' + event.start_date.split('T')[1].split('-')[0]
        print("xx --------- xx")
        # print(datetime_str)
        itemlst = datetime_str.split("T")
        # print(itemlst)
        event_start_date = itemlst[0]
        event_start_time = itemlst[1]

        # ------- End Time stuff --------
        event_location = event.location
        event_time_zone = find_time_zone(event_location)
        google_event = google_api_instance.create_event_dict_v2(
            summary=event_title, start_date=event_start_date, start_time=event_start_time, time_zone=event_time_zone)

        # pprint(google_event)
        print(
            f"Summary: {event_title}, start time: {event_start_time}, start date: {event_start_date}, timezone: {event_time_zone}")

        # add google_event_id to database here
        event_in_db = Event.query.filter_by(eventID=event.eventID).first()
        print("her2")
        if event_in_db:
            # google event tuple is like -> (event_result, event_id)
            googleID = event_in_db.googleID
            if googleID:
                # if something is already there we will remove it
                # so we can create a new one
                status = google_api_instance.remove_event(
                    creds=credentials, event_id=googleID)
                if not status:
                    return {"flag": False, "status": 400, "message": "Event was not updated successfully"}
            google_event = google_api_instance.create_event_dict_v2(
                summary=event_title,
                start_date=event_start_date,
                start_time=event_start_time,
                time_zone=event_time_zone
            )
            google_event_tuple = google_api_instance.add_event(
                creds=credentials, event=google_event)
            if google_event_tuple == "conflict":
                return {"flag": False, "status": 100, "message": "You have a conflicting event at this time!"}
            elif not google_event_tuple:
                print("here")
                return {"flag": False, "status": 400, "message": "Event was not added successfully"}
            else:
                event_in_db.googleID = google_event_tuple[1]
                db.session.commit()
                return {"flag": True, "status": 200, "message": "Event updated successfully with Google ID"}
        else:
            return {"flag": False, "status": 404, "message": "Event not found in database"}
    except Exception as e:
        print(e)
        return {"flag": False, "status": 400}


def remove_from_calendar(event):
    try:
        google_api_instance = GoogleAPI(os.getcwd())
        credentials = google_api_instance.user_token_exists()
        if credentials == False:
            # user is not authenticated with google so
            # this feature is not allowed hence we return false
            return {"flag": False, "status": 400, "message": "User authentication failed"}
        event_in_db = Event.query.filter_by(eventID=event.eventID).first()
        if event_in_db:
            # google event tuple is like -> (event_result, event_id)
            googleID = event_in_db.googleID
            print(f"GOOOO: {googleID}")
            if not googleID:
                return {"flag": True, "status": 200, "message": "Event not in calendar"}
            status = google_api_instance.remove_event(
                creds=credentials, event_id=googleID)
            event_in_db.googleID = ""
            db.session.commit()
            if status:
                return {"flag": True, "status": 200, "message": "Event updated successfully with Google ID"}
            else:
                return {"flag": False, "status": 400, "message": "Something went wrong with deleting event"}
    except Exception as e:
        print(e)
        return {"flag": False, "status": 400}


def add_event_with_people(event, email_lst):
    try:
        google_api_instance = GoogleAPI(os.getcwd())
        credentials = google_api_instance.user_token_exists()
        if not credentials:
            return {"flag": False, "status": 400, "message": "User authentication failed"}

        print(repr(event))
        event_name = event.name
        event_description = event.desc
        event_title = f"{event_name} - {event_description}"

        # Simplified datetime parsing ignoring the timezone
        datetime_str = event.start_date.split(
            'T')[0] + 'T' + event.start_date.split('T')[1].split('-')[0]
        print("xx --------- xx")
        # print(datetime_str)
        itemlst = datetime_str.split("T")
        # print(itemlst)
        event_start_date = itemlst[0]
        event_start_time = itemlst[1]
        # event_time_zone = event.location
        print("xx --------- xx")
        # dt_format = "%Y-%m-%dT%H:%M:%S"
        # start_datetime = datetime.strptime(datetime_str, dt_format)

        # # Calculate end datetime to last for 24 hours
        # end_datetime = start_datetime + timedelta(hours=24)

        event_location = event.location
        event_time_zone = find_time_zone(event_location)
        event_in_db = Event.query.filter_by(eventID=event.eventID).first()

        if event_in_db:
            googleID = event_in_db.googleID
            if googleID:
                status = google_api_instance.remove_event(
                    creds=credentials, event_id=googleID)
                if not status:
                    return {"flag": False, "status": 400, "message": "Event was not updated successfully"}

            google_event = google_api_instance.create_event_dict_v2(
                summary=event_title,
                start_date=event_start_date,
                start_time=event_start_time,
                time_zone=event_time_zone
            )
            google_event_tuple = google_api_instance.add_event_with_attendees(
                creds=credentials, event=google_event, attendee_emails=email_lst)

            if not google_event_tuple:
                return {"flag": False, "status": 400, "message": "Event was not added successfully"}

            event_in_db.googleID = google_event_tuple[1]
            db.session.commit()
            return {"flag": True, "status": 200, "message": "Event updated successfully with Google ID"}
        else:
            return {"flag": False, "status": 404, "message": "Event not found in database"}

    except Exception as e:
        traceback.print_exc()
        return {"flag": False, "status": 400, "message": f"An error occurred: {str(e)}"}

# def add_event_with_people(event, email_lst):
#     try:
#         google_api_instance = GoogleAPI(os.getcwd())
#         credentials = google_api_instance.user_token_exists()
#         if credentials == False:
#             # user is not authenticated with google so
#             # this feature is not allowed hence we return false
#             return {"flag": False, "status": 400, "message": "User authentication failed"}

#         event_name = event.name
#         event_description = event.desc
#         event_title = f"{event_name} - {event_description}"
#         # for now I will just make the end_date the same
#         # as the start date ---------
#         date_time_str = event.start_date
#         # ------- Time stuff --------
#         itemlst = date_time_str.split(" ")
#         print(date_time_str)
#         timelst = itemlst[1].split(":")
#         event_start_date = itemlst[0]
#         event_start_time = timelst[0]
#         # ------- End Time stuff --------
#         event_location = event.location
#         event_time_zone = find_time_zone(event_location)
#         event_in_db = Event.query.filter_by(eventID=event.eventID).first()
#         print("x------------x")
#         print("ajsdjasdhajsdh")
#         if event_in_db:
#             # google event tuple is like -> (event_result, event_id)
#             googleID = event_in_db.googleID
#             if googleID:
#                 # otherwise already in calendar so we will remove it and create a new one
#                 status = google_api_instance.remove_event(
#                     creds=credentials, event_id=googleID)
#                 if not status:
#                     return {"flag": False, "status": 400, "message": "Event was not updated successfully"}
#             google_event = google_api_instance.create_event_dict_v2(
#                 summary=event_title, start_date=event_start_date, start_time=event_start_time, time_zone=event_time_zone)
#             google_event_tuple = google_api_instance.add_event_with_attendees(
#                 creds=credentials, event=google_event, attendee_emails=email_lst)
#             print("-------debug-------")
#             pprint(google_event_tuple)
#             print("-------debug-------")
#             if not google_event_tuple:
#                 print("here")
#                 return {"flag": False, "status": 400, "message": "Event was not added successfully"}
#             event_in_db.googleID = google_event_tuple[1]
#             db.session.commit()
#             return {"flag": True, "status": 200, "message": "Event updated successfully with Google ID"}
#         else:
#             return {"flag": False, "status": 404, "message": "Event not found in database"}
#     except Exception as e:
#         print("-----------error---------")
#         # print()
#         traceback.print_exc()
#         return {"flag": False, "status": 400}


def get_rsvp_list(event):
    try:
        google_api_instance = GoogleAPI(os.getcwd())
        credentials = google_api_instance.user_token_exists()
        if credentials == False:
            # user is not authenticated with google so
            # this feature is not allowed hence we return false
            return {"flag": False, "status": 400, "message": "User authentication failed"}
        event_in_db = Event.query.filter_by(eventID=event.eventID).first()
        if event_in_db:
            # google event tuple is like -> (event_result, event_id)
            googleID = event_in_db.googleID
            if not googleID:
                return {"flag": False, "status": 404, "message": "Event not in calendar"}
            rsvp_status = google_api_instance.get_event_rsvp_status(
                creds=credentials, event_id=googleID)
            if not rsvp_status:
                return {"flag": False, "status": 400, "message": "Something went wrong while retrieving RSVP status"}
            else:
                return {"flag": True, "status": 200, "data": rsvp_status}
    except Exception as e:
        print(e)
        return {"flag": False, "status": 400}


def handle_authentication():
    try:
        google_api_instance = GoogleAPI(os.getcwd())
        credentials = google_api_instance.user_token_exists()
        # prevents re-logging in
        if credentials != False:
            # since they already have credentials
            user_email = google_api_instance.get_user_email(credentials)
            return {"flag": True, "credentials": credentials, "email": user_email, "quiz": True}
        else:
            credentials = google_api_instance.authenticate()
            user_email = google_api_instance.get_user_email(credentials)
            google_api_instance.save_credentials_and_email(
                credentials, user_email)

            possible_user = User.query.filter_by(email=user_email).first()
            if possible_user:
                return {"flag": True, "credentials": credentials, "email": user_email, "quiz": True}

            # but if the user does not exist then we create the user and add it to the data base
            # Add the new user
            new_user = User(email=user_email,
                            username=user_email, password="N/A")
            db.session.add(new_user)
            db.session.commit()
            # probably need another function here to actually save it to the database
            return {"flag": True, "credentials": credentials, "email": user_email, "quiz": False}
    except Exception as e:
        print(e)
        return {"flag": False}


def handle_deauthentication():
    try:
        google_api_instance = GoogleAPI(os.getcwd())
        # print("Looooooog")
        # print(google_api_instance.BASE_PATH)
        # print("Loooooog")
        token_data = google_api_instance.revoke_google_token()
        # if token_data:
        #     # because right now username and email are the same
        #     # modify to not delete from database potentially?
        #     email = token_data["account"]
        #     User.query.filter_by(email=email).delete()
        #     db.session.commit()
        return True
    except Exception as e:
        print(e)
        return False


if __name__ == '__main__':
    find_time_zone("9632 NY-96, Trumansburg, NY 14886")
