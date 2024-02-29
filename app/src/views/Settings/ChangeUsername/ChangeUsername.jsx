import "./ChangeUsername.css";
import { Avatar, Button, Stack, IconButton, TextField } from "@mui/material/";
import SettingsIcon from "@mui/icons-material/Settings";
import MainNavbar from "../../../components/MainNavbar/MainNavbar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function ChangeUsername() {
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
  const [newUsername, setnewUsername] = useState("");
  const updateNewUsername = (event) => {
    if (event != null) {
      setnewUsername(event.target.value);
    }
  };
  const [confirmNewUsername, setconfirmNewUsername] = useState("");
  const updateConfirmNewUsername = (event) => {
    if (event != null) {
      setconfirmNewUsername(event.target.value);
    }
  };

  let resp = "";

  const saveClick = (event) => {
    if (newUsername != confirmNewUsername) {
      alert("Your usernames don't match! Please ensure they are the same.");
      return;
    }

    console.log(email + newUsername);
    event.preventDefault();

    // Send to Flask server
    fetch("http://127.0.0.1:5000/user/changeusername", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, newUsername: newUsername }),
    })
      .then((response) => {
        if (response.status === 200) {
          resp = response;
          return response.json();
        } else if (response.status === 401) {
          alert("That username is taken. Please choose a different username.");
          return false;
        } else {
          alert("Unauthorized.");
          return false;
        }
      })
      .then((data) => {
        if (resp.status === 200) {
          console.log(sessionStorage.getItem("token"));
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
            <Avatar sx={{ width: 100, height: 100 }} />
            <Stack direction="column" justifyContent="center">
              <h1
                style={{
                  color: "black",
                  textAlign: "left",
                  verticalAlign: "middle",
                }}
              >
                Name
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
            <h1 style={{ textAlign: "left" }}>Change Username</h1>

            <Stack direction="column" spacing={1}>
              <h4 style={{ textAlign: "left" }}>Email</h4>
              <TextField onChange={updateEmail} />

              <h4 style={{ textAlign: "left" }}>New Username</h4>
              <TextField onChange={updateNewUsername} />

              <h4 style={{ textAlign: "left" }}>Confirm New Username</h4>
              <TextField onChange={updateConfirmNewUsername} />
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

export default ChangeUsername;
