import "./ChangeLocation.css";
import {
  Avatar,
  Button,
  Stack,
  IconButton,
  OutlinedInput,
} from "@mui/material/";
import SettingsIcon from "@mui/icons-material/Settings";
import MainNavbar from "../../../components/MainNavbar/MainNavbar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, React } from "react";
import axios from "axios";
import MapAutocomplete from "react-google-autocomplete";

function ChangeLocation() {
  const navigate = useNavigate();
  const [locationInput, setLocationInput] = useState("");
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState("");

  const settingsClick = () => {
    navigate("/settings");
  };

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
        setUsername(res.data["username"]);
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
  }, []);

  const saveClick = () => {
    console.log("loc:", locationInput);
    fetch("http://localhost:5000/user/set_location", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
      body: JSON.stringify({
        location: locationInput,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        return data;
      })
      .catch((error) => {
        console.error("Error:", error);
        throw error;
      });

    navigate("/profile");
  };

  const handlePlaceSelected = (place) => {
    setLocationInput(place.formatted_address);
  };

  return (
    <div>
      <MainNavbar />

      <Stack sx={{ p: 5 }}>
        <Stack direction="column" spacing={5}>
          <Stack
            direction="row"
            spacing={3}
            borderRadius="16px"
            sx={{ p: 5, bgcolor: "#ECECEC" }}
          >
            <Avatar src={profilePic} sx={{ width: 100, height: 100 }} />
            <Stack direction="column" justifyContent="center">
              <h1
                style={{
                  color: "black",
                  textAlign: "left",
                  verticalAlign: "middle",
                }}
              >
                {username}
              </h1>
            </Stack>
            <Stack
              width="100%"
              direction="row"
              justifyContent="flex-end"
              gap="1rem"
            >
              <Stack direction="column" justifyContent="center">
                <Button
                  className="LogoutButton2"
                  justifyContent="center"
                  variant="contained"
                  sx={{ backgroundColor: "#02407F" }}
                  size="large"
                >
                  Logout
                </Button>
              </Stack>
              <Stack direction="column" justifyContent="center">
                <IconButton onClick={settingsClick}>
                  <SettingsIcon
                    className="Settings"
                    style={{ fontSize: "40px", color: "black" }}
                  />
                </IconButton>
              </Stack>
            </Stack>
          </Stack>

          <Stack direction="column" spacing={2}>
            <h1 style={{ textAlign: "left" }}>Change Location</h1>

            <Stack direction="column" spacing={1}>
              <OutlinedInput
                className="w-[80%] bg-white h-[45px] rounded-md align-left"
                color="secondary"
                inputComponent={({ inputRef, onFocus, onBlur, ...props }) => (
                  <MapAutocomplete
                    apiKey="AIzaSyBMp7w0sRedU-xNT_Z5DGFCYPFkHa-QTMg"
                    {...props}
                    defaultValue={locationInput}
                    onPlaceSelected={handlePlaceSelected}
                  />
                )}
              />
            </Stack>

            <Button
              className="SaveButton"
              onClick={saveClick}
              variant="contained"
              disableElevation
              sx={{
                textTransform: "none",
                width: "200px",
                height: "50px",
                backgroundColor: "#02407F",
              }}
            >
              Save Changes
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </div>
  );
}

export default ChangeLocation;
