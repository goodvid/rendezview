import { Avatar, Button, Stack, IconButton, Badge } from "@mui/material/";
import SettingsIcon from "@mui/icons-material/Settings";
import EditIcon from "@mui/icons-material/Edit";
import MainNavbar from "../../../components/MainNavbar/MainNavbar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, React } from "react";
import axios from "axios";

function ChangeProfilePicture() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [displayPic, setDisplayPic] = useState();
  const [profPic, setProfPic] = useState(null);
  const handleProfPicChange = (event) => {
    if (event) {
      const file = event.target.files[0];
      var pattern = /image-*/;

      if (!file.type.match(pattern)) {
        alert("Please choose an image file.");
        return;
      }

      setDisplayPic(URL.createObjectURL(event.target.files[0]));
      setProfPic(event.target.files[0]);
    }
  }


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

  const settingsClick = () => {
    navigate("/settings");
  };

  let resp = "";

  const saveClick = (event) => {
    event.preventDefault();

    let formData = new FormData();
    if (profPic) {
      formData.append('profilePicture', profPic);
    } else {
      return;
    }

    // Send to Flask server
    fetch("http://127.0.0.1:5000/user/changeprofilepic", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
      body: formData,
    })
    .then((response) => {
      if (response.status === 200) {
        resp = response;
        return response.json();
      } else {
        alert("Unauthorized.");
        return false;
      }
    })
    .then((data) => {
      if (resp.status === 200) {
        console.log(sessionStorage.getItem("token"));
        window.location.reload();
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

          <Stack alignItems={"center"}>
            <h1 style={{ textAlign: "left" }}>Change Profile Picture</h1>
              <div className='mt-4 w-[300px]'>
                <Stack>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    badgeContent={
                      <label htmlFor="icon-button-file">
                        <IconButton aria-label="upload picture" style={{background: 'white'}} component="span">
                          <EditIcon />
                        </IconButton>
                      </label>
                    }
                  >
                    <Avatar
                      sx={{ width: "250px", height: "250px" }}
                      alt={"avatar"}
                      src={displayPic}
                    />
                  </Badge>
                  <input accept="image/*" id="icon-button-file" type="file" style={{ display: 'none'}} onChange={handleProfPicChange} />
                </Stack>
              </div>

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
                  mt: 8
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

export default ChangeProfilePicture;
