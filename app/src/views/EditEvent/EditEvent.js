import React from "react";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useParams } from "react-router-dom";
function CreateEvent() {
  const navigate = useNavigate();
  let id = useParams();
  const [selected, setSelected] = useState("");
  const [eventData, setEventData] = useState({
    eventID: id,
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
  const handleSubmit = (event) => {
    event.preventDefault();
    fetch("http://localhost:5000/event/edit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    })
      .then((response) => {
        if (response.status === 422) {
          alert("unauthorized");
        } else if (response.status == 200) {
          alert("event changed"); //TODO any navigation
          return response.json();
        }
      })
      .then((data) => {
        console.log(data.eventID, "adafewrg");
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
        <div className="text-5xl font-bold text-left">New Event</div>
        <div className="text-2xl font-bold text-left mt-[5%]"> Basic Info</div>
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
            onClick={() => handleEventType("Private Event")}
            class={`${selected === "Private Event" ? "bg-[#A1CFFF4D]" : "bg-transparent"
              } border-2 border-[#02407F] hover:bg-[#A1CFFF4D] text-[#02407F] font-bold py-4 px-6 rounded`}
          >
            Private Event
          </button>
          <button
            name="eventType"
            value="Public Event"
            onClick={() => handleEventType("Public Event")}
            class={`${selected === "Public Event" ? "bg-[#A1CFFF4D]" : "bg-transparent"
              } border-2 border-[#02407F] hover:bg-[#A1CFFF4D] text-[#02407F] font-bold py-4 px-6 rounded`}
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
          class="w-[20%] h-[45px] bg-yellow-500 mt-5 text-white font-bold  rounded"
        >
          Edit Event
        </button>

        <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
      </div>
      <script src="../path/to/flowbite/dist/datepicker.js"></script>
    </div>
  );
}
export default CreateEvent;
