import React from "react";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { withAuth } from "../withAuth";
import InfoIcon from '@mui/icons-material/Info';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import Info from "@mui/icons-material/Info";
import { withAuth } from "../withAuth";

function CreateEvent() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("");
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

  useEffect(() => {
    console.log(eventData);
  }, [eventData]);

  const handleDateTime = (startEnd, value) => {
    const dateString = value.format("YYYY-MM-DD");
    const timeString = value.format("HH:mm:ss");

    setEventData({
      ...eventData,
      [`${startEnd}Date`]: dateString,
      [`${startEnd}Time`]: timeString,
    });
  };

  const handleChange = (event) => {
    // Update the inputData state when form fields change
    setEventData({
      ...eventData,
      [event.target.name]: event.target.value,
    });
    console.log(eventData, event.target);
  };
  const handleSubmit = () => {
    //event.preventDefault();
    fetch("http://127.0.0.1:5000/event/create", {
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
          return response.json();
        }
      })
      .then((data) => {
        console.log(data, "adafewrg");
        navigate(`/eventdetails/${data.eventID}`);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const handleEventType = (type) => {
    if (selected == type) {
      setSelected("");
      setEventData({
        ...eventData,
        ["eventType"]: "",
      });
    } else {
      setSelected(type);
      setEventData({
        ...eventData,
        ["eventType"]: type,
      });
    }
  };

  return (
    <div className="w-full h-full">
      <Navbar />
      <div className="m-[5%] flex flex-col gap-4">
        <div className="text-4xl font-bold text-left mb-[3%]">New Event</div>
        <div className="flex flex-row gap-3">
          <InfoIcon fontSize="large" style={{color: "#b2b4b3"}}/>
          <div className="text-3xl text-left"> Basic Info</div>
        </div>
        <div className="flex flex-row gap-1">
          <div className="text-l  text-left "> Event Title</div>
          <div className="text-l  text-left text-red-600"> *</div>
        </div>
        <input
          name="eventName"
          onChange={handleChange}
          className="w-[80%] h-[45px] border-login-blue outline rounded-md align-left"
        ></input>
        <div className="text-l  text-left "> Description</div>
        <input
          name="eventDesc"
          onChange={handleChange}
          className="w-[80%] h-[300px] border-login-blue outline rounded-md align-left"
        ></input>
        <div className="flex flex-row gap-1">
          <div className="text-l  text-left "> Organizer</div>
          <div className="text-l  text-left text-red-600"> *</div>
        </div>
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
            onClick={() => handleEventType("Private Event")}
            class={`${
              selected === "Private Event" ? "bg-[#A1CFFF4D]" : "bg-transparent"
            } border-2 border-[#02407F] hover:bg-[#A1CFFF4D] text-[#02407F] font-bold py-4 px-10 rounded-lg`}
          >
            Private Event
          </button>
          <button
            name="eventType"
            value="Public Event"
            onClick={() => handleEventType("Public Event")}
            class={`${
              selected === "Public Event" ? "bg-[#A1CFFF4D]" : "bg-transparent"
            } border-2 border-[#02407F] hover:bg-[#A1CFFF4D] text-[#02407F] font-bold py-4 px-10 rounded-lg`}
          >
            Public Event
          </button>
        </div>

        <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>

        <div className="flex flex-row gap-3">
          <LocationCityIcon fontSize="large" style={{color: "#b2b4b3"}}/>
          <div className="text-3xl text-left"> Location</div>
        </div>
        <div className="flex flex-row gap-1">
          <div className="text-l text-left ">Address</div>
          <div className="text-l  text-left text-red-600"> *</div>
        </div>
        <input
          name="location"
          onChange={handleChange}
          className="w-[80%] h-[45px] border-login-blue outline rounded-md align-left"
        ></input>
        <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>

        <div className="flex flex-row gap-3">
          <CalendarTodayIcon fontSize="large" style={{color: "#b2b4b3"}}/>
          <div className="text-3xl text-left"> Date and Time</div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Start Date/Time"
                onChange={(value) => handleDateTime("start", value)}
              />
            </LocalizationProvider>
          </div>
          <div className="flex flex-col gap-1">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="End Date/Time"
                onChange={(value) => handleDateTime("end", value)}
              />
            </LocalizationProvider>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          class="w-[20%] h-[60px] bg-yellow-500 mt-5 text-white font-bold  rounded-xl"
        >
          Create Event
        </button>

        <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
      </div>
      <script src="../path/to/flowbite/dist/datepicker.js"></script>
    </div>
  );
}
export default withAuth(CreateEvent);
