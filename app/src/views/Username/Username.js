import React from "react";
import { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";

import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  let resp = ""
    const [inputData, setInputData] = useState('');

     const handleChange = (event) => {
       // Update the inputData state when form fields change
       setInputData(event.target.value);
     };
     const handleSubmit = (event) => {
       console.log(inputData);
       event.preventDefault();
       

       // Send data to Flask server
       fetch("http://localhost:5000/user/username", {
         method: "POST",
         headers: {
           Authorization: "Bearer " + sessionStorage.getItem("token"),
           "Content-Type": "application/json",
         },
         body: JSON.stringify({ username: inputData }),
       })
         .then((response) => {
           if (response.status === 200) {
             resp = response;
             return response.json();
           } else if (response.status == 401) {
             alert("choose unique username");
             return false;
           } else {
             alert("unauthorizeds");
             return false;
           }
         })
         .then((data) => {
           if (resp.status == 200) {
             console.log(sessionStorage.getItem("token"));
             navigate("/quiz");
           }
         })
         .catch((error) => {
           console.log("error", error);
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
          <input
            className="w-[360px] h-[45px] border-login-blue outline rounded-md pl-2"
            value={inputData.name}
            onChange={handleChange}
          />

          <button onClick={handleSubmit}  type="submit"
            className="w-[360px] h-[45px] bg-login-blue text-white font-bold
            rounded-lg mt-[30px]" > Set profile name
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
