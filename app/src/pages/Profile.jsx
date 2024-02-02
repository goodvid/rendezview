import React from "react";
import { useState } from "react";
import { Card, Avatar, Box, Chip, Stack } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import NearMeIcon from "@mui/icons-material/NearMe";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import LocationOnIcon from "@mui/icons-material/LocationOn";

function Profile() {
  const [friendsNum, setFriendsNum] = useState(0);
  const [groupsNum, setGroupsNum] = useState(0);
  const [events, setEvents] = useState([
    {
      id: 1,
      name: "Event 1",
      categories: ["category1", "category2", "category3"],
      location: "location 1",
      date: "xx/xx/20xx",
      picture: null,
    },
    {
      id: 2,
      name: "Event 2",
      categories: ["category1", "category2", "category3"],
      location: "location  2",
      date: "xx/xx/20xx",
      picture: "url",
    },
    {
      id: 3,
      name: "Event 3",
      categories: ["category1", "category2", "category3"],
      location: "location  3",
      date: "xx/xx/20xx",
      picture: "url",
    },
  ]);

  const InfoStack = () => {
    return (
      <Stack
        width="50vh"
        style={{ backgroundColor: "#171B26", color: "white" }}
        alignItems={"center"}
        padding="2rem"
      >
        <Box
          sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}
        >
          <SettingsIcon style={{ height: "2rem", width: "2rem" }} />
        </Box>
        <Avatar sx={{ width: "15rem", height: "15rem" }} />
        <h1>Display Name</h1>
        <Stack direction="row" alignItems="center" gap="1rem">
          <NearMeIcon style={{ color: "red" }} />
          <h3>Location</h3>
        </Stack>
        <h3>
          {friendsNum} FRIENDS • {groupsNum} GROUPS
        </h3>
      </Stack>
    );
  };

  const EventCard = ({ id, name, categories, location, date, picture }) => {
    return (
      <>
        <Card variant="outlined">
          <Stack padding="1rem" direction="row">
            <Stack>
              {picture ? (
                <Avatar
                  src={picture}
                  variant="square"
                  sx={{ width: 100, height: 100 }}
                />
              ) : (
                <Avatar
                  src={picture}
                  sx={{ width: 100, height: 100 }}
                  variant="square"
                >
                  <LocalActivityIcon />
                </Avatar>
              )}
            </Stack>
            <Stack alignItems="flex-start" marginInline="1rem">
              <h2>{name}</h2>
              <Stack
                direction="row"
                gap="1rem"
                justifyContent="space-start"
                flexWrap="wrap"
                width="100%"
              >
                {categories.map((category) => (
                  <Chip key={category} label={category} />
                ))}
              </Stack>
              <Stack direction="row" alignItems="center" gap="0.3rem">
                <LocationOnIcon />
                <p>{location}</p>
              </Stack>
              <p>{date}</p>
            </Stack>
          </Stack>
        </Card>
      </>
    );
  };

  const UpcomingEvents = () => {
    return (
      <Stack alignItems="flex-start">
        <h2>Upcoming Events</h2>
        <Box sx={{ overflowX: "auto", width: "100%" }}>
          <Stack direction="row" gap={2} sx={{ minWidth: "max-content" }}>
            {events.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                name={event.name}
                categories={event.categories}
                location={event.location}
                date={event.date}
                picture={event.picture}
              />
            ))}
          </Stack>
        </Box>
      </Stack>
    );
  };

  const EventStack = () => {
    return (
      <Stack width="100vh">
        {/* <h1>Event Stack</h1> */}
        <UpcomingEvents />
      </Stack>
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
      <Stack
        height="100%"
        direction="row"
        gap="2rem"
        justifyContent="space-between"
      >
        <InfoStack />
        <EventStack />
      </Stack>
    </div>
  );
}

export default Profile;
