import React from "react";
import axios from "axios";
import "./Events.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import MainNavbar from "../../components/MainNavbar/MainNavbar";
import Event from "../../components/Event/Event";

// function Anon() {

//     const navigate

//     return (
//         <div className='text-3xl ml-[9%] mt-[10%]'>
//             Please sign up or log in to view your events!
//         </div>
//     )
// }

function EventList() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    console.log(sessionStorage.getItem("token"));
    axios
      .get("http://localhost:5000/user_events", {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res.data["events"]);
        setEvents(res.data["events"]);
      });
  }, []);

  return (
    <div className="w-full">
      <div className="text-left text-3xl font-bold ml-[150px] mt-[50px]">
        Events
      </div>
      <div className=" grid grid-cols-2 gap-4 place-content-center ml-[10%] mt-[5%]">
        {events.map((event, i) => {
          return (
            <Event
              id={event.id}
              name={event.name}
              date={event.time + " " + event.date}
              location={event.location}
              desc={event.desc}
              key={i}
            />
          );
        })}
      </div>
    </div>
  );
}

function Events() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionStorage.getItem("token")) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="w-full h-full">
      <MainNavbar />
      {sessionStorage.getItem("token") ? <EventList /> : <div />}
    </div>
  );
}

export default Events;
