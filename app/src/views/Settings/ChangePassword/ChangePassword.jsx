import "./ChangePassword.css"
import {Avatar, Button, Stack, IconButton, TextField} from "@mui/material/";
import SettingsIcon from "@mui/icons-material/Settings";
import MainNavbar from "../../../components/MainNavbar/MainNavbar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function ChangePassword() {   
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
    const [newPassword, setNewPassword] = useState("");
    const updateNewPassword = (event) => {
        if (event != null) {
            setNewPassword(event.target.value);
        }
    };
    const [confirmNewPassword, setconfirmNewPassword] = useState("");
    const updateConfirmNewPassword = (event) => {
        if (event != null) {
            setconfirmNewPassword(event.target.value);
        }
    };

    let resp = "";

    const saveClick = (event) => {
        if (newPassword != confirmNewPassword) {
            alert("Your passwords don't match! Please ensure they are the same.");
            return;
        }

        console.log(email + newPassword);
        event.preventDefault();

        // Send to Flask server
        fetch("http://localhost:5000/user/changepassword", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + sessionStorage.getItem("token"),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email: email, newPassword: newPassword}),
        })
        .then((response) => {
            if (response.status === 200) {
              resp = response;
              return response.json();
            } else if (response.status == 401) {
              alert("This password is too short. Please choose a different password.");
              return false;
            } else {
              alert("Unauthorized.");
              return false;
            }
          })
          .then((data) => {
            if (resp.status == 200) {
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
        
        <Stack sx={{p: 5}}>
            <Stack direction="column" spacing={5}>
                <Stack direction="row" spacing={3} borderRadius="16px" sx={{p: 5, bgcolor: '#ECECEC'}}>
                    <Avatar sx={{width: 100, height: 100}}/>
                    <Stack direction="column" justifyContent="center">
                        <h1 style={{color: "black", textAlign: "left", verticalAlign: "middle"}}>Name</h1>
                    </Stack>
                    <Stack width="100%" direction="row" justifyContent="flex-end" gap="1rem">
                        <Stack direction="column" justifyContent="center">
                            <Button className="LogoutButton2" justifyContent="center" variant="contained" color="inherit" size="large">Logout</Button>
                        </Stack>
                        <Stack direction="column" justifyContent="center">
                            <IconButton onClick={settingsClick}>
                                <SettingsIcon className="Settings" style={{fontSize: "40px", color: "black"}}/>
                            </IconButton>
                        </Stack>
                    </Stack>
                </Stack> 

                <Stack direction="column" spacing={2}>
                    <h1 style={{textAlign: "left"}}>Change Password</h1>

                    <Stack direction = "column" spacing={1}>
                        <h4 style={{textAlign: "left"}}>Email</h4>
                        <TextField onChange={updateEmail}/>

                        <h4 style={{textAlign: "left"}}>New Password</h4>
                        <TextField onChange={updateNewPassword}/>

                        <h4 style={{textAlign: "left"}}>Confirm New Password</h4>
                        <TextField onChange={updateConfirmNewPassword}/>
                    </Stack>

                    <Button className="SaveButton" onClick={saveClick} variant="contained" disableElevation sx={{textTransform: 'none', width: "200px", height: "50px"}}>
                        Save Changes
                    </Button>
                </Stack>
                
            </Stack>

        </Stack>
     </div>
  );
}

export default ChangePassword;