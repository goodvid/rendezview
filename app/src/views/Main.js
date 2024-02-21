import React, { useState, useEffect } from "react";
import MainNavbar from "../components/MainNavbar/MainNavbar";
import Event from "../components/Event/Event";
import axios from "axios";
import {
  Box,
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
import { pinwheel } from "ldrs";

import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";

function Main() {
  const [events, setEvents] = useState([]);
  const [location, setLocation] = useState("West Lafayette, Indiana");
  const [startDate, setStartDate] = useState("");
  const [isFree, setIsFree] = useState("");
  // const [sortOn, setSortOn] = useState("time_start");
  const [sortOn, setSortOn] = useState("");
  const [loading, setLoading] = useState(false);
  pinwheel.register();

  useEffect(() => {
    fetchAPIEvents();
    console.log(location);
    console.log(isFree);
    // const params = new URLSearchParams();
    // // Conditionally append parameters if they are not empty strings
    // if (location) params.append("location", location);
    // if (startDate) params.append("start_date", startDate);
    // if (isFree) params.append("is_free", isFree);
    // if (sortOn) params.append("sort_on", sortOn);
    // // const params = new URLSearchParams({
    // //   location: encodeURIComponent(location),
    // //   start_date: encodeURIComponent(startDate),
    // //   sort_on: encodeURIComponent(sortOn),
    // //   is_free: encodeURIComponent(isFree),
    // // }).toString();
    // console.log(`http://127.0.0.1:5000/events?${params}`);
  }, [location, isFree]);

  const fetchAPIEvents = () => {
    setLoading(true);
    // const params = new URLSearchParams({
    //   location: encodeURIComponent(location),
    //   start_date: encodeURIComponent(startDate),
    //   is_free: encodeURIComponent(isFree),
    //   sort_on: encodeURIComponent(sortOn),
    // }).toString();
    const params = new URLSearchParams();
    if (location) params.append("location", location);
    if (startDate) params.append("start_date", startDate);
    if (isFree) params.append("is_free", isFree);
    if (sortOn) params.append("sort_on", sortOn);

    console.log(`http://127.0.0.1:5000/events/api?${params}`);
    // console.log(
    //   `http://127.0.0.1:5000/events/api?location=${encodeURIComponent(
    //     location
    //   )}`
    // );

    axios
      .get(`http://127.0.0.1:5000/events/api?${params}`)
      // .get(`http://127.0.0.1:5000/events/api`)
      // .get(
      //   `http://127.0.0.1:5000/events/api?location=${encodeURIComponent(
      //     location
      //   )}`
      // )
      .then((response) => {
        console.log("API events fetched and stored:", response.data);
        fetchAndDisplayEvents();
      })
      .catch((error) => {
        console.error("Error fetching API events:", error);
        setLoading(false);
      });
  };

  const fetchAndDisplayEvents = () => {
    axios
      .get("http://127.0.0.1:5000/events")
      .then((response) => {
        console.log("events status: ", response.data["status"]);
        console.log("Events fetched:", response.data["events"]);
        setEvents(response.data["events"]);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        setLoading(false);
      });
  };

  const locationOptions = [
    "West Lafayette, IN",
    "New York City",
    "Novi, Michigan",
  ];

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
            defaultValue="time-start"
            // value={age}
            label="sort-by"
            // onChange={handleChange}
          >
            <MenuItem value="time-start">Time Start</MenuItem>
            <MenuItem value="popularity">Popularity</MenuItem>
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
          value={location}
          sx={{ width: 200 }}
          onChange={(event, newValue) => {
            setLocation(newValue);
          }}
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
          value={isFree}
          label="Price"
          onChange={(event) => setIsFree(event.target.value)}
        >
          <MenuItem value="">None</MenuItem>
          <MenuItem value="true">Free</MenuItem>
          <MenuItem value="false">Paid</MenuItem>
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
      <Stack width="100%">
        <Stack
          direction="row"
          justifyContent="flex-start"
          // margin="2.5rem"
          // marginBottom="0px"
          gap="1rem"
          width="100%"
        >
          <LocationFilter />
          <DateFilter />
          <PriceFilter />
        </Stack>
        <Stack>
          <SortBySelect />
        </Stack>
      </Stack>
    );
  };

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
          <FilteringTab />
          {loading ? (
            <Stack width="100%" height="100%" alignItems="center">
              <l-pinwheel
                size="100"
                stroke="3.5"
                speed="0.9"
                color="black"
              ></l-pinwheel>
            </Stack>
          ) : (
            events.reverse().map((event, i) => {
              return (
                <Event
                  name={event.name}
                  date={event.time}
                  location={event.location}
                  key={i}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default Main;
