import "../App.css";
import {Avatar, Box, Button, Stack} from "@mui/material/";
import SettingsIcon from "@mui/icons-material/Settings";

function Settings() {
  return (
    <Stack sx={{p: 5}}>
        <Stack direction="row" spacing={3} sx={{p: 5, bgcolor: '#171B26'}}>
            <Avatar sx={{width: 150, height: 150}}/>
            <h1 style={{color: "white", textAlign: "left", verticalAlign: "middle"}}>Display Name</h1>
            <Button>Logout</Button>
            <SettingsIcon style={{height: 50, color: "white"}}/>
        </Stack> 

        <h1 style={{textAlign: "left"}}>Modify Profile</h1>

        <Stack direction = "row">
            <Button>Change Username</Button>
            <Button>Change Profile Picture</Button>
        </Stack>

        <h1 style={{textAlign: "left"}}>Modify Account</h1>
        <Stack direction = "row">
            <Button>Change Email</Button>
            <Button>Change Password</Button>
            <Button>Delete Account</Button>
        </Stack>

     </Stack>
  );
}

export default Settings;