import React from "react";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import InfoIcon from "@mui/icons-material/Info";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, Stack, Box } from "@mui/material";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
//import { withAuth } from "../withAuth";

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

  const [imagePreviews, setImagePreviews] = useState([]);
  const [eventPhotos, setEventPhotos] = useState([]);
  const handlePhotoChange = (event) => {
    let previews = [];
    let photos = [];

    for (let i = 0; i < event.target.files.length; i++) {
      previews.push(URL.createObjectURL(event.target.files[i]));
      photos.push(event.target.files[i]);
      console.log("Picture " + i + ": " + event.target.files[i].name);
    }

    setImagePreviews(previews);
    setEventPhotos(photos);
  };

  const [eventID, setEventID] = useState("");

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
          className="w-full h-[45px] border-login-blue outline rounded-md align-left"
        ></input>

        <div className="text-l  text-left "> Description</div>
        <input
          name="eventDesc"
          onChange={handleChange}
          className="w-full h-[300px] border-login-blue outline rounded-md align-left"
        ></input>

        <div className="flex flex-row gap-1">
          <div className="text-l  text-left "> Organizer</div>
          <div className="text-l  text-left text-red-600"> *</div>
        </div>
        <input
          name="hostName"
          onChange={handleChange}
          className="w-full h-[45px] border-login-blue outline rounded-md align-left"
        ></input>

        <div className="text-l  text-left "> Tags</div>
        <input
          name="tags"
          onChange={handleChange}
          className="w-full h-[45px] border-login-blue outline rounded-md align-left"
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

        <div className="text-l  text-left ">Event Photos</div>
        <div class="flex items-center justify-center w-full">
          <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
              <div class="flex flex-col items-center justify-center pt-5 pb-6">
                  <FileUploadIcon fontSize="large" style={{ color: "#6b7280", marginBottom: 5}}/>
                  <p class="mb-2 text-gray-500 dark:text-gray-400">Click to upload</p>
              </div>
              <input id="dropzone-file" type="file" multiple class="hidden" onChange={handlePhotoChange} />
          </label>
        </div>     

        {imagePreviews && (
            <Stack direction="row" gap={2} sx={{overflowX: "auto"}}>
              {imagePreviews.map((img, i) => (
                  <img src={img} style={{height: "200px"}}/>
              ))}
            </Stack>
        )}

        <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>

        <div className="flex flex-row gap-3">
          <LocationCityIcon fontSize="large" style={{ color: "#b2b4b3" }} />
          <div className="text-3xl text-left"> Location</div>
        </div>
        <div className="flex flex-row gap-1">
          <div className="text-l text-left ">Address</div>
          <div className="text-l  text-left text-red-600"> *</div>
        </div>
        <input
          name="location"
          onChange={handleChange}
          className="w-full h-[45px] border-login-blue outline rounded-md align-left"
        ></input>
        <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>

        <div className="flex flex-row gap-3">
          <CalendarTodayIcon fontSize="large" style={{ color: "#b2b4b3" }} />
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
export default CreateEvent;
