import "./ResetPassword.css"
import {Stack} from "@mui/material/";
import SettingsIcon from "@mui/icons-material/Settings";
import MainNavbar from "../../components/MainNavbar/MainNavbar";
import { useNavigate } from "react-router-dom";
import {Link} from "react-router-dom";

function ResetPassword() {   
    const navigate = useNavigate();

    const resetClick =() => {
        navigate("/login");
    }

  return (
    <div className="w-full h-full">
    <div className="w-[100%] h-[100%] flex flex-col justify-center items-center">        
        <Stack sx={{p: 5}}>

                <Stack direction="column" alignItems="center" spacing={2}>
                <div className="w-[100%] h-[70%] flex flex-col justify-center items-center gap-5">
                    <span className="text-3xl font-bold mt-[7%]">Reset Password</span>

                    <Stack spacing={1}>
                        <span className="w-[360px] text-gray-500 text-left mt-[40px]">
                            Email
                        </span>
                        <input
                            name="email"
                            className="w-[360px] h-[45px] border-login-blue outline rounded-md pl-2"
                        />

                        <span className="w-[360px] text-gray-500 text-left mt-[40px]">
                            New Password
                        </span>
                        <input
                            name="email"
                            className="w-[360px] h-[45px] border-login-blue outline rounded-md pl-2"
                        />

                        <span className="w-[360px] text-gray-500 text-left mt-[40px]">
                            Confirm New Password
                        </span>
                        <input
                            name="email"
                            className="w-[360px] h-[45px] border-login-blue outline rounded-md pl-2"
                        />
                    </Stack>

                    <button
                        onClick={resetClick}
                        className="w-[360px] h-[45px] bg-login-blue text-white font-bold rounded-lg mt-[30px]"
                    >
                        Reset Password
                    </button>

                    <Link id="sign-up" to="/login" className="text-login-blue font-bold"> Log In</Link>
                </div>
                </Stack>
                
        </Stack>
     </div>
     </div>
  );
}

export default ResetPassword;