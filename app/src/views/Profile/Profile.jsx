import "./Profile.css";
import { React, useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Box,
  Chip,
  Stack,
  Rating,
  IconButton,
  Badge,
} from "@mui/material";
import {
  YellowCard,
  BlueCard,
  ReadMoreButton,
  TextIconStack,
  EditIconButton,
} from "../../components/StyledComponents/StyledComponents";
import dayjs from "dayjs";

import { useNavigate } from "react-router-dom";
import SettingsIcon from "@mui/icons-material/Settings";
import NearMeIcon from "@mui/icons-material/NearMe";
import EditIcon from "@mui/icons-material/Edit";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import concertPhoto from "../../media/concert.jpg";
import Navbar from "../../components/Navbar/Navbar";
//import { withAuth } from "../withAuth";
import ProfileEvent from "../../components/Event/ProfileEvent";
import axios from "axios";

function Profile() {
  const navigate = useNavigate();
  const response = false;

  const [displayName, setDisplayName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [friendsNum, setFriendsNum] = useState(0);
  const [groupsNum, setGroupsNum] = useState(0);
  const [userEvents, setUserEvents] = useState([]);
  const [hostRating, setHostRating] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/user/getusername", {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res.data["status"]);
        console.log(res.data["username"]);
        setDisplayName(res.data["username"]);
        setFriendsNum(res.data["friends"]);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get("http://localhost:5000/user/getprofilepic", {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res.data["status"]);
        setProfilePic(res.data["profilePic"]);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get("http://localhost:5000/user/getpreferences", {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res.data["status"]);
        const preferences = res.data["preferences"];
        setTags(preferences.split(","));
      })
      .catch((err) => {
        console.log(err);
      });

    console.log(sessionStorage.getItem("token"));
    axios
      .get("http://localhost:5000/user_events", {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log("userEvents:", res.data["events"]);
        setUserEvents(res.data["events"]);
      });

    getHostRating();
  }, []);

  useEffect(() => {
    console.log(userEvents);
    const upcoming = [];
    const past = [];
    userEvents.map((event) => {
      const eventDate = dayjs(event.date);
      const diff = dayjs().diff(eventDate);
      if (diff < 0) {
        upcoming.push(event);
      } else {
        past.push(event);
      }
    });
    // console.log("pastEvents:", past);
    setPastEvents(past);
    setUpcomingEvents(upcoming);
  }, [userEvents]);

  const getHostRating = () => {
    axios
      .get("http://localhost:5000/user/get_host_rating", {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log("hostRating object:", res.data);
        // console.log("hostRating:", res.data.hostRating);
        setHostRating(res.data.hostRating);
      });
  };

  const [tags, setTags] = useState([]);

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
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

  const handleSubmit = () => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("are you sure you want to delete all data?")) {
      fetch("http://localhost:5000/profile/clearhistory", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            alert("error");
            return false;
          }
        })
        .then((data) => {})
        .catch((error) => {
          console.log("error", error);
        });
    }
  };

  const handleReadMore = (id) => {
    return <>//TODO: navigate to blog post</>;
  };

  const LeftInfoStack = () => {
    return (
      <Stack
        width="50vh"
        height="100vh"
        style={{
          backgroundColor: "#4D4D4D",
          color: "white",
          padding: "1rem",
        }}
        alignItems={"center"}
        gap="1rem"
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <IconButton
            sx={{ color: "white", height: "2rem", width: "2rem" }}
            aria-label="edit display name"
            size="large"
          >
            <SettingsIcon
              onClick={() => navigate("/settings")}
              fontSize="inherit"
              height="2rem"
              width="2rem"
            />
          </IconButton>
        </Box>

        {/* Profile Picture */}
        <Stack>
          <Avatar sx={{ width: "15rem", height: "15rem" }} src={profilePic} />
        </Stack>

        {/* Display Name */}
        <TextIconStack>
          <h1>{displayName}</h1>
          {/* 
          <IconButton
            sx={{ color: "white" }}
            aria-label="edit display name"
            size="large"
          >
            <EditIcon fontSize="inherit" />
          </IconButton> 
          */}
        </TextIconStack>

        <TextIconStack>
          <ThumbUpIcon />
          {hostRating ? <h3>{hostRating}%</h3> : <h3>No Rating</h3>}
        </TextIconStack>

        {/* Location, Friends, Groups */}
        <TextIconStack>
          <NearMeIcon style={{ color: "red" }} />
          <h3>Location</h3>
        </TextIconStack>
        <h3>
          <a href="/profile/friends">{friendsNum} FRIENDS</a> • {groupsNum}{" "}
          GROUPS
        </h3>

        {/* User Tags */}
        <Stack
          direction="row"
          gap="0.5rem"
          justifyContent="center"
          flexWrap="wrap"
          width="100%"
          marginTop="1.5rem"
        >
          {tags.map((name) => (
            <div>
              <Chip
                key={name}
                label={name}
                sx={{ backgroundColor: "#5AB9F3", color: "white" }}
              />
            </div>
          ))}
        </Stack>
        <Button variant="contained" onClick={handleSubmit}>
          delete past events
        </Button>
        <Button variant="contained" onClick={() => navigate("/newevent")}>
          Create event
        </Button>
        <Button variant="contained" onClick={() => navigate("/addfriends")}>
          Add friend
        </Button>
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
    console.log("upcoming events:", upcomingEvents);
    return (
      <Stack className="profile-components">
        <h2>Upcoming Events</h2>
        {/* <Box
          sx={{
            overflowX: "auto",
            width: "100%",
          }}
        >
          {upcomingEvents.length != 0 ? (
            <Stack
              direction="row"
              gap={2}
              sx={{ minWidth: "max-content", marginBlock: "0.5rem" }}
            >
              {upcomingEvents.map((event, i) => {
                return (
                  <ProfileEvent
                    name={event.name}
                    date={event.date}
                    location={event.location}
                    key={i}
                    id={event.id}
                    desc={event.desc}
                  />
                );
              })}
            </Stack>
          ) : (
            <Stack
              marginInline="2rem"
              marginBlock="0px"
              textAlign="left"
              width="100%"
              height="100%"
            >
              <h3>No upcoming events</h3>
            </Stack>
          )} */}
        <Box
          sx={{
            overflowX: "auto",
            "&::-webkit-scrollbar": { width: "0.4em" },
            width: "100%",
          }}
        >
          <Stack
            direction="row"
            gap={2}
            sx={{ minWidth: "max-content", marginBlock: "0.5rem" }}
          >
            {/* {upcomingEvents.map((event, i) => {
              return (
                <ProfileEvent
                  name={event.name}
                  date={event.date}
                  location={event.location}
                  key={i}
                  id={event.id}
                  desc={event.desc}
                />
              );
            })} */}
            {upcomingEvents.length != 0 ? (
              <Stack
                direction="row"
                gap={2}
                sx={{ minWidth: "max-content", marginBlock: "0.5rem" }}
              >
                {upcomingEvents.map((event, i) => {
                  return (
                    <ProfileEvent
                      name={event.name}
                      date={event.date}
                      location={event.location}
                      key={i}
                      id={event.id}
                      desc={event.desc}
                    />
                  );
                })}
              </Stack>
            ) : (
              <Stack
                marginInline="2rem"
                marginBlock="0px"
                textAlign="left"
                width="100%"
                height="100%"
              >
                <h3>No upcoming events</h3>
              </Stack>
            )}
          </Stack>
        </Box>
      </Stack>
    );
  };

  const PastEvents = () => {
    console.log("PastEvents:", pastEvents);
    return (
      <Stack className="profile-components">
        <h2>Past Events</h2>
        <Box
          sx={{
            overflowX: "auto",
            "&::-webkit-scrollbar": { width: "0.4em" },
            width: "100%",
          }}
        >
          {/* <Stack direction="row" gap={2} sx={{ minWidth: "max-content" }}> */}
          {pastEvents.length != 0 ? (
            <Stack
              direction="row"
              gap={2}
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "stretch",
                minWidth: "max-content",
              }}
            >
              {pastEvents.map((event, i) => {
                return (
                  <ProfileEvent
                    name={event.name}
                    date={event.date}
                    location={event.location}
                    key={i}
                    id={event.id}
                    desc={event.desc}
                    rating={event.rating}
                  />
                );
              })}
            </Stack>
          ) : (
            <Stack
              marginInline="2rem"
              marginBlock="0px"
              textAlign="left"
              width="100%"
              height="100%"
            >
              <h3>No past events</h3>
            </Stack>
          )}
        </Box>
      </Stack>
    );
  };

  const Blogs = () => {
    return (
      <Stack className="profile-components">
        <h2>Blogs</h2>
        <Box
          sx={{
            overflowX: "auto",
            "&::-webkit-scrollbar": { width: "0.4em" },
            width: "100%",
          }}
        >
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
    const readMoreLimit = 200;
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
              {contents.length < readMoreLimit ? (
                <div>
                  <p>{contents}</p>
                </div>
              ) : (
                <div>
                  <p>{contents.substring(0, readMoreLimit).concat("...")}</p>
                  <ReadMoreButton
                    size="small"
                    onClick={() => handleReadMore(id)}
                  >
                    Read More
                  </ReadMoreButton>
                </div>
              )}
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
        height: "100vh",
      }}
    >
      <Navbar />
      <Stack
        width="100%"
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
