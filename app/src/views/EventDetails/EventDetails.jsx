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
import { pinwheel } from "ldrs";

function EventDetails() {
  // TODO: replace hard coded names
  pinwheel.register(); // Set loading animation
  let id = useParams();
  let resp = false;
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

  useEffect(() => {
    setLoading(true);
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
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, []);
  const [eventName, setEventName] = useState("");
  const [eventID, setEventId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [organizer, setOrganizer] = useState("");
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
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    // Send data to Flask server
    fetch("http://127.0.0.1:5000/profile/join-event", {
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
      .then(() => {})
      .catch((error) => {
        console.log("error", error);
        setLoading(false);
      });
  };

  const getYelpBusinessName = (businessID) => {
    setLoading(true);

    const params = new URLSearchParams({ businessID: businessID });
    axios
      .get(`http://127.0.0.1:5000/events/business?${params}`)
      .then((response) => {
        console.log("Business fetched: ", response.data);
        console.log("name:", response.data.business.name);
        setOrganizer(response.data.business.name);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching business name:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    console.log(eventObject);
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

    setTags(eventObject.category);
  }, [eventObject]);

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
      .post("http://127.0.0.1:5000/delete_event", {
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
        <GrayButton textAlign="left" variant="contained" onClick={editEvent}>
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
        <Stack alignItems="center" marginInline="20%">
          <Stack margin="3rem" gap="1rem">
            <EventInfoSection />
            <EventDetailsSection />
            <LocationSection />
            <OrganizerSection />
            {/* <TagsSection /> */}
            {sessionStorage.getItem("token") ? <EditDelete /> : <div />}
          </Stack>
        </Stack>
      )}
    </div>
  );
}

export default EventDetails;
