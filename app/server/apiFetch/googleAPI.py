# from google_auth_oauthlib.flow import InstalledAppFlow
# from google.auth.transport.requests import Request
# import os
# import pickle
import json
import traceback
import time
import errno
import os
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from pprint import pprint
from flask import redirect


class GoogleAPI:

    # If modifying these scopes, delete the file token.json.
    SCOPES = ["https://www.googleapis.com/auth/calendar",
              'https://www.googleapis.com/auth/userinfo.email', 'openid']
    PORT_NO = 8080
    BASE_PATH = ''
    TOKEN_FILE_PATH = ''
    CREDENTIALS_FILE_PATH = ''
    CREDENTIAL_FILE_NAME = ''
    TOKEN_FILE_NAME = ''
    TIME_BREAK = 30

    def __init__(self, curr_path=''):
        self.TOKEN_FILE_NAME = 'token.json'
        self. CREDENTIAL_FILE_NAME = 'credentials.json'
        # if curr_path == '':
        #     self.BASE_PATH = os.path.join(os.getcwd(), 'apiFetch')
        self.BASE_PATH = "/Users/visathongdee/Documents/GitHub/rendezview/app/server/apiFetch"
        # else:
        #     self.BASE_PATH = os.path.join(curr_path, 'apiFetch')
        self.TOKEN_FILE_PATH = os.path.join(
            self.BASE_PATH, self.TOKEN_FILE_NAME)
        self.CREDENTIALS_FILE_PATH = os.path.join(
            self.BASE_PATH, self.CREDENTIAL_FILE_NAME)

    def user_token_exists(self):
        creds = None
        # The file token.json stores the user's access and refresh tokens, and is
        # created automatically when the authorization flow completes for the first time.
        if os.path.exists(self.TOKEN_FILE_PATH):
            creds = Credentials.from_authorized_user_file(
                self.TOKEN_FILE_PATH, self.SCOPES)
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
                return creds
            else:
                return False
        return creds

    def authenticate(self):
        print(self.BASE_PATH)
        creds = None
        # The file token.json stores the user's access and refresh tokens, and is
        # created automatically when the authorization flow completes for the first time.
        if os.path.exists(self.TOKEN_FILE_PATH):
            creds = Credentials.from_authorized_user_file(
                self.TOKEN_FILE_PATH, self.SCOPES)

        # If there are no (valid) credentials available, let the user log in.
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file(
                    self.CREDENTIALS_FILE_PATH, self.SCOPES
                )
            try:
                creds = flow.run_local_server(port=self.PORT_NO)
            except OSError as e:
                if e.errno == errno.EADDRINUSE:
                    print(f"Port {self.PORT_NO} in use, retrying...")
                    time.sleep(self.TIME_BREAK)
                    creds = flow.run_local_server(port=self.PORT_NO)
                else:
                    raise

            # Save the credentials for the next run
            with open(self.TOKEN_FILE_PATH, "w") as token:
                token.write(creds.to_json())

        return creds

    def get_user_email(self, credentials):
        """Fetches the user's email using their credentials.
        Args:
            credentials: OAuth2 credentials obtained during the authorization process.
        Returns:
            str: The user's email address.
        """
        user_info_service = build('oauth2', 'v2', credentials=credentials)
        user_info = user_info_service.userinfo().get().execute()
        return user_info.get('email')

    def read_token_from_file(self, token_file_path='token.json'):
        """
        Reads and returns the token information from a specified token file.
        Args:
            token_file_path (str): Path to the token file.
        Returns:
            dict: Token information, including access token and refresh token.
        """
        try:
            with open(token_file_path, 'r') as token_file:
                token_data = json.load(token_file)
                return token_data
        except FileNotFoundError:
            print(f"No token file found at {token_file_path}.")
            return None
        except json.JSONDecodeError:
            print(f"Error decoding JSON from {token_file_path}.")
            return None

    def revoke_google_token(self):
        """
        Revokes the given token, effectively detaching the Google account from the application.
        Args:
            token (str): The token to be revoked. This could be an access token or a refresh token.
        """
        token_data = None
        print("\n"+self.TOKEN_FILE_PATH+"\n")
        print("\n"+self.BASE_PATH+"\n")
        print("\n"+self.CREDENTIALS_FILE_PATH+"\n")
        if os.path.exists(self.TOKEN_FILE_PATH):
            print("entered hereeee")
            with open(self.TOKEN_FILE_PATH, 'r') as token_file:
                token_data = json.load(token_file)
            token_file.close()
            os.remove(self.TOKEN_FILE_PATH)
        return token_data

    def save_credentials_and_email(self, creds, email):
        """
        Saves credentials and the user's email to a file.
        Args:
            creds: The OAuth2 credentials to save.
            email: The user's email address to save.
            file_path (str): Path to the file where the credentials and email should be saved.
        """
        token_info = json.loads(
            creds.to_json())
        token_info['account'] = email
        with open(self.TOKEN_FILE_PATH, 'w') as token_file:
            json.dump(token_info, token_file, indent=2)

    def log_items(self):

        msg = f"\nBase Path: \n{self.BASE_PATH}\nToken File Path: \n{self.TOKEN_FILE_PATH}\nCredentials File Path: \n{self.CREDENTIALS_FILE_PATH}\nCredential File Name: \n{self.CREDENTIAL_FILE_NAME}\nToken File Name: \n{self.TOKEN_FILE_NAME}\n"
        print(msg)

    def test(self):
        """
        Test function:
        """
        self.log_items()
        while True:
            try:
                x = input("Enter a letter: ")
                if x == "a":
                    print("-------Authenticating...-------------")
                    creds = self.authenticate()
                    user_email = self.get_user_email(creds)
                    self.save_credentials_and_email(creds, user_email)
                    pprint(creds)
                    print(user_email)
                elif x == "r":
                    print("-------Reading Data....-------------")
                    token_data = self.read_token_from_file()
                    pprint(token_data)

                elif x == "d":
                    print(
                        "-------Revoking or disconnecting from google account...-------------")
                    self.revoke_google_token()
                else:
                    break
            except Exception as e:
                print(e)
                print(traceback.format_exc())
                print("error occurred during test operation")

        return


if __name__ == "__main__":
    google = GoogleAPI()
    google.test()
    # TODO
    # Modify Redirect URI
    # Change to dynamic PORT PORT_NO = 0 will handle that
    # Save to DataBase
