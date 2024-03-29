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

import {  useNavigate, useParams } from "react-router-dom";
import NearMeIcon from "@mui/icons-material/NearMe";

import Navbar from "../../components/Navbar/Navbar";

import axios from "axios";

function FriendProfile() {
  const { id } = useParams();
  const [friendStatus, setFriendStatus] = useState(false)
  const navigate = useNavigate();
  const response = false;

  //console.log(friendStatus)
  const [displayName, setDisplayName] = useState(id);
  const [profilePic, setProfilePic] = useState("");
  // const [friendsNum, setFriendsNum] = useState(0);
  // const [groupsNum, setGroupsNum] = useState(0);
  const [exists, setExists] = useState(true)
  const [status, setStatus] = useState("")
  const [newStatus, setNewStatus] = useState("")
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/user/get_user", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(id),
    })
      .then((res) => {
        return res.json();
        // const data = res.json()
        // console.log(data)
        // if (data["status"] == "400") {
        //   setExists(false);
        // } else {
        //   setDisplayName(data["username"]);
        //   setFriendStatus(data["isFriend"]);
        // }
      })
      .then((data) => {
        //const data = res
        if (data["status"] == "400") {
          setExists(false);
        } else {
          setDisplayName(data["username"]);
          setFriendStatus(data["isFriend"]);
          setStatus(data["relationship"]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const handleAddFriend = () => {
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
        setFriendStatus(true)
        return res.json()
      }
    }).then((data)=> {
      setStatus(data["status"])
    });
  };
  const handleDelete = () => {
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
            setFriendStatus(false)
            setStatus("")
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
            ></Box>

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
              <h1>
                {displayName}
                {status == "" ? "" : " (" + status + ")"}
              </h1>
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
                {showForm ? (
                  <div>
                    <input id="status" onChange={changeStatus} />
                    <Button variant="contained" onClick={handleSubmit}>
                      Set
                    </Button>
                  </div>
                ) : (
                  <>
                    {status != "requested" ? (
                      <>
                        <Button variant="contained" onClick={openInput}>
                          Set status
                        </Button>
                        <Button variant="contained" onClick={handleDelete}>
                          {" "}
                          delete friend
                        </Button>
                      </>
                    ) : (
                      <h3>Requested</h3>
                    )}
                  </>
                )}
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
