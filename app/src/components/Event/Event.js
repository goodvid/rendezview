import React from "react";
import { Link } from "react-router-dom";
import "./Event.css";

function Event({ id, name, date, location }) {
  return (
    <Link
      to={"/eventdetails/" + id}
      className="w-[400px] h-[200px] rounded-lg outline"
    >
      <div className="w-[100%] h-[100%] flex flex-row justify-center items-center gap-5">
        <div className=" w-[180px] h-[180px] bg-light-gray">Image</div>
        <div className="w-[180px] h-[180px] flex flex-col">
          <span className="text-left font-bold">{name}</span>
          <span className="text-left">Tags</span>
          <span className="text-left">
            {date} at {location}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default Event;
