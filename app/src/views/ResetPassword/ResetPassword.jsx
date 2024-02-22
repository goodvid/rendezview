import "./ResetPassword.css"
import {Stack} from "@mui/material/";
import SettingsIcon from "@mui/icons-material/Settings";
import MainNavbar from "../../components/MainNavbar/MainNavbar";
import { useNavigate } from "react-router-dom";
import {Link} from "react-router-dom";
import { useState } from "react";

function ResetPassword() {   
    const navigate = useNavigate();

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

    const resetClick = (event) => {
        if (newPassword != confirmNewPassword) {
            alert("Your passwords don't match! Please ensure they are the same.");
            return;
        }

        console.log(email + newPassword);
        event.preventDefault();

        // Send to Flask server
        fetch("http://localhost:5000/user/resetpassword", {
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
            } else if (response.status == 400) {
                alert("This email does not belong to an existing account.");
                return false;
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
              alert("Password successfully reset!");
              navigate("/login");
            }
          })
          .catch((error) => {
            console.log("error", error);
          });
      };

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
                            onChange={updateEmail}
                        />

                        <span className="w-[360px] text-gray-500 text-left mt-[40px]">
                            New Password
                        </span>
                        <input
                            name="email"
                            className="w-[360px] h-[45px] border-login-blue outline rounded-md pl-2"
                            onChange={updateNewPassword}
                        />

                        <span className="w-[360px] text-gray-500 text-left mt-[40px]">
                            Confirm New Password
                        </span>
                        <input
                            name="email"
                            className="w-[360px] h-[45px] border-login-blue outline rounded-md pl-2"
                            onChange={updateConfirmNewPassword}
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