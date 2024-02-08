import React from "react";
import { useState, useCallback } from "react";
import { Alert, Box, Button, Chip, Stack, Snackbar } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import Navbar from "../components/Navbar/Navbar";
import testImage from "../media/testImage.jpeg";

function EventDetails() {
  const [eventName, setEventName] = useState("Event Name");
  const [date, setDate] = useState("Saturday, February 8, 2024");
  const [time, setTime] = useState("7:00pm");
  const [description, setDescription] = useState(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad "
  );
  const [location, setLocation] = useState("Location Name");
  const [organizer, setOrganizer] = useState("Organizer");
  const [tags, setTags] = useState([
    "Comedy",
    "Food",
    "Film",
    "Travel",
    "Rock",
    "Yoga",
    "DIY",
  ]);

  function tagBubbles() {
    return (
      <Box>
        <Stack
          direction="row"
          gap="1rem"
          justifyContent="space-start"
          flexWrap="wrap"
          width="100%"
        >
          {tags.map((name) => (
            <div>
              <Chip key={name} label={name} />
            </div>
          ))}
        </Stack>
      </Box>
    );
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
      <Stack alignItems="center">
        <Stack margin="3rem" gap="1rem">
          <Stack justifyContent="flex-start" textAlign="left">
            <h1>{eventName}</h1>
            <h3 style={{ color: "#818181" }}>
              {date} • {time}
            </h3>
          </Stack>
          {/* <Stack justifyContent="flex-end" textAlign="left">
            <h1>{eventName}</h1>
            <h3 style={{ color: "#818181" }}>
              {date} • {time}
            </h3>
          </Stack> */}
          <Stack>
            <img src={testImage} />
          </Stack>

          <Stack justifyContent="flex-start" textAlign="left">
            <h2>Event Details</h2>
            <p>{description}</p>
          </Stack>

          <Stack justifyContent="flex-start" textAlign="left">
            <h2>Location</h2>
          </Stack>

          <Stack>
            <tagBubbles />
          </Stack>
        </Stack>
      </Stack>
    </div>
  );
}

export default EventDetails;
