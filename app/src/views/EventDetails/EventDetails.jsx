import React from "react";
import { useState } from "react";
import {
  Chip,
  Stack,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Link,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";
import ShareIcon from "@mui/icons-material/Share";
import { useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import testImage from "../../media/testImage.jpeg";
import "./EventDetails.css";
import { useParams } from "react-router-dom";
import {
  ReadMoreButton,
  YellowButton,
  RedButton,
  GrayButton,
  EventDetailsButton,
} from "../../components/StyledComponents/StyledComponents";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function EventDetails() {
  // TODO: replace hard coded names
  let id = useParams();
  console.log(id, "ididid");
  let resp = false;
  const [eventObject, setEventObject] = useState({
    eventID: "e",
    desc: "e",
    name: "e",
    location: "e",
    event_datetime: "e",
    hostName: "e",
    userID: "e",
    rating: "e",
    category: "e",
    type: "e",
  });

  useEffect(() => {
    fetch("http://127.0.0.1:5000/event/details", {
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
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, []);
  const [eventName, setEventName] = useState("Event Name");
  const [eventID, setEventId] = useState("1");
  const [date, setDate] = useState("Saturday, February 8, 2024");
  const [time, setTime] = useState("7:00pm");
  const [description, setDescription] = useState(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad"
  );
  const [location, setLocation] = useState(
    "Address Street, City, State, 47906"
  );
  const [organizer, setOrganizer] = useState("Organizer Name");
  const [tags, setTags] = useState([
    "Comedy",
    "Food",
    "Film",
    "Travel",
    "Rock",
    "Yoga",
    "DIY",
  ]);
  const [showAll, setShowAll] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

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
          return response.json();
        } else {
          alert("error");
          return false;
        }
      })
      .then(() => {})
      .catch((error) => {
        console.log("error", error);
      });
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const EventInfoSection = () => {
    return (
      <div>
        <Stack direction="row" marginBlock="1rem">
          <Stack width="100%" justifyContent="flex-start" textAlign="left">
            <h1>{eventObject.name}</h1>

            <h3 style={{ color: "#818181" }}>
              {eventObject.startTime} • {eventObject.endTime}
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
                      href={`http://localhost:3000/eventdetails/${eventObject.eventID}`}
                    >
                      http://localhost:3000/eventdetails/{eventObject.eventID}
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
        <Stack alignItems="flex-start" marginTop="1rem">
          <YellowButton
            textAlign="left"
            variant="contained"
            onClick={handleSubmit}
          >
            Join Event
          </YellowButton>
        </Stack>
      </div>
    );
  };

  const EventDetailsSection = () => {
    return (
      <Stack className="section">
        <h2>Event Details</h2>
        {eventObject.desc.length > 500 ? (
          <div>
            {showAll ? (
              <div>
                <p>{eventObject.desc}</p>
                <ReadMoreButton size="small" onClick={() => setShowAll(false)}>
                  Read Less
                </ReadMoreButton>
              </div>
            ) : (
              <div>
                <p>{eventObject.desc.substring(0, 500).concat("...")}</p>
                <ReadMoreButton size="small" onClick={() => setShowAll(true)}>
                  Read More
                </ReadMoreButton>
              </div>
            )}
          </div>
        ) : (
          eventObject.desc
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
          <h3>{eventObject.location}</h3>
        </Stack>
      </Stack>
    );
  };
  const OrganizerSection = () => {
    return (
      <Stack className="section">
        <h2>Organizer</h2>
        <Stack direction="row" alignItems="center" gap="1rem">
          <PersonIcon />
          <h3>{eventObject.hostName}</h3>
        </Stack>
      </Stack>
    );
  };

  const TagsSection = () => {
    return (
      <Stack className="section">
        <h2>Tags</h2>
        <Stack direction="row" alignItems="center" gap="1rem">
          <Stack
            direction="row"
            gap="1rem"
            justifyContent="space-start"
            flexWrap="wrap"
            width="100%"
          >
            {tags.map(
              (
                name //TODO add proper tags
              ) => (
                <div>
                  <Chip key={name} label={name} />
                </div>
              )
            )}
          </Stack>
        </Stack>
      </Stack>
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
    sessionStorage.setItem('cur_event', JSON.stringify(eventObject));
    navigate("/edit_event")
  }

  const EditDelete = () => {
    return (
      <div className="w-[100%] flex flex-row justify-center mt-8" id="EditDelete">
        <GrayButton
            textAlign="left"
            variant="contained"
            onClick={editEvent}
          >
            Edit Event
        </GrayButton>
        <RedButton textAlign="left" variant="contained" onClick={deleteEvent}>
          Delete Event
        </RedButton>
      </div>
    );
  };

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
      <Stack alignItems="center" marginInline="20%">
        <Stack margin="3rem" gap="1rem">
          <EventInfoSection />
          <EventDetailsSection />
          <LocationSection />
          <OrganizerSection />
          <TagsSection />
          {sessionStorage.getItem("token") ? <EditDelete /> : <div />}
        </Stack>
      </Stack>
    </div>
  );
}

export default EventDetails;
