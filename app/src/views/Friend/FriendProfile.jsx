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
  const [exists, setExists] = useState(true);
  const [status, setStatus] = useState("Friend");

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
        return res.json()
        // const data = res.json()
        // console.log(data)
        // if (data["status"] == "400") {
        //   setExists(false);
        // } else {
        //   setDisplayName(data["username"]);
        //   setFriendStatus(data["isFriend"]);
        // }
      }).then((data)=>{
        //const data = res
        if (data["status"] == "400") {
          setExists(false);
        } else {
          setDisplayName(data["username"]);
          setFriendStatus(data["isFriend"]);
          setStatus(data["relationship"])
          
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

  const handleSetStatus = () => {

  }
  
 

 

  const LeftInfoStack = () => {
    return (
      <Stack
        width="50vh"
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
            {displayName} {friendStatus ? <div>{status}</div> : <div></div>}
          </h1>
        </TextIconStack>

        {/* Location, Friends, Groups */}
        <TextIconStack>
          <NearMeIcon style={{ color: "red" }} />
          <h3>Location</h3>
        </TextIconStack>
        <h3>
          {friendsNum} FRIENDS • {groupsNum} GROUPS
        </h3>

        {friendStatus ? (
          <>
            <Button variant="contained" onClick={handleSetStatus}>
              Set status
            </Button>
            <Button variant="contained" onClick={handleDelete}> delete friend</Button>
          </>
        ) : (
          <Button variant="contained" onClick={handleAddFriend}>
            Add Friend
          </Button>
        )}
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
      {exists ? (
        <div>
          <Navbar />
          <Stack
            width="100vw"
            direction="row"
            gap="2rem"
            justifyContent="space-between"
          >
            <LeftInfoStack />
            {/* <RightEventStack /> */}
          </Stack>
        </div>
      ) : (
        <div>User Does Not Exist</div>
      )}
    </div>
  );
}

export default (FriendProfile);
