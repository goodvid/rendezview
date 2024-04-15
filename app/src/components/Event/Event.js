import React from "react";
import { Link } from "react-router-dom";
import "./Event.css";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

function Event({ id, name, date, location, desc }) {
  const navigate = useNavigate();
  const eventLink = "/eventdetails/" + id;
  return (
    <div
      onClick={() => navigate(eventLink)}
      className="w-full h-full rounded-lg border-2 border-[#1C3659] flex justify-between items-start gap-5 p-1"
    >
      {/* <div className=" w-[180px] h-[180px] bg-light-gray">Image</div> */}
      <div className="w-full flex flex-col p-[1rem] gap-5">
        <h3 className="text-left font-bold">{name}</h3>
        <div className="flex flex-col gap-3">
          <div className="flex flex-row gap-3">
            <AccessTimeIcon sx={{ color: "#1C3659" }} />
            <p className="text-left">{dayjs(date).toString()}</p>
          </div>
          <div className="flex flex-row gap-3">
            <LocationOnIcon sx={{ color: "#1C3659" }} />
            <p className="text-left">{location}</p>
          </div>
          <div className="flex flex-row mt-1">
            <p className="text-left font-normal">{desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Event;
