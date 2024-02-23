import React from "react";
import { Link } from "react-router-dom";
import "./Event.css";

function Event({ id, name, date, location, desc }) {
  return (
    <Link
      to={"/eventdetails/" + id}
      className="w-[90%] h-[fit-content] rounded-lg outline"
    >
      <div className="w-[80%] h-[80%] flex flex-row justify-center items-center gap-5 ">
        {/* <div className=" w-[180px] h-[180px] bg-light-gray">Image</div> */}
        <div className="w-[100%] h-[100%] flex flex-col p-[1rem]">
          <span className="text-left font-bold">{name}</span>
          {/* <span className="text-left">Tags</span> */}
          <span className="text-left">
            {date} at {location}
          </span>
          <div className="text-left">Description: {desc}</div>
        </div>
      </div>
    </Link>
  );
}

export default Event;
