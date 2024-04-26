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
  BlueCard,
  ReadMoreButton,
  TextIconStack,
} from "../../components/StyledComponents/StyledComponents";
import dayjs from "dayjs";
import Blog from "../../components/Blog/Blog";

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
  const [location, setLocation] = useState("");
  const [tags, setTags] = useState([]);

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    console.log(sessionStorage.getItem("token"));

    getUsername();
    getProfilePic();
    getPreferences();
    getUserEvents();
    getHostRating();
    getUserLocation();
    getBlogs();
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
    setPastEvents(past);
    setUpcomingEvents(upcoming);
  }, [userEvents]);

  const getUsername = () => {
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
  };

  const getProfilePic = () => {
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
  };

  const getPreferences = () => {
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
  };

  const getUserEvents = () => {
    axios
      .get("http://localhost:5000/user_events", {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log("response:", res);
        console.log("userEvents:", res.data["events"]);
        setUserEvents(res.data["events"]);
      });
  };

  const getHostRating = () => {
    axios
      .get("http://localhost:5000/user/get_host_rating", {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setHostRating(res.data.hostRating);
      });
  };

  const getUserLocation = () => {
    // setLoading(true);
    fetch("http://localhost:5000/user/get_location", {
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
        console.log("location:", data.location);
        if (data.location) {
          setLocation(data.location);
        }
        // setLoading(false);
      })
      .catch((error) => {
        console.log("error", error);
        // setLoading(false);
      });
  };

  const getBlogs = () => {
    axios
      .get("http://localhost:5000/blogs/get_user_blogs", {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log("response:", res);
        console.log("blog:", res.data["blogs"]);
        setBlogs(res.data["blogs"]);
      });
  };
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
  const handleBlogs = () => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("are you sure you want to delete all blog history?")) {
      fetch("http://localhost:5000/blog/delete_history", {
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
        </TextIconStack>

        {hostRating && (
          <TextIconStack>
            <ThumbUpIcon />
            <h3>{hostRating}%</h3>
          </TextIconStack>
        )}

        {/* Location, Friends, Groups */}
        {location && (
          <TextIconStack>
            <NearMeIcon style={{ color: "red" }} />
            <h3>{location}</h3>
          </TextIconStack>
        )}
        <h3>
          <a href="/profile/friends">{friendsNum} FRIENDS</a> 
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
        <Button variant="contained" onClick={() => navigate("/creategroups")}>
          Create Group
        </Button>
        <Button variant="contained" onClick={handleBlogs}>
          Delete blog history
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
    console.log("events:", upcomingEvents);
    return (
      <Stack className="profile-components">
        <h2>Upcoming Events</h2>
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
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event, i) => {
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
              })
            ) : (
              <h3>No upcoming events</h3>
            )}
          </Stack>
        </Box>
      </Stack>
    );
  };

  const PastEvents = () => {
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
            {pastEvents.length > 0 ? (
              pastEvents.map((event, i) => {
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
              })
            ) : (
              <h3>No past events</h3>
            )}
          </Stack>
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
            {blogs.length > 0 ? (
              blogs.map((blog) => (
                <Blog
                  key={blog.blogID}
                  blogID={blog.blogID}
                  title={blog.title}
                  text={blog.text}
                  authorID={blog.authorID}
                  authorName={blog.authorName}
                  date={blog.date}
                  visibility={blog.visibility}
                  pictures={blog.pictures}
                />
              ))
            ) : (
              <h3>No blogs</h3>
            )}
          </Stack>
        </Box>
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
