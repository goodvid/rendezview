import React, { useState, useEffect } from "react";
import { Stack, Badge, IconButton, Avatar } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import { Link } from "react-router-dom";
import axios from "axios";

function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [flag, setFlag] = useState(0);
  const [message, setMessage] = useState("");
  const [profilePic, setProfilePic] = useState("");

  const updateEmail = (event) => {
    if (event != null) {
      setEmail(event.target.value);
    }
  };

  const [password, setPassword] = useState("");

  const updatePassword = (event) => {
    if (event != null) {
      setPassword(event.target.value);
    }
  };

  const register = () => {
    axios
      .post("http://127.0.0.1:5000/user/register", {
        email: email,
        password: password,
      })
      .then((res) => {
        console.log(res);
        const status = res.data["status"];
        const message = res.data["message"];
        const token = res.data["access_token"];

        if (status === "200") {
          setFlag(2);
        } else {
          setFlag(1);
        }

        sessionStorage.setItem("token", token);

        setMessage(message);
        navigate("/username");
      })
      .catch((err) => {
        console.log(err);
      });
    setEmail("");
    setPassword("");
    setFlag(1);

    Array.from(document.querySelectorAll("input")).forEach(
      (input) => (input.value = "")
    );
  };

  return (
    <div className="w-full h-full">
      <div className="w-[100%] h-[100%] flex flex-col justify-center items-center">
        <span className="text-3xl font-bold mt-[7%]">
          Create a RendezView Account
        </span>
        <div className="w-[40%] h-[70%] flex flex-col justify-center items-center gap-1">
          <div className="flex flex-row justify-center items-center gap-[220px]">
            <div className="flex flex-col justify-center items-center gap-1">
              <span className="w-[360px] text-gray-500 text-left mt-[40px]">
                Email
              </span>
              <input
                onChange={updateEmail}
                className="w-[360px] h-[45px] border-login-blue outline rounded-md pl-2"
              />
              <span className="w-[360px] text-gray-500 text-left mt-[20px]">
                Password
              </span>
              <input
                type="password"
                onChange={updatePassword}
                className="w-[360px] h-[45px] border-login-blue outline rounded-md pl-2"
              />
            </div>
            <div className='justify-center items-center w-[200px]'>
              <div className="w-[360px] text-gray-500 text-left mt-[40px]">
                <span>Choose Profile Picture</span>
              </div>
              <div className='relative justify-center items-center mt-4 w-[150px]'>
                <Stack>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    badgeContent={
                      <IconButton
                        style={{ color: "#4D4D4D", backgroundColor: "white" }}
                      >
                        <EditIcon />
                      </IconButton>
                    }
                  >
                    <Avatar
                      sx={{ width: "150px", height: "150px" }}
                      alt={"avatar"}
                      src={profilePic}
                    />
                  </Badge>
                  <input type="file" style={{ display: "none" }} />
                </Stack>
              </div>
            </div>
          </div>

          {flag == 0 ? (
            <div className="mt-[70px]" />
          ) : (
            <div
              className={
                flag == 1
                  ? "mt-[70px] text-red-600"
                  : "mt-[70px] text-green-500"
              }
            >
              {message}
            </div>
          )}
          <button
            className="w-[260px] h-[45px] bg-login-blue text-white font-medium rounded-lg mt-2"
            onClick={register}
          >
            Create Account
          </button>
          <span className="font-normal text-gray-500 mt-4">
            Already have an account?
          </span>
          <Link id="log-in" to="/login" className="text-login-blue font-bold">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
