import "../Settings/Settings.css"
import {Avatar, Button, Stack} from "@mui/material/";
import SettingsIcon from "@mui/icons-material/Settings";
import MainNavbar from "../../components/MainNavbar/MainNavbar";
import { useNavigate } from "react-router-dom";

function Settings() {   
    const navigate = useNavigate();
    
    const changeUsernameClick = () => {
        navigate("/changeusername");
    };
    
  return (
    <div>
        <MainNavbar />
        
        <Stack sx={{p: 5}}>
            <Stack direction="column" spacing={5}>
                <Stack direction="row" spacing={3} borderRadius="16px" sx={{p: 5, bgcolor: '#171B26'}}>
                    <Avatar sx={{width: 100, height: 100}}/>
                    <Stack direction="column" justifyContent="center">
                        <h1 style={{color: "white", textAlign: "left", verticalAlign: "middle"}}>Name</h1>
                    </Stack>
                    <Stack width="100%" direction="row" justifyContent="flex-end" gap="1rem">
                        <Stack direction="column" justifyContent="center">
                            <Button className="LogoutButton" justifyContent="center" variant="contained" color="inherit" size="large">Logout</Button>
                        </Stack>
                        <Stack direction="column" justifyContent="center">
                            <SettingsIcon style={{fontSize: "40px", color: "white"}}/>
                        </Stack>
                    </Stack>
                </Stack> 

                <Stack direction="column" spacing={1}>
                    <h1 style={{textAlign: "left"}}>Modify Profile</h1>
                    <Stack direction = "row" spacing={2}>
                        <Button className="ProfileButton" 
                            variant="contained" 
                            disableElevation 
                            sx={{textTransform: 'none', width: "200px", height: "50px"}}
                            onClick={changeUsernameClick}>
                                Change Username
                        </Button>
                        <Button className="ProfileButton" variant="contained" disableElevation color="info" sx={{textTransform: 'none', width: "200px", height: "50px"}}>Change Profile Picture</Button>
                    </Stack>
                </Stack>

                <Stack direction="column" spacing={1}>
                    <h1 style={{textAlign: "left"}}>Modify Account</h1>
                    <Stack direction = "row" spacing={2}>
                        <Button className="AccountButton" variant="contained" disableElevation sx={{textTransform: 'none', width: "200px", height: "50px"}}>Change Email</Button>
                        <Button className="AccountButton" variant="contained" disableElevation sx={{textTransform: 'none', width: "200px", height: "50px"}}>Change Password</Button>
                        <Button className="DeleteButton" variant="contained" disableElevation sx={{textTransform: 'none', width: "200px", height: "50px"}}>Delete Account</Button>
                    </Stack>
                </Stack>
            </Stack>

        </Stack>
     </div>
  );
}

export default Settings;