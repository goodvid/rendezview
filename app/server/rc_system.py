from models import db
from models import User, Event
import os
from pprint import pprint

# to make this more complex we need a few more attributes
# about the user than just prefrence lst


def calculate_similarity(category, user_location,  preference_lst):
    # Simple similarity measure based on matching attributes
    score = 0
    if category in preference_lst:
        score += 1
    if user_location and category in preference_lst:
        score += 1
    return score


def select_events_to_reccommend(user):
    # setup ----------
    prefrences = user.preferences
    user_location = user.location
    events = Event.query.all()
    # event_dict = {}
    # for event in events:
    #     event_dict[event.id] = event
    # setup end -------
    recommended_events = []
    if prefrences:
        preference_lst = prefrences.split(",")
        scored_events = []
        for event_option in events:
            similarity_score = calculate_similarity(
                event_option.category, user_location, preference_lst)
            scored_events.append((event_option, similarity_score))

        scored_events.sort(key=lambda x: x[1], reverse=True)
        # the number 5 or 10 can be adjusted
        recommended_events = scored_events[0:10]
        selected_events = []

        for event_option, _ in recommended_events:
            selected_events.append(event_option)
            print(
                f"Event Name: {event_option.name}, Category: {event_option.category}")

    return selected_events


if __name__ == '__main__':
    # get_events_from_database()
    select_events_to_reccommend(user=None)
