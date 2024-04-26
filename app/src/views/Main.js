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
import { SeeMoreButton } from "../components/StyledComponents/StyledComponents";
import { useNavigate } from "react-router-dom";

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
  const [featuredEvents, setFeaturedEvents] = useState();
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [unixStartDate, setUnixStartDate] = useState("");
  const [isFree, setIsFree] = useState("");
  const [sortOn, setSortOn] = useState("time_start");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [locationInput, setLocationInput] = useState("West Lafayette, IN, USA");
  const [locLoading, setLocLoading] = useState(false);
  const [eventType, setEventType] = useState("Featured");
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [recFriendEvents, setRecFriendEvents] = useState([]);
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
    // fetchAndDisplayEvents();
  }, [location, isFree, sortOn, unixStartDate, category]);

  useEffect(() => {
    setUnixStartDate(dayjs(startDate).unix());
    // console.log("startDate:", dayjs(startDate).unix());
  }, [startDate]);

  useEffect(() => {
    // Get the recommended events once the backend function is made
    if (sessionStorage.getItem("token")) {
      axios
        .get(`http://localhost:5000/events/get_recommended`, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          setRecommendedEvents(response.data["recommendations"]);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching API events:", error);
          setLoading(false);
        });
    }

    getUserLocation();
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      setFeaturedEvents(events[0]);
      setFeaturedLoading(false);
    }
  }, [events]);

  const getUserLocation = () => {
    setLocLoading(true);
    fetch("http://localhost:5000/user/get_location", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    })
      .then((response) => {
        if (response.status != 200) {
          console.log("not logged in");
          return;
        }
        return response.json();
      })
      .then((data) => {
        console.log("location:", data.location);
        if (data.location) {
          setLocation(data.location);
          setLocationInput(data.location);
        }
        setLocLoading(false);
      })
      .catch((error) => {
        console.log("error", error);
        setLocLoading(false);
      });
  };

  useEffect(() => {
    // Get the recommended events once the backend function is made
    if (sessionStorage.getItem("token")) {
      axios
      .get(`http://localhost:5000/events/get_friend_recs`, {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
          "Content-Type": "application/json",
        }
      })
      .then((response) => {
        setRecFriendEvents(response.data["recommendations"]);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching API events:", error);
        setLoading(false);
      });
    }
  }, []);

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
    console.log("url:", `http://localhost:5000/events/api?${params}`);
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
    const params = new URLSearchParams();
    if (location) params.append("location", location);
    if (isFree) params.append("is_free", isFree);
    if (sortOn) params.append("sort_on", sortOn);
    if (unixStartDate) params.append("start_date", unixStartDate);
    if (category) params.append("category", category);
    // console.log("url:", `http://localhost:5000/events/api?${params}`);
    axios
      .get(`http://localhost:5000/filtered_events?${params}`)
      .then((response) => {
        // console.log("All events:", response.data["all_events"]);
        // console.log("Fetched events:", response.data["fetched_events"]);
        // console.log("User events:", response.data["user_events"]);
        console.log("filters:", response.data["filters"]);
        console.log("data:", response.data);
        console.log("sorted events:", response.data["sorted"]);
        setEvents(response.data["sorted"]);
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

  const setFeatured = () => {
    setEventType("Featured");
  };

  const setRecommended = () => {
    setEventType("Recommended");
  };

  const setFriends = () => {
    setEventType("Friends");
  }
  const navigate = useNavigate();
  const handleSeeMore = () => {
    const eventLink = "/eventdetails/" + featuredEvents.id;
    navigate(eventLink);
  };

  return (
    <div className="w-full h-full">
      <MainNavbar />
      <div
        style={{
          background: "linear-gradient(to right,#6ecefa, #78faaf)",
        }}
        className="w-full h-[360px] bg-light-blue flex justify-center items-center"
      >
        {featuredLoading ? (
          <Stack width="100%" height="100%" alignItems="center">
            <l-pinwheel
              size="100"
              stroke="3.5"
              speed="0.9"
              color="black"
            ></l-pinwheel>
          </Stack>
        ) : (
          <Stack margin="3rem" textalign="left" alignItems="flex-start">
            <h1>{featuredEvents.name}</h1>
            <h3>{featuredEvents.location}</h3>
            <h3>{dayjs(featuredEvents.start_date).toString()}</h3>
            <p>{featuredEvents.desc}</p>
            <SeeMoreButton
              textAlign="Center"
              variant="contained"
              onClick={handleSeeMore}
            >
              See More
            </SeeMoreButton>
          </Stack>
        )}
      </div>
      <div className="w-full h-[533px] flex flex-col">
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
        <div className="flex flex-row flex-wrap gap-5 pl-10 pt-10">
          <button onClick={setFeatured}>Featured</button> |
          <button onClick={setRecommended}>Recommended</button> |
          <button onClick={setFriends}>By Friends</button>
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
            ) : eventType == "Featured" ? (
              events.map((event, i) => {
                if (event.visibility && event.visibility != "public" && event.visibility != "") {
                  return <div />
                }
                return (
                  <Event
                    name={event.name}
                    date={dayjs(event.start_date).toString()}
                    location={event.location}
                    key={i}
                    id={event.id}
                    desc={event.desc}
                  />
                );
              })
            ) : eventType == "Friends" ?
            (
              recFriendEvents.map((event, i) => {
                return (
                  <Event
                    name={event.name}
                    date={dayjs(event.start_date).toString()}
                    location={event.location}
                    key={i}
                    id={event.id}
                    desc={event.desc}
                  />
                );
              })
            ) : (
              recommendedEvents.map((event, i) => {
                return (
                  <Event
                    name={event.name}
                    date={dayjs(event.start_date).toString()}
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
