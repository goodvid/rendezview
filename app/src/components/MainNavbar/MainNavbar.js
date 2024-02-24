import React from "react";
import "./MainNavbar.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Settings from "@mui/icons-material/Settings";

function MainNavbar() {
  const logout = () => {
    axios
      .get("http://127.0.0.1:5000/delinkGoogle")
      .then((res) => {
        if (res.data.status === 200) {
          sessionStorage.removeItem("token");
          console.log("removed");
          window.location.reload();
          navigate("/");
        } else {
          // Handle non-success status here, if any
          console.log(
            "Authentication successful but with non-success status",
            res.data
          );
        }
      })
      .catch((err) => {
        console.log(err);
        // Optionally, navigate to an error page or display a message
        alert("Error Occurred: Try Again Later");
      });
  };

  const navigate = useNavigate();
  const settingsClick = () => {
    navigate("/settings");
  };

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

      {sessionStorage.getItem("token") ? (
        <div className="w-[150px] ml-[500px]">
          <IconButton onClick={settingsClick}>
            <Settings sx={{ color: "white" }}></Settings>
          </IconButton>
          <button onClick={logout} className="text-white">
            Logout
          </button>
        </div>
      ) : (
        <div className="w-[150px] flex flex-row gap-2 ml-[500px]">
          <Link to="/login" className="text-white">
            Sign In
          </Link>
          <div className="text-white">|</div>
          <Link to="/register" className="text-white">
            Register
          </Link>
        </div>
      )}
    </div>
  );
}

export default MainNavbar;
