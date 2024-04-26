import React from "react";
// import "./Event.css";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

function Blog({
  blogID,
  title,
  text,
  authorID,
  authorName,
  date,
  visibility,
  picture,
}) {
  const navigate = useNavigate();
  const eventLink = "/blogdetails/" + blogID;

  return (
    <div
      onClick={() => navigate(eventLink)}
      className="w-[30rem] h-full bg-white rounded-lg border-[3px] border-[#1C3659] flex justify-between items-start gap-5 p-1"
    >
      <div className="w-full flex flex-col p-[1rem] gap-5">
        <h3 className="text-left font-bold">{title}</h3>
        <div className="flex flex-col gap-3">
          <div className="flex flex-row gap-3">
            <AccessTimeIcon sx={{ color: "#1C3659" }} />
            <p className="text-left">{date}</p>
          </div>
          <div className="flex flex-row mt-1">
            <p className="text-left font-normal">
              {text.substring(0, 200).concat("...")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Blog;
