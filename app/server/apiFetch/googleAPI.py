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
        if curr_path == '':
            self.BASE_PATH = os.getcwd()
            # self.BASE_PATH = "/Users/visathongdee/Documents/GitHub/rendezview/app/server/apiFetch"
        else:
            self.BASE_PATH = os.path.join(curr_path, 'apiFetch')
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

    def add_event(self, creds, event):
        """
        Adds an event to the user's primary calendar.

        Args:
            creds: The OAuth2 credentials of the user.
            event (dict): The event to add, formatted according to the Google Calendar API specification.

        Returns:
            The created event if successful, including the event ID, None otherwise.
        """
        try:
            service = build('calendar', 'v3', credentials=creds)
            event_result = service.events().insert(
                calendarId='primary', body=event).execute()
            event_id = event_result.get('id')  # Retrieve the event ID
            print(f"Event created: {event_result.get('htmlLink')}")
            print(f"Event ID: {event_id}")
            return event_result, event_id  # This already includes the event ID
        except HttpError as error:
            print(f"An error occurred: {error}")
            return None

    def remove_event(self, creds, event_id):
        """
        Removes an event from the user's primary calendar.

        Args:
            creds: The OAuth2 credentials of the user.
            event_id (str): The ID of the event to remove.

        Returns:
            True if the event was successfully deleted, False otherwise.
        """
        try:
            service = build('calendar', 'v3', credentials=creds)
            service.events().delete(calendarId='primary', eventId=event_id).execute()
            print("Event deleted successfully.")
            return True
        except HttpError as error:
            print(f"An error occurred: {error}")
            return False

    def create_event_dict(self, summary=None, start_date=None, end_date=None, start_time=None, end_time=None, time_zone='America/New_York'):
        """
        Constructs an event dictionary for Google Calendar API.

        Args:
            summary (str): The title or summary of the event.
            start_date (str): The start date in 'YYYY-MM-DD' format.
            end_date (str): The end date in 'YYYY-MM-DD' format. For all-day events, this should be the day after the event.
            start_time (str, optional): The start time in 'HH:MM:SS' format. Optional for all-day events.
            end_time (str, optional): The end time in 'HH:MM:SS' format. Optional for all-day events.
            time_zone (str): The time zone of the event. Defaults to 'America/New_York'.

        Returns:
            dict: The event dictionary suitable for the Google Calendar API.
        """
        event = {}
        if summary:
            event['summary'] = summary
        else:
            event['summary'] = "No details were provided"

        # Determine if this is an all-day event or not based on the presence of start_time and end_time
        if start_time and end_time:
            # Time-specific event
            start_datetime = f"{start_date}T{start_time}"
            end_datetime = f"{end_date}T{end_time}"
            event['start'] = {
                'dateTime': start_datetime, 'timeZone': time_zone}
            # if no time zone is proided it will just choose America/NY time zone
            event['end'] = {'dateTime': end_datetime, 'timeZone': time_zone}
        else:
            # All-day event
            event['start'] = {'date': start_date}
            # Note: For all-day events, the end date is exclusive.
            event['end'] = {'date': end_date}

        return event

    def create_test_event(self):
        summary = "This is a test event to see if adding to calendar works"
        start_time = '10:00:00'
        end_time = '11:00:00'
        start_date = '2024-03-17'
        end_date = '2024-03-17'
        timeZone = 'America/New_York'
        # need to save an event id to the database for each event that is
        # added to the database
        events = self.create_event_dict(summary=summary, start_date=start_date,
                                        end_date=end_date, start_time=start_time, end_time=end_time, time_zone=timeZone)
        pprint(events)
        return events

    def add_event_with_attendees(self, creds, event, attendee_emails):
        """
        Adds an event to the user's primary calendar and sends invitations to the provided attendees.

        Args:
            creds: The OAuth2 credentials of the user.
            event (dict): The event to add, formatted according to the Google Calendar API specification.
            attendee_emails (list of str): A list of email addresses to invite to the event.

        Returns:
            The created event if successful, None otherwise.
        """
        # Add the attendees to the event dictionary
        attendees = [{'email': email} for email in attendee_emails]
        event['attendees'] = attendees

        try:
            service = build('calendar', 'v3', credentials=creds)
            event_result = service.events().insert(
                calendarId='primary', sendUpdates='all', body=event).execute()
            event_id = event_result.get('id')  # Retrieve the event ID
            print(f"Event ID: {event_id}")
            print(
                f"Event created and invitations sent: {event_result.get('htmlLink')}")
            return event_result, event_id
        except HttpError as error:
            print(f"An error occurred: {error}")
            return None

    def get_event_rsvp_status(self, creds, event_id):
        """
        Retrieves the RSVP status of all invitees for a specific event.

        Args:
            creds: The OAuth2 credentials of the user.
            event_id (str): The ID of the event.

        Returns:
            A dictionary with lists of emails categorized by their RSVP status: 'accepted', 'declined', 'needsAction'.
        """
        try:
            service = build('calendar', 'v3', credentials=creds)
            event = service.events().get(calendarId='primary', eventId=event_id).execute()
            attendees = event.get('attendees', [])

            # Categorize attendees by their response status
            rsvp_status = {'accepted': [], 'declined': [],
                           'needsAction': [], 'tentative': []}
            for attendee in attendees:
                if 'responseStatus' in attendee:
                    rsvp_status[attendee['responseStatus']].append(
                        attendee['email'])

            return rsvp_status
        except HttpError as error:
            print(f"An error occurred: {error}")
            return {}

    def log_items(self):

        msg = f"\nBase Path: \n{self.BASE_PATH}\nToken File Path: \n{self.TOKEN_FILE_PATH}\nCredentials File Path: \n{self.CREDENTIALS_FILE_PATH}\nCredential File Name: \n{self.CREDENTIAL_FILE_NAME}\nToken File Name: \n{self.TOKEN_FILE_NAME}\n"
        print(msg)

        return

    def test(self):
        """
        Test function:
        """
        save_id = "hq3nap6genbl0p80uqqr51llec"
        # will need to save event_result/id to database
        self.log_items()
        event_result = ""
        event_id = ""
        # successfully was able to send calendar invites and add these events
        # to the users calendars. Will just need to make sure the email is valid
        # and construct an attendees list
        # 'Stimilsina2034@gmail.com']
        attendees = ['Wintersoldier909@gmail.com']
        while True:
            try:
                x = input("Enter a letter: ")
                if x == "t":
                    print(
                        "-------Adding event to calendar with attendees...-------------")
                    event = self.create_test_event()
                    creds = self.user_token_exists()
                    event_result, event_id = self.add_event_with_attendees(
                        creds=creds, event=event, attendee_emails=attendees)
                elif x == "l":
                    print("-------Getting RSVP list for an event...-------------")
                    creds = self.user_token_exists()
                    rsp_list = self.get_event_rsvp_status(
                        creds=creds, event_id=save_id)
                    pprint(rsp_list)
                elif x == "c":
                    print("-------Adding event to calendar...-------------")
                    event = self.create_test_event()
                    creds = self.user_token_exists()
                    event_result, event_id = self.add_event(
                        creds=creds, event=event)
                elif x == "e":
                    print("-------Removing event from calendar...-------------")
                    # just need credentials and event id to remove
                    creds = self.user_token_exists()
                    self.remove_event(creds=creds, event_id=event_id)
                elif x == "a":
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
