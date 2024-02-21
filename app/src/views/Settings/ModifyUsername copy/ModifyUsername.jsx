import "../ChangeUsername/ModifyUsername.css"
import {Avatar, Button, Stack, IconButton, TextField} from "@mui/material/";
import SettingsIcon from "@mui/icons-material/Settings";
import MainNavbar from "../../../components/MainNavbar/MainNavbar";
import { useNavigate } from "react-router-dom";

function ModifyUsername() {   
    const navigate = useNavigate();
    
    const settingsClick = () => {
        navigate("/settings");
    };

    const saveClick =() => {
        navigate("/settings");
    }

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
                    <h1 style={{textAlign: "left"}}>Change Username</h1>

                    <Stack direction = "column" spacing={1}>
                        <h4 style={{textAlign: "left"}}>Email</h4>
                        <TextField />

                        <h4 style={{textAlign: "left"}}>New Username</h4>
                        <TextField />

                        <h4 style={{textAlign: "left"}}>Confirm New Username</h4>
                        <TextField />
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

export default ModifyUsername;