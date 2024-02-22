from api.googleAPI import GoogleAPI
from models import db
from models import User
import os


def handle_authentication():
    print("Invoked Function!!!")
    try:
        google_api_instance = GoogleAPI(os.getcwd())
        credentials = google_api_instance.user_token_exists()
        # prevents re-logging in
        if credentials != False:
            user_email = google_api_instance.get_user_email(credentials)
            return {'flag': True, 'credentials': credentials, 'email': user_email}
        else:
            credentials = google_api_instance.authenticate()
            user_email = google_api_instance.get_user_email(credentials)
            google_api_instance.save_credentials_and_email(
                credentials, user_email)
            # Add the new user
            new_user = User(email=user_email, username=user_email,
                            password='N/A')
            db.session.add(new_user)
            db.session.commit()
            # probably need another function here to actually save it to the database
            return {'flag': True, 'credentials': credentials, 'email': user_email}
    except Exception as e:
        print(e)
        return {'flag': False}


def handle_deauthentication():
    try:
        google_api_instance = GoogleAPI()
        token_data = google_api_instance.revoke_google_token()
        if token_data:
            # because right now username and email are the same
            username = token_data["account"]
            email = username
            user_to_delete = User.query.filter_by(
                username=username, email=email).first()
            db.session.delete(user_to_delete)
            db.session.commit()
        return True
    except Exception as e:
        print(e)
        return False
