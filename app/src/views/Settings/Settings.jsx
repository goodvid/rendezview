import "../..//App.css";
import {Avatar, Button, Stack} from "@mui/material/";
import SettingsIcon from "@mui/icons-material/Settings";
import MainNavbar from "../../components/MainNavbar/MainNavbar";

function Settings() {
  return (
    <div>
        <MainNavbar />
        
        <Stack sx={{p: 5}}>
            <Stack direction="row" spacing={3} sx={{p: 5, bgcolor: '#171B26'}}>
                <Avatar sx={{width: 150, height: 150}}/>
                <h1 style={{color: "white", textAlign: "left", verticalAlign: "middle"}}>Display Name</h1>
                <Button>Logout</Button>
                <SettingsIcon style={{height: 50, color: "white"}}/>
            </Stack> 

            <h1 style={{textAlign: "left"}}>Modify Profile</h1>

            <Stack direction = "row" spacing={2}>
                <Button variant="contained" disableElevation>Change Username</Button>
                <Button variant="contained" disableElevation>Change Profile Picture</Button>
            </Stack>

            <h1 style={{textAlign: "left"}}>Modify Account</h1>
            <Stack direction = "row" spacing={2}>
                <Button variant="contained" disableElevation>Change Email</Button>
                <Button variant="contained" disableElevation>Change Password</Button>
                <Button variant="contained" disableElevation>Delete Account</Button>
            </Stack>

        </Stack>
     </div>
  );
}

export default Settings;