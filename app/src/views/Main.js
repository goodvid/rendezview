import React, { useState, useEffect, useCallback, useRef } from "react";
import MainNavbar from "../components/MainNavbar/MainNavbar";
import Event from "../components/Event/Event";
import axios from "axios";
import {
  Box,
  Button,
  Stack,
  TextField,
  Autocomplete,
  FormControl,
  Input,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
} from "@mui/material";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { pinwheel } from "ldrs";
import MapAutocomplete from "react-google-autocomplete";
import categories from "./eventCategories.json";

// Icons
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import TheaterComedyIcon from "@mui/icons-material/TheaterComedy";
import TheatersIcon from "@mui/icons-material/Theaters";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import FestivalIcon from "@mui/icons-material/Festival";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import SportsScoreIcon from "@mui/icons-material/SportsScore";
import NightlifeIcon from "@mui/icons-material/Nightlife";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import PendingIcon from "@mui/icons-material/Pending";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

function Main() {
  const [events, setEvents] = useState([]);
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [unixStartDate, setUnixStartDate] = useState("");
  const [isFree, setIsFree] = useState("");
  const [sortOn, setSortOn] = useState("time_start");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [locationInput, setLocationInput] = useState("");
  const [userCoords, setUserCoords] = useState(null);
  const [locLoading, setLocLoading] = useState(false);
  pinwheel.register(); // Set loading animation

  const iconMapping = {
    music: <MusicNoteIcon />,
    "visual-arts": <ColorLensIcon />,
    "performing-arts": <TheaterComedyIcon />,
    film: <TheatersIcon />,
    "lectures-books": <MenuBookIcon />,
    fashion: <CheckroomIcon />,
    "food-and-drink": <FastfoodIcon />,
    "festivals-fairs": <FestivalIcon />,
    charities: <VolunteerActivismIcon />,
    "sports-active-life": <SportsScoreIcon />,
    nightlife: <NightlifeIcon />,
    "kids-family": <FamilyRestroomIcon />,
    other: <MoreHorizIcon />,
  };

  function useEffectSkipFirstRender(effect, deps) {
    const isFirstRender = useRef(true);

    useEffect(() => {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }
      effect();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
  }

  useEffectSkipFirstRender(() => {
    fetchAPIEvents();
  }, [location, isFree, sortOn, unixStartDate, category]);

  useEffect(() => {
    setUnixStartDate(dayjs(startDate).unix());
  }, [startDate]);

  const fetchAPIEvents = () => {
    console.log("fetching...");
    setLoading(true);

    // Dynamically add parameters
    const params = new URLSearchParams();
    if (location) params.append("location", location);
    if (isFree) params.append("is_free", isFree);
    if (sortOn) params.append("sort_on", sortOn);
    if (unixStartDate) params.append("start_date", unixStartDate);
    if (category) params.append("category", category);
    axios
      .get(`http://localhost:5000/events/api?${params}`)
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
      .get("http://localhost:5000/events")
      .then((response) => {
        // console.log("events status: ", response.data["status"]);
        console.log("Events fetched:", response.data["events"]);
        setEvents(response.data["events"]);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        setLoading(false);
      });
  };

  const handlePlaceSelected = useCallback((place) => {
    setLocation(place.formatted_address);
    setLocationInput(place.formatted_address);
  }, []);

  useEffect(() => {
    getIPGeolocation();
  }, []);

  const getIPGeolocation = () => {
    setLocLoading(true);
    fetch("https://ipinfo.io/json?token=f92cb4e0401c19")
      .then((response) => response.json())
      .then((data) => {
        const { city, region, country } = data;
        const formattedAddress = `${city}, ${region}, ${country}`;

        setLocation(formattedAddress);
        setLocationInput(formattedAddress);
        setLocLoading(false);
      })
      .catch((error) => {
        console.error("Error getting IP-based location:", error);
        setLocLoading(false);
      });
  };

  const LocationFilter = () => {
    return (
      <div>
        {locLoading ? <p>loading location...</p> : <></>}
        <OutlinedInput
          fullWidth
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

  const FilteringTab = () => {
    return (
      <Stack width="100%">
        <Stack
          direction="row"
          justifyContent="flex-start"
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
        <div className="flex overflow-x-scroll p-10" style={{ height: "auto" }}>
          <Stack direction="row" gap={2} sx={{ minWidth: "max-content" }}>
            {categories.map((item, index) => (
              <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                key={index}
                onClick={() => setCategory(item.value)}
                sx={{
                  minWidth: "150px",
                }}
              >
                {iconMapping[item.value]}
                <h3>{item.name}</h3>
              </Stack>
            ))}
          </Stack>
        </div>
        <div className="flex flex-row flex-wrap gap-5 p-10 pt-10">
          <FilteringTab />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 ">
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
                    date={dayjs(event.time).toString()}
                    location={event.location}
                    key={i}
                    id={event.id}
                    desc={event.desc}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
