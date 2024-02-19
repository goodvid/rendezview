from api.googleAPI import GoogleAPI
import os


def handle_authentication():
    print("Invoked Function!!!")
    try:
        google_api_instance = GoogleAPI(os.getcwd())
        credentials = google_api_instance.authenticate()
        user_email = google_api_instance.get_user_email()
        google_api_instance.save_credentials_and_email(credentials, user_email)
        # probably need another function here to actually save it to the database
        return True
    except Exception as e:
        print(e)
        return False


def handle_deauthentication():
    try:
        google_api_instance = GoogleAPI()
        google_api_instance.revoke_google_token()
        return True
    except Exception as e:
        print(e)
        return False
