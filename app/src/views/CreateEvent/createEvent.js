import React from "react";
import { useState, useEffect, useCallback } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import InfoIcon from "@mui/icons-material/Info";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import {
  OutlinedInput,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
} from "@mui/material";
import MapAutocomplete from "react-google-autocomplete";
import categories from "../eventCategories.json";
import dayjs from "dayjs";

function CreateEvent() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [tagsInput, setTagsInput] = useState("");
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
    // console.log("value:", value.format("YYYY-MM-DDTHH:mm:ssZ"));
    const formattedDateTime = value.format("YYYY-MM-DDTHH:mm:ssZ");
    const timeString = value.format("HH:mm:ss");

    setEventData({
      ...eventData,
      [`${startEnd}Date`]: formattedDateTime,
      [`${startEnd}Time`]: timeString,
    });
  };

  const handleChange = (event) => {
    // Update the inputData state when form fields change
    setEventData({
      ...eventData,
      [event.target.name]: event.target.value,
    });
  };
  const handleSubmit = () => {
    // event.preventDefault();
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
          return response.json();
        }
      })
      .then((data) => {
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

  const handlePlaceSelected = (place) => {
    setLocationInput(place.formatted_address);
    setEventData({
      ...eventData,
      ["location"]: place.formatted_address,
    });
  };

  const handleCategorySelected = (event) => {
    setEventData({
      ...eventData,
      ["tags"]: event.target.value,
    });
  };

  return (
    <div className="w-full h-full">
      <Navbar />
      <div className="m-[5%] flex flex-col gap-4">
        <div className="text-4xl font-bold text-left mb-[3%]">New Event</div>
        <div className="flex flex-row gap-3">
          <InfoIcon fontSize="large" style={{ color: "#b2b4b3" }} />
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
        <div className="text-l  text-left ">Category</div>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Category</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Category"
            defaultValue=""
            sx={{ width: "80%", textAlign: "left", backgroundColor: "white" }}
            onChange={handleCategorySelected}
          >
            {categories.map(({ name, value }, index) => (
              <MenuItem key={index} value={value}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div className="text-l  text-left ">Event Type</div>
        <div className="flex flex-row gap-8  justify-start">
          <button
            name="eventType"
            value="Private Event"
            onClick={() => handleEventType("Private Event")}
            className={`${
              selected === "Private Event" ? "bg-[#A1CFFF4D]" : "bg-transparent"
            } border-2 border-[#02407F] hover:bg-[#A1CFFF4D] text-[#02407F] font-bold py-4 px-10 rounded-lg`}
          >
            Private Event
          </button>
          <button
            name="eventType"
            value="Public Event"
            onClick={() => handleEventType("Public Event")}
            className={`${
              selected === "Public Event" ? "bg-[#A1CFFF4D]" : "bg-transparent"
            } border-2 border-[#02407F] hover:bg-[#A1CFFF4D] text-[#02407F] font-bold py-4 px-10 rounded-lg`}
          >
            Public Event
          </button>
        </div>

        <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>

        <div className="flex flex-row gap-3">
          <LocationCityIcon fontSize="large" style={{ color: "#b2b4b3" }} />
          <div className="text-3xl text-left"> Location</div>
        </div>
        <div className="flex flex-row gap-1">
          <div className="text-l text-left ">Address</div>
          <div className="text-l  text-left text-red-600"> *</div>
        </div>
        <OutlinedInput
          className="w-[80%] bg-white h-[45px] rounded-md align-left"
          color="secondary"
          inputComponent={({ inputRef, onFocus, onBlur, ...props }) => (
            <MapAutocomplete
              apiKey="AIzaSyBMp7w0sRedU-xNT_Z5DGFCYPFkHa-QTMg"
              {...props}
              defaultValue={locationInput}
              onPlaceSelected={handlePlaceSelected}
            />
          )}
        />
        <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>

        <div className="flex flex-row gap-3">
          <CalendarTodayIcon fontSize="large" style={{ color: "#b2b4b3" }} />
          <div className="text-3xl text-left"> Date and Time</div>
        </div>
        <div className="flex flex-col gap-1 w-[80%] bg-white">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Start Date/Time"
              onChange={(value) => handleDateTime("start", value)}
            />
          </LocalizationProvider>
        </div>

        <button
          onClick={handleSubmit}
          className="w-[20%] h-[60px] bg-yellow-500 mt-5 text-white font-bold  rounded-xl"
        >
          Create Event
        </button>

        <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
      </div>
      <script src="../path/to/flowbite/dist/datepicker.js"></script>
    </div>
  );
}
export default CreateEvent;
