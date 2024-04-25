from apiFetch.googleAPI import GoogleAPI
import os


def test_logout():

    try:
        google_api_instance = GoogleAPI(os.getcwd())
        token_data = google_api_instance.revoke_google_token()
        return True
    except Exception as e:
        print(e)
        return False


def test_login():

    # print("Invoked Function!!!")
    try:
        print(os.getcwd())
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
            # probably need another function here to actually save it to the database
            return {"flag": True, "credentials": credentials, "email": user_email}
    except Exception as e:
        print(e)
        return {"flag": False}


if __name__ == '__main__':
    x = input("Enter a letter: ")
    if x == "a":
        print(test_login())
    elif x == "b":
        print(test_logout())
