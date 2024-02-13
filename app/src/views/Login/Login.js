import React from 'react';
import './Login.css'
import { useState } from "react";   
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();
    const response = false
    const [inputData, setInputData] = useState({
      // Initial state, adjust based on your form fields
      name: "",
      password: "",
    });
    const handleChange = (event) => {
      // Update the inputData state when form fields change
      setInputData({
        ...inputData,
        [event.target.name]: event.target.value,
      });
    };
    const handleSubmit = (event) => {
      console.log(inputData)
       event.preventDefault();

       // Send data to Flask server
       fetch("http://localhost:5000/login", {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify(inputData),
       })
         .then((response) => response.json())
         .then((data) => {
           console.log("Success:", data);
           navigate("/username")
           response = true

           // Handle success
         })
         .catch((error) => {
           console.error("Error:", error);
           // Handle errors
         });
         console.log(response)
         if (response){
          console.log("dghuggr")
          navigate("/username");

         }


         
         

     };
    return (
      <div className="w-full h-full">
        <div className="w-[100%] h-[100%] flex flex-col justify-center items-center">
          <span className="text-3xl font-bold mt-[7%]">Sign In</span>
          <div className="w-[40%] h-[70%] flex flex-col justify-center items-center gap-1">
            <span className="w-[360px] text-gray-500 text-left mt-[40px]">
              Email
            </span>
            <input
              name="name"
              onChange={handleChange}
              className="w-[360px] h-[45px] border-login-blue outline rounded-md pl-2"
            />
            <span className="w-[360px] text-gray-500 text-left mt-[20px]">
              Password
            </span>
            <input
              name="password"
              type='password'
              onChange={handleChange}
              className="w-[360px] h-[45px] border-login-blue outline rounded-md pl-2"
            />
            <Link
              id="forgot-password"
              to="/forgot_password"
              className="text-gray-500 ml-[240px]"
            >
              Forgot Password?
            </Link>
            <button
              onClick={handleSubmit}
              className="w-[360px] h-[45px] bg-login-blue text-white font-bold rounded-lg mt-[30px]"
            >
              Log In
            </button>
            <span className="font-normal text-gray-500 mt-4">
              Don't have an account?
            </span>
            <Link
              id="sign-up"
              to="/register"
              className="text-login-blue font-bold"
            >
              Sign Up
            </Link>
            <button
              href="/events"
              className="w-[260px] h-[45px] bg-black text-white font-medium rounded-full mt-[30px]"
            >
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    );
};

export default Login;