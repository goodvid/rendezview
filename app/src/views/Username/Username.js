import React from "react";
import { useState } from "react";

import Navbar from "../../components/Navbar/Navbar";
import { Link } from "react-router-dom";

function Login() {
  const [inputData, setInputData] = useState({
    // Initial state, adjust based on your form fields
    profile: "",
  });

  const handleChange = (event) => {
    // Update the inputData state when form fields change
    setInputData({
      ...inputData,
      [event.target.name]: event.target.value,
    });
  };
  const handleSubmit = (event) => {
    event.preventDefault();

    // Send data to Flask server
    fetch("http://localhost:5000/submit-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        // Handle success
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle errors
      });
  };
  return (
    <div className="w-full h-full">
      <Navbar />
      <div className="w-[100%] h-[100%] flex flex-col justify-center items-center">
        <span className="text-3xl font-bold mt-[7%]">Set Profile Name</span>
        <div className="w-[40%] h-[70%] flex flex-col justify-center items-center gap-1">
          <span className="w-[360px] text-gray-500 text-left mt-[40px]">
            Profile Name
          </span>
          <input className="w-[360px] h-[45px] border-login-blue outline rounded-md pl-2" />

          <button
            onChange="/events"
            className="w-[360px] h-[45px] bg-login-blue text-white font-bold rounded-lg mt-[30px]"
          >
            Set profile name
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
