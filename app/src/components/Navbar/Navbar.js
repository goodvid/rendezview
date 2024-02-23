import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="w-[100%] h-[60px] flex flex-row justify-center items-center gap-10 bg-navbar-blue">
      <input
        type="text"
        placeholder="Search"
        className="w-[200px] h-[30px] pl-2 mr-10"
      />
      <Link to="/" className="text-white">
        Home
      </Link>
      <Link to="/events" className="text-white">
        Events
      </Link>
      <Link to="/blogs" className="text-white">
        Blogs
      </Link>
      <Link to="/profile" className="text-white">
        Profile
      </Link>
      <div className="w-[130px] flex flex-row gap-2 ml-[517px]" />
    </div>
  );
}

export default Navbar;
