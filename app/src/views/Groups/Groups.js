import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainNavbar from "../../components/MainNavbar/MainNavbar";
import AddIcon from '@mui/icons-material/Add';
import { Button } from "@mui/material";

function GroupList() {
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(sessionStorage.getItem("token"));
    axios
      .get("http://localhost:5000/group/get_groups", {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res.data["groups"]);
        setGroups(res.data["groups"]);
      });
  }, []);

  return (
    <div className="w-full h-full p-10">
      <div className="flex flex-row items-center">
        <div className="text-left text-3xl font-bold my-5">My Groups</div>
        <Button sx={{ marginLeft: "10px" }} onClick={() => {navigate('/creategroups')}}><AddIcon sx={{ color: 'black'}} /></Button>
      </div>
      <div className="w-full h-[80%] flex flex-col items-center gap-5">
        {groups.map((group, i) => {
          return (
            <div className="w-[90%] h-[100px] outline outline-1 rounded-md flex justify-start items-center pl-10" key={i}>
                <div className="text-2xl">{group['friends']}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Groups() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionStorage.getItem("token")) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="w-full h-full">
      <MainNavbar />
      {sessionStorage.getItem("token") ? <GroupList /> : <div />}
    </div>
  );
}

export default Groups;
