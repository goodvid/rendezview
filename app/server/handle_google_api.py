from apiFetch.googleAPI import GoogleAPI
from models import db
from models import User, Event
import os


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
        event_start_time = event.start_time
        event_end_time = event.end_time
        # for now I will just make the end_date the same
        # as the start date ---------
        event_start_date = event.start_date
        event_end_date = event.start_date
        event_location = event.location
        print(event_name, event_description, event_start_time,
              event_end_time, event_start_date, event_end_date, event_location)
        return {"flag": False, "status": 200}
        # -----------------------------
    except Exception as e:
        print(e)
        return {"flag": False, "status": 400}


def handle_authentication():
    print("Invoked Function!!!")
    try:
        google_api_instance = GoogleAPI(os.getcwd())
        credentials = google_api_instance.user_token_exists()
        # prevents re-logging in
        if credentials != False:
            user_email = google_api_instance.get_user_email(credentials)
            return {"flag": True, "credentials": credentials, "email": user_email}
        else:
            credentials = google_api_instance.authenticate()
            user_email = google_api_instance.get_user_email(credentials)
            google_api_instance.save_credentials_and_email(
                credentials, user_email)
            # Add the new user
            new_user = User(email=user_email,
                            username=user_email, password="N/A")
            db.session.add(new_user)
            db.session.commit()
            # probably need another function here to actually save it to the database
            return {"flag": True, "credentials": credentials, "email": user_email}
    except Exception as e:
        print(e)
        return {"flag": False}


def handle_deauthentication():
    try:
        google_api_instance = GoogleAPI()
        token_data = google_api_instance.revoke_google_token()
        if token_data:
            # because right now username and email are the same
            email = token_data["account"]
            User.query.filter_by(email=email).delete()
            db.session.commit()
        return True
    except Exception as e:
        print(e)
        return False
