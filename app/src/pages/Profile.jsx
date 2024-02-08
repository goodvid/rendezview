import React from "react";
import "./styles.css";
import { useState } from "react";
import { Card, Avatar, Box, Chip, Stack, Rating } from "@mui/material";
import { YellowCard, BlueCard } from "../components/StyledComponents";

import SettingsIcon from "@mui/icons-material/Settings";
import NearMeIcon from "@mui/icons-material/NearMe";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import concertPhoto from "../media/concert.jpg";

function Profile() {
  const [friendsNum, setFriendsNum] = useState(0);
  const [groupsNum, setGroupsNum] = useState(0);

  // Dummy data; replace with actual database data
  const [upcomingEvents, setUpcomingEvents] = useState([
    {
      id: 1,
      name: "Event 1",
      categories: ["category1", "category2", "category3"],
      location: "location 1",
      date: "xx/xx/20xx",
      picture: concertPhoto,
    },
    {
      id: 2,
      name: "Event 2",
      categories: ["category1", "category2", "category3"],
      location: "location  2",
      date: "xx/xx/20xx",
      picture: null,
    },
    {
      id: 3,
      name: "Event 3",
      categories: ["category1", "category2", "category3"],
      location: "location  3",
      date: "xx/xx/20xx",
      picture: concertPhoto,
    },
  ]);
  const [pastEvents, setPastEvents] = useState([
    {
      id: 1,
      name: "Event 1",
      location: "location 1",
      date: "xx/xx/20xx",
      stars: 5,
      picture: null,
    },
    {
      id: 2,
      name: "Event 2",
      location: "location  2",
      date: "xx/xx/20xx",
      stars: 3,
      picture: "url",
    },
    {
      id: 3,
      name: "Event 3",
      location: "location  3",
      date: "xx/xx/20xx",
      stars: 4,
      picture: "url",
    },
  ]);
  const [blogs, setBlogs] = useState([
    {
      id: 1,
      name: "Event 1",
      location: "location  2",
      date: "xx/xx/20xx",
      contents:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      pictures: null,
    },
    {
      id: 2,
      name: "Event 2",
      date: "xx/xx/20xx",
      contents:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      pictures: [concertPhoto, concertPhoto],
    },
    {
      id: 3,
      name: "Event 3",
      location: "location  3",
      date: "xx/xx/20xx",
      contents:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.",
      pictures: [concertPhoto],
    },
  ]);

  const LeftInfoStack = () => {
    return (
      <Stack
        width="50vh"
        // height="100vh"
        style={{ backgroundColor: "#171B26", color: "white" }}
        alignItems={"center"}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
          }}
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

  const RightEventStack = () => {
    return (
      <Stack width="100vw" overflow="hidden">
        <UpcomingEvents />
        <PastEvents />
        <Blogs />
      </Stack>
    );
  };

  const UpcomingEvents = () => {
    return (
      <Stack className="profile-components">
        <h2>Upcoming Events</h2>
        <Box sx={{ overflowX: "auto", width: "100%" }}>
          <Stack direction="row" gap={2} sx={{ minWidth: "max-content" }}>
            {upcomingEvents.map((event) => (
              <UpcomingEventCard
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

  const UpcomingEventCard = ({
    id,
    name,
    categories,
    location,
    date,
    picture,
  }) => {
    return (
      <>
        <YellowCard variant="outlined">
          <Stack
            padding="1rem"
            direction="row"
            style={{ width: "100%", maxWidth: "30rem" }}
            height="13rem"
          >
            <Stack>
              {picture ? (
                <Avatar
                  src={picture}
                  variant="square"
                  sx={{ width: "100%", height: "100%" }}
                />
              ) : (
                <Avatar
                  src={picture}
                  sx={{ width: "100%", height: "100%" }}
                  variant="square"
                >
                  <LocalActivityIcon sx={{ width: "100%", height: "100%" }} />
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
        </YellowCard>
      </>
    );
  };

  const PastEvents = () => {
    return (
      <Stack className="profile-components">
        <h2>Past Events</h2>
        <Box sx={{ overflowX: "auto", width: "100%" }}>
          <Stack direction="row" gap={2} sx={{ minWidth: "max-content" }}>
            {pastEvents.map((event) => (
              <PastEventCard
                key={event.id}
                id={event.id}
                name={event.name}
                stars={event.stars}
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

  const PastEventCard = ({ id, name, stars, location, date, picture }) => {
    return (
      <>
        <YellowCard variant="outlined">
          <Stack
            padding="1rem"
            direction="row"
            style={{ width: "100%", maxWidth: "30rem" }}
          >
            <Stack alignItems="flex-start" marginInline="1rem" width="100%">
              <h2>{name}</h2>
              <Stack direction="row" alignItems="center" gap="0.3rem">
                <LocationOnIcon />
                <p style={{ margin: "0px" }}>{location}</p>
              </Stack>
              <p>{date}</p>
              <Rating value={stars} readOnly />
            </Stack>
            <Stack>
              {picture ? (
                <Avatar
                  src={picture}
                  variant="square"
                  sx={{ width: "100%", height: "100%" }}
                />
              ) : (
                <Avatar
                  src={picture}
                  sx={{ width: "100%", height: "100%" }}
                  variant="square"
                >
                  <LocalActivityIcon sx={{ width: "100%", height: "100%" }} />
                </Avatar>
              )}
            </Stack>
          </Stack>
        </YellowCard>
      </>
    );
  };

  const Blogs = () => {
    return (
      <Stack className="profile-components">
        <h2>Blogs</h2>
        <Box sx={{ overflowX: "auto", width: "100%" }}>
          <Stack
            direction="row"
            gap={2}
            sx={{ width: "max-content", height: "100%" }}
          >
            {blogs.map((event) => (
              <BlogCard
                key={event.id}
                id={event.id}
                name={event.name}
                date={event.date}
                contents={event.contents}
                pictures={event.pictures}
              />
            ))}
          </Stack>
        </Box>
      </Stack>
    );
  };

  const BlogCard = ({ id, name, contents, date, pictures }) => {
    return (
      <>
        <BlueCard variant="outlined">
          <Stack alignItems="flex-end" marginInline="1rem">
            <p>{date}</p>
          </Stack>
          <Stack
            padding="1rem"
            direction="row"
            style={{ width: "100%", maxWidth: "30rem" }}
          >
            <Stack
              alignItems="flex-start"
              marginInline="1rem"
              width="100%"
              textAlign="left"
            >
              <h2>{name}</h2>
              <p>{contents}</p>
            </Stack>
            {pictures ? (
              <Stack
                direction="row"
                gap="1rem"
                justifyContent="space-start"
                flexWrap="wrap"
                width="fit-content"
                height="100%"
              >
                {pictures.map((pic, index) => (
                  <img src={pic} width="50%" key={index} />
                ))}
              </Stack>
            ) : (
              <div width="0px"></div>
            )}
          </Stack>
        </BlueCard>
      </>
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
        // height="100vh"
        width="100vw"
        direction="row"
        gap="2rem"
        justifyContent="space-between"
      >
        <LeftInfoStack />
        <RightEventStack />
      </Stack>
    </div>
  );
}

export default Profile;
