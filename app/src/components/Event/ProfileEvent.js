import React from "react";
import "./Event.css";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

function ProfileEvent({ id, name, date, location, desc, rating }) {
  const navigate = useNavigate();
  const eventLink = "/eventdetails/" + id;

  const checkIfPast = () => {
    const eventDate = dayjs(date);
    const diff = dayjs().diff(eventDate);
    if (diff < 0) {
      return false;
    } else {
      return true;
    }
  };

  return (
    <div
      onClick={() => navigate(eventLink)}
      className="w-[30rem] h-full bg-white rounded-lg border-[3px] border-[#F2C879] flex justify-between items-start gap-5 p-1"
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
          {checkIfPast() && (
            <div className="flex flex-row gap-3">
              <ThumbUpIcon sx={{ color: "#1C3659" }} />
              {rating != null ? <p>{rating}%</p> : <p>Event not rated</p>}
            </div>
          )}
          <div className="flex flex-row mt-1">
            <p className="text-left font-normal">
              {desc.substring(0, 200).concat("...")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileEvent;
