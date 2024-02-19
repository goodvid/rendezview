import datetime
import json
import requests
import os.path
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# If modifying these scopes, delete the file token.json.
SCOPES = ["https://www.googleapis.com/auth/calendar",
          'https://www.googleapis.com/auth/userinfo.email', 'openid']
PORT_NO = 8080


def authenticate():
    creds = None
    # The file token.json stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first time.
    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file("token.json", SCOPES)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                "credentials.json", SCOPES
            )
            creds = flow.run_local_server(port=PORT_NO)
        # Save the credentials for the next run
        with open("token.json", "w") as token:
            token.write(creds.to_json())

    return creds


def main():
    """
    Shows basic usage of the Google Calendar API.
    Prints the start and name of the next 10 events on the user's calendar.
    """
    creds = None
    # The file token.json stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first time.
    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file("token.json", SCOPES)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                "credentials.json", SCOPES
            )
            creds = flow.run_local_server(port=PORT_NO)
        # Save the credentials for the next run
        with open("token.json", "w") as token:
            token.write(creds.to_json())

    try:
        service = build("calendar", "v3", credentials=creds)

        # Call the Calendar API
        now = datetime.datetime.utcnow().isoformat() + "Z"  # 'Z' indicates UTC time
        print("Getting the upcoming 10 events")
        events_result = (
            service.events()
            .list(
                calendarId="primary",
                timeMin=now,
                maxResults=10,
                singleEvents=True,
                orderBy="startTime",
            )
            .execute()
        )
        events = events_result.get("items", [])

        if not events:
            print("No upcoming events found.")
            return

        # Prints the start and name of the next 10 events
        for event in events:
            start = event["start"].get("dateTime", event["start"].get("date"))
            print(start, event["summary"])

    except HttpError as error:
        print(f"An error occurred: {error}")


def get_user_email(credentials):
    """Fetches the user's email using their credentials.

    Args:
        credentials: OAuth2 credentials obtained during the authorization process.

    Returns:
        str: The user's email address.
    """
    user_info_service = build('oauth2', 'v2', credentials=credentials)
    user_info = user_info_service.userinfo().get().execute()
    return user_info.get('email')


def read_token_from_file(token_file_path='token.json'):
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


def revoke_google_token(token: str):
    """
    Revokes the given token, effectively detaching the Google account from the application.

    Args:
        token (str): The token to be revoked. This could be an access token or a refresh token.
    """
    revoke_endpoint = 'https://oauth2.googleapis.com/revoke'
    params = {'token': token}
    headers = {'content-type': 'application/x-www-form-urlencoded'}

    response = requests.post(revoke_endpoint, params=params, headers=headers)

    if response.status_code == 200:
        print("Token successfully revoked.")
    else:
        print(
            f"Failed to revoke token. Status code: {response.status_code}, Response: {response.text}")


def save_credentials_and_email(creds, email, file_path='token.json'):
    """Saves credentials and the user's email to a file.

    Args:
        creds: The OAuth2 credentials to save.
        email: The user's email address to save.
        file_path (str): Path to the file where the credentials and email should be saved.
    """
    token_info = json.loads(creds.to_json())  # Convert credentials to a dict
    token_info['account'] = email  # Add the email to the dict
    with open(file_path, 'w') as token_file:
        json.dump(token_info, token_file, indent=2)


def deAuthorize_account():

    return


if __name__ == "__main__":
    # if os.path.exists("token.json"):
    #     os.remove("token.json")
    creds = None
    # The file token.json stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first time.
    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file("token.json", SCOPES)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                "credentials.json", SCOPES
            )
            creds = flow.run_local_server(port=PORT_NO)
        # Save the credentials for the next run
        with open("token.json", "w") as token:
            token.write(creds.to_json())

    try:
        # user_email = get_user_email(creds)
        # print(f"User's email: {user_email}")
        # save_credentials_and_email(creds, user_email)
        print(read_token_from_file())
    except:
        print("Some error occurred")

    # if os.path.exists("token.json"):
    #     creds = Credentials.from_authorized_user_file("token.json", SCOPES)
    # user_email = get_user_email(creds)
    # print(f"User's email: {user_email}")
    # Example usage
    # token_data = read_token_from_file()
    # if token_data:
    #     print("Token data:", token_data)
    # main()
