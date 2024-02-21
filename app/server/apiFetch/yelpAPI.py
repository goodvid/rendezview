import requests
import os
from pprint import pprint


class YelpAPI:
    # API Key
    API_KEY = 'tm1qsKBzMGovoQww-WCTy1eHHngfjCbZP8Rm1bkk1hbJdSK-1BSKAljekIPcDJM_5Iao2n7rJbZ_wAYa6Dd75x_wEJoQrHgXaA_jfyzeYunUrPnKkXQlzecdX5zLZXYx'
    # API constants, you shouldn't have to change these.
    API_HOST = 'https://api.yelp.com/v3'
    HEADERS = {'Authorization': f'Bearer {API_KEY}'}

    def __init__(self, type="events", location='New York, NY', amount=20, sort_on='time_start', sort_by='desc', is_free=""):
        # default configurations
        self.default_search_path = os.path.join(self.API_HOST, type)
        self.remaining_requests = 0
        self.location = location
        self.amount = amount
        self.sort_on = sort_on
        self.sort_by = sort_by
        self.start_date = sort_by
        self.is_free = is_free 

    def expand_search_path(self, input_path):
        new_path = os.path.join(self.default_search_path, input_path)
        return new_path

    def set_base_search_path(self, request_type):
        if request_type == 'events' or request_type == 'categories' or request_type == 'businesses' or request_type == 'reviews':
            self.default_search_path = os.path.join(
                self.API_HOST, request_type)
            return True
        else:
            # means an unsupported request type was sent
            print(f"Error: Unsupported Request Type, search path not set")
            return False

    def set_location(self, location):
        self.location = location

    # def set_start_date(self, start_date):
    #     self.start_date = start_date 

    def set_is_free(self, is_free):
        self.is_free = is_free; 

    def set_sort_on(self, sort_on):
        self.sort_on = sort_on 

    # def set_sort_by(self, sort_by):
    #     self.sort_by = sort_by

    def set_amount(self, amount):
        self.amount = min(amount, 50)

    def check_rate_limit(self, headers):
        # Check rate limit headers
        limit = headers.get('X-RateLimit-Limit')
        remaining = headers.get('X-RateLimit-Remaining')
        # Convert them to integers to perform calculations
        if limit and remaining:
            limit = int(limit)
            self.remaining_requests = int(remaining)
            # Check if remaining requests are less than a certain threshold, e.g., 10% of the limit
            threshold = 0.1 * limit
            if self.remaining_requests <= threshold:
                return f"Warning: You are close to the rate limit. You have {remaining} requests left out of {limit}."
            else:
                return "Good"

    # def get_events_based_on_location(self, location="", start_date="", is_free=None, sort_on="time_start", sort_by="desc"):
    # def get_events_based_on_location(self, location="", sort_on=""):
    def get_events_based_on_location(self, location="", is_free="", sort_on=""):
        if location != "":
            # if we give it a new location, we set it
            # otherwise we just use the previous stored location
            # in the class
            self.set_location(location)

        if is_free != "":
            self.set_is_free(is_free)

        if sort_on != "":
            self.set_sort_on(sort_on)

        params = {
            'location': location,
            'limit': self.amount,
            'sort_on': self.sort_on,
            'sort_by': self.sort_by,
            'is_free': self.is_free,
        }
        response = requests.get(
            self.default_search_path, headers=self.HEADERS, params=params)
        
        print("url6:", response.url)
        if response.status_code == 200:
            print(self.check_rate_limit(response.headers))
            # pprint(response)
            events = response.json()['events']
            # pprint(events)
            # for event in events:
            #     print(event['name'], '-', event['time_start'])
        else:
            # print(response.status_code, response.text)
            # print(self.default_search_path, self.amount, self.location,
                #   self.sort_by, self.sort_on)
            print("Failed to fetch events")
        return events

    def get_events_based_on_category(self, category):
        # for test
        category = "Airsoft"
        params = {
            'location': self.location,
            'limit': self.amount,
            'categories': category,
        }
        response = requests.get(
            self.default_search_path, headers=self.HEADERS, params=params)
        if response.status_code == 200:
            print(self.check_rate_limit(response.headers))
            pprint(response)
        else:
            print(response.text)
            print("Failed to fetch events")
        return

    # modify later
    def get_events_based_on_price(self, sorting_type, amount):
        params = {
            'location': self.location,
            'limit': self.amount,
        }
        response = requests.get(
            self.default_search_path, headers=self.HEADERS, params=params)
        if response.status_code == 200:
            print(self.check_rate_limit(response.headers))
            pprint(response)
        else:
            print(response.text)
            print("Failed to fetch events")

        return

    # idk if we even need this
    def get_businesses_based_on_location(self):
        params = {
            'term': 'restaurants',  # Looking for restaurants as an example
            'location': 'New York, NY',
            'limit': 5
        }
        response = requests.get(
            self.default_search_path, headers=self.HEADERS, params=params)
        print(response)
        if response.status_code == 200:
            businesses = response.json()['businesses']
            for business in businesses:
                print(business['name'], '-',
                      business.get('rating', 'No rating'), 'Stars')
        else:
            print("Failed to fetch businesses")

        return
    
    


if __name__ == '__main__':
    # Example Usage
    yelpAPI = YelpAPI()
    yelpAPI.get_events_based_on_location()
