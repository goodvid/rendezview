import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import testImage from "../../media/testImage.jpeg";
import "./EventDetails.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { pinwheel } from "ldrs";
import categories from "../eventCategories.json";
import Event from "../../components/Event/Event";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import {
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Link,
  TextField,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";
import ShareIcon from "@mui/icons-material/Share";
import DeleteIcon from "@mui/icons-material/Delete";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import IconButton from "@mui/material/IconButton";
import {
  ReadMoreButton,
  YellowButton,
  RedButton,
  GrayButton,
  EventDetailsButton,
} from "../../components/StyledComponents/StyledComponents";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Diversity3Icon from '@mui/icons-material/Diversity3';

function EventDetails() {
  // TODO: replace hard coded names
  pinwheel.register(); // Set loading animation
  let id = useParams();
  let resp = false;
  const [eventName, setEventName] = useState("");
  const [eventID, setEventId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [category, setCategory] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [similarEvents, setSimilarEvents] = useState([]);
  const [rating, setRating] = useState(0);
  const [userID, setUserID] = useState("");
  const [googleID, setGoogleID] = useState("");
  const [avgRating, setAvgRating] = useState(null);
  const [numOfRatings, setNumOfRatings] = useState(0);
  const [isOwner, setIsOwner] = useState(0);
  const [eventObject, setEventObject] = useState({
    eventID: "",
    desc: "",
    name: "",
    location: "",
    event_datetime: "",
    hostName: "",
    userID: "",
    rating: "",
    category: "",
    type: "",
  });

  const navigate = useNavigate();

  dayjs.extend(utc);
  dayjs.extend(timezone);

  useEffect(() => {
    fetchEventObject();
    getUserID();
  }, [id]);

  useEffect(() => {
    console.log("eventObject:", eventObject);
    setEventName(eventObject.name);
    setEventId(eventObject.eventID);
    setDate(eventObject.startDate);
    setTime(eventObject.startTime);
    setDescription(eventObject.desc);
    setLocation(eventObject.location);

    if (eventObject.yelpID) {
      if (!eventObject.hostName) {
        setOrganizer(null);
      } else {
        getYelpBusinessName(eventObject.hostName);
      }
    } else {
      setOrganizer(eventObject.hostName);
    }

    setCategory(eventObject.category);

    // Get similar events
    fetchSimilarEvents();
  }, [eventObject, id]);

  useEffect(() => {
    // Ensure eventObject is not empty and has an eventID
    if (eventObject.eventID) {
      console.log("HEREEEEE");
      fetch("http://localhost:5000/events/getGoogleID", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventID: eventObject.eventID }), // Directly pass eventID here
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("HEREEEEE");
          console.log(data);
          if (data.googleID) {
            setGoogleID(data.googleID); // This will also update isAddedToCalendar due to the useEffect dependency on googleID
          } else {
            // Handle the case where googleID is not found or returned
            console.log("GoogleID not found for the event");
            setGoogleID("");
          }
        })
        .catch((error) => console.error("Failed to fetch googleID:", error));
    }
  }, [eventObject, googleID]);

  useEffect(() => {
    setIsAddedToCalendar(!!googleID);
  }, [googleID]);

  useEffect(() => {
    console.log("useEffect rating:", rating);
    if (userID && eventID && rating) {
      updateRating(eventID, userID, rating)
        .then(() => {
          getAvgRating();
        })
        .catch((error) => {
          console.error("Failed to update rating:", error);
        });
    }
  }, [rating]);

  useEffect(() => {
    if (eventID && userID) {
      console.log("getRating");
      getRating();
    }
  }, [id, eventID, userID]);

  useEffect(() => {
    if (eventID || userID) {
      console.log("get average rating");
      getAvgRating();
    }
  }, [id, eventID]);

  const [isAddedToCalendar, setIsAddedToCalendar] = useState(false);

  const removeFromCalendar = () => {
    // Implement the actual removal logic here, similar to addToCalendar
    // For demonstration, just setting the state back to false
    const eventData = { eventID: eventObject.eventID };
    fetch("http://localhost:5000/events/removeFromCalendar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          alert("Successfully removed from Calendar!");
          setIsAddedToCalendar(false);
        } else {
          alert("Error in removing from Calendar: " + data.message);
          setIsAddedToCalendar(true);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const addToCalendar = () => {
    // Assuming your eventObject contains an eventID field with the correct value
    const eventData = { eventID: eventObject.eventID };

    fetch("http://localhost:5000/events/addToCalendar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          alert("Successfully Added to the Calendar");
          setIsAddedToCalendar(true);
        } else {
          alert("Error Adding to Calendar: " + data.message);
          setIsAddedToCalendar(false);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const fetchEventObject = () => {
    // Fetch event object
    setLoading(true);
    fetch("http://localhost:5000/event/details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(id),
    })
      .then((response) => {
        resp = response;
        return response.json();
      })
      .then((data) => {
        if (resp.status === 200) {
          console.log(data);
          setEventObject(data.event_json);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const getUserID = () => {
    setLoading(true);
    fetch("http://localhost:5000/get_user_id", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    })
      .then((response) => {
        if (response.status != 200) {
          console.log("not logged in");
          return;
        }
        return response.json();
      })
      .then((data) => {
        console.log("userID:", data.userID);
        setUserID(data.userID);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const updateRating = (eventID, userID, rating) => {
    console.log("updateRating");

    // Return the fetch promise
    return fetch("http://localhost:5000/rate_event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventID: eventID,
        yelpID: eventObject.yelpID,
        userID: userID,
        rating: rating,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        return data;
      })
      .catch((error) => {
        console.error("Error:", error);
        throw error;
      });
  };

  const getRating = () => {
    setLoading(true);
    fetch("http://localhost:5000/get_rating", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventID: eventID,
        yelpID: eventObject.yelpID,
        userID: userID,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log("rating json:", data);
        console.log("get rating:", data.rating);
        setRating(data.rating);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  };

  const getAvgRating = () => {
    fetch("http://localhost:5000/get_avg_rating", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventID: eventID,
        yelpID: eventObject.yelpID,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("avgRating:", data);
        setAvgRating(data.avgRating);
        setNumOfRatings(data.numOfRatings);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    // Send data to Flask server
    fetch("http://localhost:5000/profile/join-event", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ "event id": eventObject.eventID }),
    })
      .then((response) => {
        if (response.status === 200) {
          alert("event joined successfully");
          setLoading(false);
          return response.json();
        } else {
          alert("error");
          setLoading(false);
          return false;
        }
      })
      .then(() => { })
      .catch((error) => {
        console.log("error", error);
        setLoading(false);
      });
  };

  const getYelpBusinessName = (businessID) => {
    setLoading(true);

    const params = new URLSearchParams({ businessID: businessID });
    axios
      .get(`http://localhost:5000/events/business?${params}`)
      .then((response) => {
        console.log("Business fetched: ", response.data);
        // console.log("name:", response.data.business.name);
        setOrganizer(response.data.business.name);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching business name:", error);
        setLoading(false);
      });
  };

  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = useState(""); // define up here
  const [emailsList, setEmailsList] = useState([]);

  const changeEmail = (event) => {
    if (event != null) {
      setEmail(event.target.value);
    }
  };

  const handleAddEmail = (event) => {
    if (email) {
      setEmailsList((prevEmails) => [...prevEmails, email]);
      setEmail("");
    }
  };
  const displayEmail = (event) => {
    event.preventDefault();
    // Will submit my email list here
    const eventData = { eventID: eventObject.eventID, emailsList: emailsList };

    fetch("http://localhost:5000/events/shareAndAddEvent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          alert("Successfully Added to the Calendar");
          setEmailsList([]); // This resets the emailsList to an empty array
          setEmail("");
          handleClose();
          setIsAddedToCalendar(true);
        } else {
          alert("Error Adding to Calendar: " + data.message);
          setEmailsList([]); // This resets the emailsList to an empty array
          setEmail("");
          handleClose();
          setIsAddedToCalendar(false);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    console.log("Emails to share with:", emailsList);
  };

  const dummyCall = (event) => {
    // Figure out how to get userID
    const user_id = { userID: userID };
    fetch("http://localhost:5000/events/dummyCall", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user_id),
    }).catch((error) => {
      console.error("Error:", error);
    });
  };

  const dummyRSVPList = [
    { name: "John Doe", status: "accepted" },
    { name: "Jane Smith", status: "declined" },
    { name: "Alice Johnson", status: "no response" },
    { name: "Bob Brown", status: "accepted" },
  ];

  const [openRSVP, setOpenRSVP] = useState(false);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [displayList, setDisplayList] = useState(dummyRSVPList);
  const [eventRSVPList, setEventRSVPList] = useState([]); // Initialize state for the RSVP list

  const getRSVPList = (newFilter) => {
    setCurrentFilter(newFilter); // Update the current filter state

    const filteredList =
      newFilter === "all"
        ? eventRSVPList
        : eventRSVPList.filter(
          (item) => item.status.toLowerCase() === newFilter
        );

    setDisplayList(filteredList);
  };

  const handleOpenRSVPDialog = () => {
    setOpenRSVP(true);
    // Will submit my email list here
    const eventData = { eventID: eventObject.eventID };

    fetch("http://localhost:5000/events/getRSVPStatus", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          // Process and update eventRSVPList here
          const processedRSVPList = [];
          const rsvpStatus = data.data; // The structure you described

          // Loop through each status category in rsvpStatus
          Object.keys(rsvpStatus).forEach((status) => {
            // For each status, go through the list of names and add them to processedRSVPList
            rsvpStatus[status].forEach((name) => {
              processedRSVPList.push({ name: name, status: status });
            });
          });
          // Update the state with the new list
          setEventRSVPList(processedRSVPList);
        } else {
          alert(
            "Can't get RSVP list of an event not added to calendar: " +
            data.message
          );
          setOpenRSVP(false);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    getRSVPList("all"); // Default to showing all
  };

  const handleCloseRSVPDialog = () => {
    setOpenRSVP(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEmailsList([]); // This resets the emailsList to an empty array
    setEmail("");
  };

  const handleRating = (vote) => {
    if (rating === vote) {
      setRating(0);
    } else {
      setRating(vote);
    }
  };

  const checkIfPast = () => {
    const eventDate = dayjs(date);
    const diff = dayjs().diff(eventDate);
    if (diff < 0) {
      return false;
    } else {
      return true;
    }
  };

  const EventInfoSection = () => {
    return (
      <div>
        <Stack direction="row" marginBlock="1rem">
          <Stack width="100%" justifyContent="flex-start" textAlign="left">
            <h1>{eventName}</h1>

            <h3 style={{ color: "#818181" }}>
              {date} {time}
            </h3>
          </Stack>
          <Stack
            width="100%"
            direction="row"
            justifyContent="flex-end"
            gap="1rem"
            color="#818181"
          >
            <Stack direction="row" alignItems="center" gap="0.5rem">
              <EventDetailsButton
                startIcon={<EventIcon />}
              // onClick={}
              >
                Add to Calendar
              </EventDetailsButton>
            </Stack>

            <Stack direction="row" alignItems="center" gap="0.5rem">
              <EventDetailsButton
                startIcon={<ShareIcon />}
                onClick={handleClickOpen}
              >
                Share
              </EventDetailsButton>
              <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                  component: "form",
                  onSubmit: (event) => {
                    event.preventDefault();
                    const formData = new FormData(event.currentTarget);
                    const formJson = Object.fromEntries(formData.entries());
                    const email = formJson.email;
                    console.log(email);
                    handleClose();
                  },
                }}
              >
                <DialogTitle>Share Link</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    <Link
                      href={`http://localhost:3000/eventdetails/${eventID}`}
                    >
                      http://localhost:3000/eventdetails/{eventID}
                    </Link>
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Close</Button>
                </DialogActions>
              </Dialog>
            </Stack>
          </Stack>
        </Stack>
        <Stack>
          <img src={testImage} style={{ borderRadius: "1rem" }} />
        </Stack>
        <Stack alignItems="flex-start" marginTop="1rem" direction="row">
          {sessionStorage.getItem("token") ? (
            <YellowButton
              textAlign="left"
              variant="contained"
              onClick={handleSubmit}
            >
              Join Event
            </YellowButton>
          ) : (
            <></>
          )}

          {sessionStorage.getItem("token") && checkIfPast() ? (
            <Stack
              direction="row"
              marginInline="2rem"
              alignItems="center"
              justifyItems="center"
              gap="1rem"
            >
              <Stack
                direction="row"
                // marginInline="2rem"
                alignItems="center"
                gap="0.5rem"
              >
                <IconButton
                  onClick={() => handleRating(1)}
                  aria-label="like"
                  size="small"
                >
                  {rating === 1 ? <ThumbUpAltIcon /> : <ThumbUpOffAltIcon />}
                </IconButton>

                <IconButton
                  onClick={() => handleRating(-1)}
                  aria-label="like"
                  size="small"
                >
                  {rating === -1 ? (
                    <ThumbDownAltIcon />
                  ) : (
                    <ThumbDownOffAltIcon />
                  )}
                </IconButton>
              </Stack>
              {numOfRatings > 0 ? (
                <p>
                  {avgRating}% ({numOfRatings})
                </p>
              ) : (
                <p>(Event not rated)</p>
              )}
            </Stack>
          ) : (
            <div />
          )}
        </Stack>
      </div>
    );
  };

  const EventDetailsSection = () => {
    return (
      <Stack className="section">
        <h2>Event Details</h2>
        {description.length > 500 ? (
          <div>
            {showAll ? (
              <div>
                <p>{description}</p>
                <ReadMoreButton size="small" onClick={() => setShowAll(false)}>
                  Read Less
                </ReadMoreButton>
              </div>
            ) : (
              <div>
                <p>{description.substring(0, 500).concat("...")}</p>
                <ReadMoreButton size="small" onClick={() => setShowAll(true)}>
                  Read More
                </ReadMoreButton>
              </div>
            )}
          </div>
        ) : (
          description
        )}
      </Stack>
    );
  };

  const LocationSection = () => {
    return (
      <Stack className="section">
        <h2>Location</h2>
        <Stack direction="row" alignItems="center" gap="1rem">
          <LocationOnIcon />
          <h3>{location}</h3>
        </Stack>
      </Stack>
    );
  };

  const OrganizerSection = () => {
    return (
      organizer && ( // Don't show organizer section if there is no organizer
        <Stack className="section">
          <h2>Organizer</h2>
          <Stack direction="row" alignItems="center" gap="1rem">
            <PersonIcon />
            <h3>{organizer}</h3>
          </Stack>
        </Stack>
      )
    );
  };

  const CategorySection = () => {
    return (
      category && ( // Don't show organizer section if there is no organizer
        <Stack className="section">
          <h2>Category</h2>
          <Stack direction="row" alignItems="center" gap="1rem">
            <Stack
              direction="row"
              gap="1rem"
              justifyContent="space-start"
              flexWrap="wrap"
              width="100%"
            >
              {categories.find((cat) => cat.value === category)?.name ||
                category}
            </Stack>
          </Stack>
        </Stack>
      )
    );
  };

  const deleteEvent = () => {
    axios
      .post("http://localhost:5000/delete_event", {
        event: eventObject,
      })
      .then((res) => {
        console.log(res.data);
      });

    navigate("/events");
  };

  const editEvent = () => {
    sessionStorage.setItem("cur_event", JSON.stringify(eventObject));
    navigate(`/edit_event/${eventObject.eventID}`);
  };

  const EditDelete = () => {
    return (
      <div
        className="w-[100%] flex flex-row justify-center mt-8"
        id="EditDelete"
      >
        {userID == eventObject.userID ? (
          <>
            <GrayButton
              textAlign="left"
              variant="contained"
              onClick={editEvent}
            >
              Edit Event
            </GrayButton>
            <RedButton
              textAlign="left"
              variant="contained"
              onClick={deleteEvent}
            >
              Delete Event
            </RedButton>
          </>
        ) : (
          <></>
        )}
      </div>
    );
  };

  const checkOwner = () => {
    console.log("eventID:", eventObject.eventID);

    if (eventObject.yelpID) {
      //setIsOwner(false);
      return false;
    }
    return userID == eventObject.userID;

    // fetch("http://localhost:5000/check_owner", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: "Bearer " + sessionStorage.getItem("token"),
    //   },
    //   body: JSON.stringify({
    //     eventID: eventObject.eventID,
    //   }),
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log("owner json:", data);
    //     //console.log("owner:", data.isOwner);
    //     //setIsOwner(data.isOwner);
    //     // setLoading(false);
    //   })
    //   .catch((error) => {
    //     console.error("Error:", error);
    //     // setLoading(false);
    //   });
  };

  useEffect(() => {
    console.log("isOwner:", isOwner);
  }, [isOwner]);

  const fetchSimilarEvents = () => {
    console.log("fetching...");
    setLoading(true);

    axios
      .get("http://localhost:5000/events")
      .then((response) => {
        console.log(
          "Similar events fetched:",
          response.data["events"]
            .filter((event) => event.category === eventObject.category)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
        );
        setSimilarEvents(
          response.data["events"]
            .filter((event) => event.category === eventObject.category)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
        );
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        setLoading(false);
      });
  };

  const SimilarEventsSection = () => {
    return (
      <Stack className="section">
        <h2>Explore Similar Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {similarEvents.map((event, i) => {
            return (
              <Event
                id={event.id}
                name={event.name}
                date={dayjs(event.time).toString()}
                location={event.location}
                desc={event.desc}
                key={i}
              />
            );
          })}
        </div>
      </Stack>
    );
  };

  const setVisibility = (visibility) => {
    axios
      .post("http://localhost:5000/set_visibility", {
        'eventID': eventID,
        'visibility': visibility,
      })
      .then((res) => {
        console.log(res.data);
      });
  }

  return (
    <div
      style={{
        position: "absolute",
        top: "0px",
        bottom: "0px",
        right: "0px",
        left: "0px",
      }}
    >
      <Navbar />
      {loading ? (
        <Stack width="100%" height="100%" alignItems="center">
          <l-pinwheel
            size="100"
            stroke="3.5"
            speed="0.9"
            color="black"
          ></l-pinwheel>
        </Stack>
      ) : (
        <Stack alignItems="center" marginInline="10%">
          <Stack margin="3rem" gap="1rem">
            <div>
              <Stack direction="row" marginBlock="1rem">
                <Stack
                  width="100%"
                  justifyContent="flex-start"
                  textAlign="left"
                >
                  <h1>{eventName}</h1>

                  <h3 style={{ color: "#818181" }}>
                    {dayjs(date).tz("America/New_York").toString()}
                  </h3>
                </Stack>
                <Stack
                  width="100%"
                  direction="row"
                  justifyContent="flex-end"
                  gap="1rem"
                  color="#818181"
                >
                  <Stack direction="row" alignItems="center" gap="0.5rem">
                    <EventDetailsButton
                      startIcon={
                        isAddedToCalendar ? <DeleteIcon /> : <EventIcon />
                      }
                      onClick={
                        isAddedToCalendar ? removeFromCalendar : addToCalendar
                      }
                      style={{
                        backgroundColor: isAddedToCalendar ? "#e57373" : "",
                      }}
                    >
                      {isAddedToCalendar
                        ? "Remove from Calendar"
                        : "Add to Calendar"}
                    </EventDetailsButton>
                  </Stack>

                  <Stack direction="row" alignItems="center" gap="0.5rem">
                    <EventDetailsButton
                      startIcon={<ShareIcon />}
                      onClick={handleClickOpen}
                    >
                      Share
                    </EventDetailsButton>
                    <Dialog
                      open={open}
                      onClose={handleClose}
                      PaperProps={{
                        component: "form",
                        onSubmit: (event) => {
                          event.preventDefault(); // Prevent the default form submission action
                          displayEmail(event); // Now handle the logic to display emails or whatever your submit action is
                        },
                      }}
                    >
                      <DialogTitle>Share Link</DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          Use this link to share:
                          <Link
                            href={`http://localhost:5000/eventdetails/${eventID}`}
                          >
                            http://localhost:5000/eventdetails/{eventID}
                          </Link>
                        </DialogContentText>
                        <TextField
                          label="Email Address"
                          type="email"
                          fullWidth
                          variant="outlined"
                          onChange={changeEmail}
                          margin="normal"
                        />
                        <Button
                          onClick={handleAddEmail}
                          type="button" // Important to specify type="button" to prevent form submission
                          color="primary"
                          variant="contained"
                        >
                          Add Email
                        </Button>
                        <List>
                          {emailsList.map((email, index) => (
                            <ListItem key={index}>{email}</ListItem>
                          ))}
                        </List>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleClose}>Close</Button>
                        <Button type="submit" color="primary">
                          Share
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </Stack>
                </Stack>
              </Stack>
              <Stack>
                <img src={testImage} style={{ borderRadius: "1rem" }} />
              </Stack>
              <Stack
                alignItems="flex-start"
                gap="1rem"
                marginTop="1rem"
                direction="row"
              >
                <YellowButton
                  textAlign="left"
                  variant="contained"
                  onClick={handleSubmit}
                >
                  Join Event
                </YellowButton>
                <GrayButton
                  textAlign="Center"
                  variant="contained"
                  onClick={handleOpenRSVPDialog}
                >
                  See RSVP List
                </GrayButton>
                {/* <GrayButton
                  textAlign="Center"
                  variant="contained"
                  onClick={dummyCall}
                >
                  Dummy Call
                </GrayButton> */}
                <Dialog open={openRSVP} onClose={handleCloseRSVPDialog}>
                  <DialogTitle>RSVP List</DialogTitle>
                  <DialogContent>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        marginBottom: "20px",
                      }}
                    >
                      {[
                        "all",
                        "accepted",
                        "declined",
                        "needsaction",
                        "tentative",
                      ].map((filter) => (
                        <Button
                          key={filter}
                          // color={currentFilter === filter ? '' : 'green'}
                          onClick={() => getRSVPList(filter)}
                          style={{ margin: "0 10px" }}
                        >
                          {filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </Button>
                      ))}
                    </div>
                    <List>
                      {displayList.map((item, index) => (
                        <ListItem key={index}>
                          <ListItemText
                            primary={item.name}
                            secondary={`Status: ${item.status.charAt(0).toUpperCase() +
                              item.status.slice(1)
                              }`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </DialogContent>
                  <DialogActions>
                    <GrayButton onClick={handleCloseRSVPDialog}>
                      Close
                    </GrayButton>
                  </DialogActions>
                </Dialog>

                {sessionStorage.getItem("token") && checkIfPast() ? (
                  <Stack
                    direction="row"
                    marginInline="2rem"
                    alignItems="center"
                    justifyItems="center"
                    gap="1rem"
                  >
                    <Stack
                      direction="row"
                      // marginInline="2rem"
                      alignItems="center"
                      gap="0.5rem"
                    >
                      {/* <GrayButton variant="contained" color="primary" onClick={() => console.log('Clicked')}>Test Button</GrayButton> */}

                      <IconButton
                        onClick={() => handleRating(1)}
                        aria-label="like"
                        size="small"
                      >
                        {rating === 1 ? (
                          <ThumbUpAltIcon />
                        ) : (
                          <ThumbUpOffAltIcon />
                        )}
                      </IconButton>

                      <IconButton
                        onClick={() => handleRating(-1)}
                        aria-label="like"
                        size="small"
                      >
                        {rating === -1 ? (
                          <ThumbDownAltIcon />
                        ) : (
                          <ThumbDownOffAltIcon />
                        )}
                      </IconButton>
                    </Stack>
                    {numOfRatings > 0 ? (
                      <p>
                        {avgRating}% ({numOfRatings})
                      </p>
                    ) : (
                      <p>(Event not rated)</p>
                    )}
                    {userID == eventObject.userID ? (
                      <div>
                        <Button
                        sx={{ marginLeft: '400px', width: 'auto'}}
                        onClick={() => setVisibility("public")}
                        >
                          <VisibilityIcon className="w-auto"></VisibilityIcon>
                        </Button>
                        <Button
                        sx={{ width: 'auto'}}
                        onClick={() => setVisibility("friends")}
                        >
                          <Diversity3Icon className="w-auto"/>
                        </Button>
                        <Button
                        sx={{ width: 'auto'}}
                        onClick={() => setVisibility("private")}
                        >
                          <VisibilityOffIcon className="w-auto"/>
                        </Button>
                      </div>
                    ) : (<div />)
                    }
                  </Stack>
                ) : (
                  <div />
                )}
              </Stack>
            </div>

            <EventDetailsSection />
            <LocationSection />
            <OrganizerSection />
            <CategorySection />
            {checkOwner() &&
              (sessionStorage.getItem("token") ? <EditDelete /> : <div />)}
            <SimilarEventsSection />
          </Stack>
        </Stack>
      )}
    </div>
  );
}

export default EventDetails;
