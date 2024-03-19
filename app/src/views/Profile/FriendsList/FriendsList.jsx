import "./FriendsList.css";
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
} from "../../../components/StyledComponents/StyledComponents";

import { useNavigate } from "react-router-dom";
import SettingsIcon from "@mui/icons-material/Settings";
import NearMeIcon from "@mui/icons-material/NearMe";
import EditIcon from "@mui/icons-material/Edit";
import Navbar from "../../../components/MainNavbar/MainNavbar";
import { withAuth } from "../../withAuth";
import axios from "axios";

function FriendsList() {
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [tags, setTags] = useState([]);
  const [friendsNum, setFriendsNum] = useState(0);
  const [groupsNum, setGroupsNum] = useState(0);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/user/getusername", {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res.data["status"]);
        console.log(res.data["username"]);
        setDisplayName(res.data["username"]);
      })
      .catch((err) => {
        console.log(err);
      });

      axios
      .get("http://127.0.0.1:5000/user/getprofilepic", {
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
      .get("http://127.0.0.1:5000/user/getpreferences", {
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

  }, []);

  const LeftInfoStack = () => {
    return (
      <Stack
        width="75vh"
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
            <SettingsIcon onClick={() => navigate("/settings")} fontSize="inherit" height="2rem" width="2rem" />
          </IconButton>
        </Box>

        {/* Profile Picture */}
        <Stack>
          <Badge
            overlap="circular"
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            badgeContent={
              <IconButton
                style={{ color: "#4D4D4D", backgroundColor: "white" }}
              >
                <EditIcon />
              </IconButton>
            }
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

        {/* Location, Friends, Groups */}
        <TextIconStack>
          <NearMeIcon style={{ color: "red" }} />
          <h3>Location</h3>
        </TextIconStack>
        <Stack direction="row" gap="0.5rem"> 
            <h3 className="friendsnum"> {friendsNum} FRIENDS</h3>
            <h3> • {groupsNum} GROUPS</h3>
        </Stack>
        

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
        
      </Stack>
    );
  };

  const RightFriendsStack = () => {
    return (
      <Stack width="100%" overflow="hidden">
        <h1> test </h1>
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
        height="100%"
        direction="row"
        gap="2rem"
        justifyContent="space-between"
      >
        <LeftInfoStack />
        <RightFriendsStack />
      </Stack>
    </div>
  );
}

export default withAuth(FriendsList);
