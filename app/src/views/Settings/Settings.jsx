import * as React from 'react';
import "./Settings.css";
import {Avatar, Button, Stack, IconButton} from "@mui/material/";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseIcon from '@mui/icons-material/Close';
import MainNavbar from "../../components/MainNavbar/MainNavbar";
import { useNavigate } from "react-router-dom";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

function Settings() {   
    const navigate = useNavigate();
    
    const changeUsernameClick = () => {
        navigate("/changeusername");
    };

    const changeEmailClick = () => {
        navigate("/changeemail");
    };

    const changePasswordClick = () => {
        navigate("/changepassword");
    };

    // Delete Account
    const [deleteOpen, setDeleteOpen] = React.useState(false);

    const handleDeleteOpen = () => {
        setDeleteOpen(true);
    };

    const handleDeleteClose = () => {
        setDeleteOpen(false);
    };

    let resp = "";

    const deleteAccountClick = (event) => {
        event.preventDefault();

        // Send to Flask server
        fetch("http://localhost:5000/user/deleteaccount", {
            method: "GET",
            headers: {
                Authorization: "Bearer " + sessionStorage.getItem("token"),
                "Content-Type": "application/json",
            },
        })
        .then((response) => {
            if (response.status === 200) {
              resp = response;
              return response.json();
            } else {
              alert("Error.");
              return false;
            }
          })
          .then((data) => {
            if (resp.status == 200) {
              console.log(sessionStorage.getItem("token"));
              handleDeleteClose();
              logout();
            }
          })
          .catch((error) => {
            console.log("error", error);
          });
    };

    const logout = () => {
        sessionStorage.removeItem("token");
        console.log('removed');
        navigate("/");
    }

    let username = "Name"
    
  return (
    <div>
        <MainNavbar />
        
        <Stack sx={{p: 5}}>
            <Stack direction="column" spacing={5}>
                <Stack direction="row" spacing={3} borderRadius="16px" sx={{p: 5, bgcolor: '#171B26'}}>
                    <Avatar sx={{width: 100, height: 100}}/>
                    <Stack direction="column" justifyContent="center">
                        <h1 style={{color: "white", textAlign: "left", verticalAlign: "middle"}}> {username} </h1>
                    </Stack>
                    <Stack width="100%" direction="row" justifyContent="flex-end" gap="1rem">
                        <Stack direction="column" justifyContent="center">
                            <Button justifyContent="center" variant="contained" color="inherit" size="large" 
                                onClick={logout}
                                sx={{backgroundColor: "#FFEBC4", color: "black"}}>
                                    Logout
                            </Button>
                        </Stack>
                        <Stack direction="column" justifyContent="center">
                            <SettingsIcon style={{fontSize: "40px", color: "white"}}/>
                        </Stack>
                    </Stack>
                </Stack> 

                <Stack direction="column" spacing={1}>
                    <h1 style={{textAlign: "left"}}>Modify Profile</h1>
                    <Stack direction = "row" spacing={2}>
                        <Button variant="contained" 
                            disableElevation 
                            sx={{textTransform: 'none', width: "200px", height: "50px", 
                                backgroundColor: "#D1EEFF", color: "black", 
                                '&:hover': {backgroundColor: "#8bd4ff", color: "black"}}}
                            onClick={changeUsernameClick}>
                                Change Username
                        </Button>
                        <Button variant="contained" disableElevation color="info" sx={{textTransform: 'none', width: "200px", height: "50px", backgroundColor: "#D1EEFF", color: "black", 
                                '&:hover': {backgroundColor: "#8bd4ff", color: "black"}}}>Change Profile Picture</Button>
                    </Stack>
                </Stack>

                <Stack direction="column" spacing={1}>
                    <h1 style={{textAlign: "left"}}>Modify Account</h1>
                    <Stack direction = "row" spacing={2}>
                        <Button variant="contained" 
                            disableElevation 
                            sx={{textTransform: 'none', width: "200px", height: "50px", backgroundColor: "#FFE1E1", color: "black", '&:hover': {backgroundColor: "#ff9999", color: "black"}}}
                            onClick={changeEmailClick}>
                                Change Email
                        </Button>
                        <Button variant="contained" 
                            disableElevation 
                            sx={{textTransform: 'none', width: "200px", height: "50px", backgroundColor: "#FFE1E1", color: "black", '&:hover': {backgroundColor: "#ff9999", color: "black"}}}
                            onClick={changePasswordClick}>
                            Change Password
                        </Button>
                        <Button variant="contained" 
                            disableElevation 
                            sx={{textTransform: 'none', width: "200px", height: "50px", backgroundColor: "#FFA7A7", color: "black", '&:hover': {backgroundColor: "#ff6868", color: "black"}}}
                            onClick={handleDeleteOpen}>
                                Delete Account
                        </Button>
                        <Dialog onClose={handleDeleteClose} open={deleteOpen} >
                            <DialogTitle sx={{m: 2, p: 2, paddingBottom: 0, width: "500px", color: "red"}}> Delete Account?</DialogTitle>
                            <IconButton onClick={handleDeleteClose} sx={{position: 'absolute', right: 20, top: 25}}>
                                <CloseIcon />
                            </IconButton>
                            <DialogContent sx={{marginLeft: 1, paddingBottom: 0}}>Are you sure you'd like to delete your account? </DialogContent>
                            <DialogContent sx={{marginLeft: 1}}>Deleting your account is permanent.</DialogContent>
                            <DialogActions>
                                <Button className="DeleteButton2" variant="contained" sx={{p:2, backgroundColor: "red", color: "white"}} autoFocus onClick={deleteAccountClick}>
                                    Delete Account
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Stack>
                </Stack>
            </Stack>

        </Stack>
     </div>
  );
}

export default Settings;