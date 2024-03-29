import "./FriendProfile.css";
import { React, useState, useEffect } from "react";
import {
  Card,
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

import { useLocation, useNavigate, useParams } from "react-router-dom";
import SettingsIcon from "@mui/icons-material/Settings";
import NearMeIcon from "@mui/icons-material/NearMe";
import EditIcon from "@mui/icons-material/Edit";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import concertPhoto from "../../media/concert.jpg";
import Navbar from "../../components/Navbar/Navbar";
import { withAuth } from "../withAuth";
import axios from "axios";

function FriendProfile() {
  const { id } = useParams();
  const [friendStatus, setFriendStatus] = useState(false)
  const navigate = useNavigate();
  const response = false;

  //console.log(friendStatus)
  const [displayName, setDisplayName] = useState(id);
  const [profilePic, setProfilePic] = useState("");
  const [friendsNum, setFriendsNum] = useState(0);
  const [groupsNum, setGroupsNum] = useState(0);
  const [exists, setExists] = useState(true)
  const [status, setStatus] = useState("")
  const [newStatus, setNewStatus] = useState("")
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    axios.post("http://127.0.0.1:5000/user/get_user", {
      "email": id
    })
    .then((res) => {
      if (res.data['status'] == '400') {
        setExists(false)
      } else {
        setDisplayName(res.data['username'])
        
      }
    })
    .catch((err) => {
      console.log(err);
    });

    axios.post("http://127.0.0.1:5000/user/get_status", {
      "email": id
    }, {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      if (res.data['status'] == '200') {
        setStatus(res.data['cur_status'])
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }, []);

  const handleAddFriend = () => {
    console.log(friendStatus)
    fetch("http://127.0.0.1:5000/add_friend", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
        "Content-Type": "application/json",

        "Content-Type": "application/json",
      },
      body: JSON.stringify(id),
    }).then((res) => {
      if (res.status == 200) {
        //setLabel("Added!");
      }
    });
  };
  const handleDelete = () => {
    console.log(friendStatus)
    // eslint-disable-next-line no-restricted-globals
    if (confirm("are you sure you want to delete this friend?")) {
      console.log("here")
      fetch("http://127.0.0.1:5000/delete_friend", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
          "Content-Type": "application/json",
        }, body: JSON.stringify(id)
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            alert("error");
            return false;
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
  };

  const openInput = () => {
    setShowForm(true);
  }

  const changeStatus = (event) => {
    setNewStatus(event.target.value);
  }

  const handleSubmit = () => {
    axios.post("http://127.0.0.1:5000/user/set_status", {
      "email": id,
      "status": newStatus,
    }, {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      setStatus(res.data['new_status']);
    })
    .catch((err) => {
      console.log(err)
    })
    setShowForm(false);
  };


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

  const handleReadMore = (id) => {
    return <>//TODO: navigate to blog post</>;
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
      }}
    >
      {exists ? (
        <div>
          <Navbar />
          <Stack
            width="full"
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
            </Box>

            {/* Profile Picture */}
            <Stack>
              <Badge
                overlap="circular"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
              >
                <Avatar
                  sx={{ width: "15rem", height: "15rem" }}
                  alt={"avatar"}
                  src={profilePic}
                />
              </Badge>
              <input type="file" style={{ display: "none" }} />
            </Stack>

            {/* Display Name */}
            <TextIconStack>
              <h1>{displayName}{status == "" ? "" : " (" + status + ")"}</h1>
            </TextIconStack>

            {/* Location, Friends, Groups */}
            <TextIconStack>
              <NearMeIcon style={{ color: "red" }} />
              <h3>Location</h3>
            </TextIconStack>
            {/* <h3>
              {friendsNum} FRIENDS • {groupsNum} GROUPS
            </h3> */} 
            {friendStatus ? (
              <>
                {
                  showForm ?
                  <div>
                    <input id="status" onChange={changeStatus} />
                    <Button variant="contained" onClick={handleSubmit}>
                      Set
                    </Button>
                  </div>
                  :
                  <Button variant="contained" onClick={openInput}>
                    Set status
                  </Button>
                }
                <Button variant="contained" onClick={handleDelete}> delete friend</Button>
              </>
            ) : (
              <Button variant="contained" onClick={handleAddFriend}>
                Add Friend
              </Button>
            )}
          </Stack>
        </div>
      ) : (
        <div>User Does Not Exist</div>
      )}
    </div>
  );
}

export default FriendProfile;
