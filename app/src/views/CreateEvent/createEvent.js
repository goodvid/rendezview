import React from "react";
import { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { withAuth } from "../withAuth";
function CreateEvent() {
    const navigate = useNavigate();
    
    const [color1, setColor1] = useState("")
    const [color2, setColor2] = useState("");
    const [eventData, setEventData] = useState({
      eventName: "",
      eventDesc: "",
      hostName: "",
      tags: "",
      eventType: "",
      location: "",
      startDate: "",
      startTime: "",
      endTime: "",
      endDate: "",
    });

     const handleChange = (event) => {
       // Update the inputData state when form fields change
       setEventData({
         ...eventData,
         [event.target.name]: event.target.value,
       });
       console.log(eventData, event.target)
       if (event.target.name === "eventType" && event.target.value === "Private Event"){
        if (color1 === "bg-clear"){
          setColor1("bg-[#A1CFFF4D]");
          setColor2("bg-clear");
        } else {
          setColor1("bg-clear");
        }
        
       } 
       if (
         event.target.name === "eventType" &&
         event.target.value === "Public Event"
       ) {
         if (color2 === "bg-clear") {
           setColor2("bg-[#A1CFFF4D]");
           setColor1("bg-clear");
         } else {
           setColor2("bg-clear");
         }
       }
     };

     const handleSubmit = (event) => {
      event.preventDefault();
      fetch("http://localhost:5000/event/create", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      })
        .then((response) => {
          if (response.status === 422) {
            alert("unauthorized");
          } else if (response.status == 200) {
            alert("event made"); //TODO any navigation
            return response.json()
          }
        })
        .then(data =>{
          console.log(data, "adafewrg")
          navigate(`/eventdetails/${data.eventID}`);
        })
        .catch((error) => {
          console.log("error", error);
        });
     }

    return (
      <div className="w-full h-full">
        <Navbar />
        <div className="m-[5%] flex flex-col gap-4">
          <div className="text-5xl font-bold text-left">New Event</div>
          <div className="text-2xl font-bold text-left mt-[5%]">
            {" "}
            Basic Info
          </div>
          <div className="text-l  text-left "> Event Title</div>
          <input
            name="eventName"
            onChange={handleChange}
            className="w-[80%] h-[45px] border-login-blue outline rounded-md align-left"
          ></input>
          <div className="text-l  text-left "> Event Description</div>
          <input
            name="eventDesc"
            onChange={handleChange}
            className="w-[80%] h-[300px] border-login-blue outline rounded-md align-left"
          ></input>
          <div className="text-l  text-left "> Organizer Name</div>
          <input
            name="hostName"
            onChange={handleChange}
            className="w-[80%] h-[45px] border-login-blue outline rounded-md align-left"
          ></input>
          <div className="text-l  text-left "> Tags</div>
          <input
            name="tags"
            onChange={handleChange}
            className="w-[80%] h-[45px] border-login-blue outline rounded-md align-left"
          ></input>
          <div className="text-l  text-left ">Event Type</div>
          <div className="flex flex-row gap-8  justify-start">
            <button
              name="eventType"
              value="Private Event"
              onClick={handleChange}
              class={`${color1} border-2 border-[#02407F] hover:bg-[#A1CFFF4D] text-[#02407F] font-bold py-4 px-6 rounded`}
            >
              Private Event
            </button>
            <button
              name="eventType"
              value="Public Event"
              onClick={handleChange}
              class={`${color2} border-2 border-[#02407F] hover:bg-[#A1CFFF4D] text-[#02407F] font-bold py-4 px-6 rounded`}
            >
              Public Event
            </button>
          </div>
          
          <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>

          <div className="text-2xl font-bold  text-left ">Location</div>
          <div className="text-l text-left ">Location address</div>
          <input
            name="location"
            onChange={handleChange}
            className="w-[80%] h-[45px] border-login-blue outline rounded-md align-left"
          ></input>
          <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>

          <div className="text-2xl font-bold  text-left ">Date and Time</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <div className="text-m font-bold  text-left ">Start Date</div>
              <input
                name="startDate"
                onChange={handleChange}
                className="w-[60%] h-[45px] border-login-blue outline rounded-md align-left"
              ></input>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-m font-bold  text-left ">Start Time</div>
              <input
                name="startTime"
                onChange={handleChange}
                className="w-[60%] h-[45px] border-login-blue outline rounded-md align-left"
              ></input>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-m font-bold  text-left ">End Date</div>
              <input
                name="endDate"
                onChange={handleChange}
                className="w-[60%] h-[45px] border-login-blue outline rounded-md align-left"
              ></input>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-m font-bold  text-left ">End Time</div>
              <input
                name="endTime"
                onChange={handleChange}
                className="w-[60%] h-[45px] border-login-blue outline rounded-md align-left"
              ></input>
            </div>
          </div>

          <button onClick={handleSubmit} class="w-[20%] h-[45px] bg-yellow-500 mt-5 text-white font-bold  rounded">
            Create Event
          </button>

          <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
        </div>
        <script src="../path/to/flowbite/dist/datepicker.js"></script>
      </div>
    );
}
export default (CreateEvent);
