import "../ChangeEmail/ChangeEmail.css";
import { Avatar, Button, Stack, IconButton, TextField } from "@mui/material/";
import SettingsIcon from "@mui/icons-material/Settings";
import MainNavbar from "../../../components/MainNavbar/MainNavbar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, React } from "react";
import axios from "axios";

function ChangeEmail() {
  const navigate = useNavigate();

  const settingsClick = () => {
    navigate("/settings");
  };

  const [email, setEmail] = useState("");
  const updateEmail = (event) => {
    if (event != null) {
      setEmail(event.target.value);
    }
  };
  const [newEmail, setNewEmail] = useState("");
  const updateNewEmail = (event) => {
    if (event != null) {
      setNewEmail(event.target.value);
    }
  };
  const [confirmNewEmail, setconfirmNewEmail] = useState("");
  const updateConfirmNewEmail = (event) => {
    if (event != null) {
      setconfirmNewEmail(event.target.value);
    }
  };

  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState("");

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
      setUsername(res.data["username"]);
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
      
  }, []);

  let resp = "";

  const saveClick = (event) => {
    if (newEmail != confirmNewEmail) {
      alert("Your emails don't match! Please ensure they are the same.");
      return;
    }

    if (!/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(newEmail)) {
      alert("Your email is invalid. Enter a valid email.");
      return;
    }

    console.log(email + newEmail);
    event.preventDefault();

    // Send to Flask server
    fetch("http://127.0.0.1:5000/user/changeemail", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, newEmail: newEmail }),
    })
      .then((response) => {
        if (response.status === 200) {
          resp = response;
          return response.json();
        } else if (response.status == 401) {
          alert("That email is taken. Please choose a different email.");
          return false;
        } else {
          alert("Unauthorized.");
          return false;
        }
      })
      .then((data) => {
        if (resp.status == 200) {
          console.log(data);
          sessionStorage.setItem("token", data["access_token"]);
          navigate("/settings");
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
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
            <h1 style={{ textAlign: "left" }}>Change Email</h1>

            <Stack direction="column" spacing={1}>
              <h4 style={{ textAlign: "left" }}>Current Email</h4>
              <TextField onChange={updateEmail} />

              <h4 style={{ textAlign: "left" }}>New Email</h4>
              <TextField onChange={updateNewEmail} />

              <h4 style={{ textAlign: "left" }}>Confirm New Email</h4>
              <TextField onChange={updateConfirmNewEmail} />
            </Stack>

            <Button
              className="SaveButton"
              onClick={saveClick}
              variant="contained"
              disableElevation
              sx={{
                textTransform: "none",
                backgroundColor: "#02407F",
                width: "200px",
                height: "50px",
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

export default ChangeEmail;
