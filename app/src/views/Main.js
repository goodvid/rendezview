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
import dayjs from "dayjs";
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
  const [unixStartDate, setUnixStartDate] = useState("");
  const [isFree, setIsFree] = useState("");
  const [sortOn, setSortOn] = useState("time_start");
  const [loading, setLoading] = useState(false);
  pinwheel.register();

  useEffect(() => {
    setUnixStartDate(dayjs(startDate).unix());
  }, [startDate]);

  useEffect(() => {
    fetchAPIEvents();
  }, [location, isFree, sortOn, unixStartDate]);

  const fetchAPIEvents = () => {
    setLoading(true);

    // Dynamically add parameters
    const params = new URLSearchParams();
    if (location) params.append("location", location);
    if (isFree) params.append("is_free", isFree);
    if (sortOn) params.append("sort_on", sortOn);
    if (unixStartDate) params.append("start_date", unixStartDate);

    console.log(`http://127.0.0.1:5000/events/api?${params}`);
    axios
      .get(`http://127.0.0.1:5000/events/api?${params}`)
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
            value={sortOn}
            label="sort-by"
            onChange={(event) => setSortOn(event.target.value)}
          >
            <MenuItem value="time_start">Time Start</MenuItem>
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
          value={startDate}
          onChange={(newValue) => setStartDate(newValue)}
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
