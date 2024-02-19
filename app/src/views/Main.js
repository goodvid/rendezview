import React, { useState, useEffect } from "react";
import MainNavbar from "../components/MainNavbar/MainNavbar";
import Event from "../components/Event/Event";
import axios from "axios";
import {
  Stack,
  TextField,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";

const locationOptions = ["The Godfather", "Pulp Fiction"];

const SortBySelect = () => {
  return (
    <Stack
      direction="row"
      justifyContent="flex-end"
      marginInline="3rem"
      gap="1rem"
    >
      <p>Sort by:</p>
      <FormControl sx={{ minWidth: 120 }}>
        <Select
          labelId="sort-by"
          id="sort-by"
          variant="standard"
          defaultValue="reccomended"
          // value={age}
          label="sort-by"
          // onChange={handleChange}
        >
          <MenuItem value="reccomended">Reccomended</MenuItem>
          <MenuItem value="popularity">Popularity</MenuItem>
          <MenuItem value="time-start">Time Start</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );
};

const LocationFilter = () => {
  return (
    <div>
      <Autocomplete
        disablePortal
        id="Location"
        options={locationOptions}
        sx={{ width: 200 }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Location"
            // InputProps={{
            //   startAdornment: (
            //     <InputAdornment position="start">
            //       <LocationOnIcon />
            //     </InputAdornment>
            //   ),
            // }}
          />
        )}
      />
    </div>
  );
};

const DateFilter = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        label="Start Date/Time"
        // value={value}
        // onChange={(newValue) => setValue(newValue)}
      />
    </LocalizationProvider>
  );
};

const PriceFilter = () => {
  return (
    <FormControl sx={{ minWidth: 120 }}>
      <InputLabel id="price-select">Price</InputLabel>
      <Select
        labelId="price-select"
        id="price-select"
        // value={age}
        label="Price"
        // onChange={handleChange}
      >
        <MenuItem value="free">Free</MenuItem>
        <MenuItem value="paid">Paid</MenuItem>
      </Select>
    </FormControl>
  );
};

const RatingFilter = () => {
  return (
    <FormControl sx={{ minWidth: 120 }}>
      <InputLabel id="price-select">Rating</InputLabel>
      <Select
        labelId="price-select"
        id="price-select"
        // value={age}
        label="Price"
        // onChange={handleChange}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <MenuItem value="1">
          <StarIcon />
          <StarBorderIcon />
          <StarBorderIcon />
          <StarBorderIcon />
          <StarBorderIcon />+
        </MenuItem>
        <MenuItem value="2">
          <StarIcon />
          <StarIcon />
          <StarBorderIcon />
          <StarBorderIcon />
          <StarBorderIcon />+
        </MenuItem>
        <MenuItem value="3">
          <StarIcon />
          <StarIcon />
          <StarIcon />
          <StarBorderIcon />
          <StarBorderIcon />+
        </MenuItem>
        <MenuItem value="4">
          <StarIcon />
          <StarIcon />
          <StarIcon />
          <StarIcon />
          <StarBorderIcon />+
        </MenuItem>
        <MenuItem value="5">
          <StarIcon />
          <StarIcon />
          <StarIcon />
          <StarIcon />
          <StarIcon />
        </MenuItem>
      </Select>
    </FormControl>
  );
};

const FilteringTab = () => {
  return (
    <Stack
      direction="row"
      justifyContent="flex-start"
      margin="3rem"
      marginBottom="0px"
      gap="1rem"
    >
      <LocationFilter />
      <DateFilter />
      <PriceFilter />
      {/* <RatingFilter /> */}
    </Stack>
  );
};

function Main() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchAPIEvents();
    // fetchAndDisplayEvents();
  }, []);

  const fetchAPIEvents = () => {
    axios
      .get("http://127.0.0.1:5000/events/api")
      .then((response) => {
        console.log("API events fetched and stored:", response.data);
        fetchAndDisplayEvents();
      })
      .catch((error) => console.error("Error fetching API events:", error));
  };

  const fetchAndDisplayEvents = () => {
    axios
      .get("http://127.0.0.1:5000/events")
      .then((response) => {
        console.log("events status: ", response.data["status"]);
        console.log("Events fetched:", response.data["events"]);
        setEvents(response.data["events"]);
      })
      .catch((error) => console.error("Error fetching events:", error));
  };

  // useEffect(() => {
  //   console.log("hi");
  //   axios
  //     .get("http://127.0.0.1:5000/events")
  //     .then((res) => {
  //       console.log(res.data["status"]);
  //       setEvents(res.data["events"]);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);

  return (
    <div className="w-full h-full">
      <MainNavbar />
      <div className="w-full h-[360px] bg-light-blue flex justify-center items-center">
        <span className="font-medium text-3xl">Featured Event + Details</span>
      </div>
      <div className="w-full h-[533px] flex flex-col">
        <span className="text-xl">Categories</span>
        <div className="w-full flex flex-row">
          <div className="bg-light-gray w-[150px] h-[100px]"> Category</div>
          <div className="bg-light-gray w-[150px] h-[100px]"> Category</div>
          <div className="bg-light-gray w-[150px] h-[100px]"> Category</div>
          <div className="bg-light-gray w-[150px] h-[100px]"> Category</div>
          <div className="bg-light-gray w-[150px] h-[100px]"> Category</div>
          <div className="bg-light-gray w-[150px] h-[100px]"> Category</div>
          <div className="bg-light-gray w-[150px] h-[100px]"> Category</div>
          <div className="bg-light-gray w-[150px] h-[100px]"> Category</div>
          <div className="bg-light-gray w-[150px] h-[100px]"> Category</div>
          <div className="bg-light-gray w-[150px] h-[100px]"> Category</div>
          <div className="bg-light-gray w-[150px] h-[100px]"> Category</div>
          <div className="bg-light-gray w-[150px] h-[100px]"> Category</div>
          <div className="bg-light-gray w-[150px] h-[100px]"> Category</div>
        </div>
        <div className="flex flex-row flex-wrap gap-5 pl-10 pt-10">
          {events.map((event, i) => {
            return (
              <Event
                name={event.name}
                date={event.time}
                location={event.location}
                key={i}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

// function Main() {
//   return (
//     <div className="w-full h-full">
//       <MainNavbar />
//       <div className="w-full h-[360px] bg-light-blue flex justify-center items-center">
//         <span className="font-medium text-3xl">Featured Event + Details</span>
//       </div>
//       <div className="w-full h-[533px] flex flex-col">
//         <span className="text-xl">Categories</span>
//         <div className="w-full flex flex-row">
//           <div className="bg-light-gray w-[150px] h-[100px]"> Category</div>
//           <div className="bg-light-gray w-[150px] h-[100px]"> Category</div>
//           <div className="bg-light-gray w-[150px] h-[100px]"> Category</div>
//           <div className="bg-light-gray w-[150px] h-[100px]"> Category</div>
//           <div className="bg-light-gray w-[150px] h-[100px]"> Category</div>
//           <div className="bg-light-gray w-[150px] h-[100px]"> Category</div>
//           <div className="bg-light-gray w-[150px] h-[100px]"> Category</div>
//           <div className="bg-light-gray w-[150px] h-[100px]"> Category</div>
//           <div className="bg-light-gray w-[150px] h-[100px]"> Category</div>
//           <div className="bg-light-gray w-[150px] h-[100px]"> Category</div>
//           <div className="bg-light-gray w-[150px] h-[100px]"> Category</div>
//           <div className="bg-light-gray w-[150px] h-[100px]"> Category</div>
//           <div className="bg-light-gray w-[150px] h-[100px]"> Category</div>
//         </div>
//         <FilteringTab />
//         <SortBySelect />
//         <div className="flex flex-row flex-wrap gap-5 pl-10 pt-10">
//           <Event />
//           <Event />
//           <Event />
//           <Event />
//           <Event />
//           <Event />
//           <Event />
//           <Event />
//         </div>
//       </div>
//     </div>
//   );
// }

export default Main;
