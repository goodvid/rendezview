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
      .get("http://localhost:5000/group/get_user_groups", {
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

  const leaveGroup = (gid) =>{
    fetch("http://localhost:5000/group/leave_group", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gid),
    }).then((response) => response.json())
        .then((data) => {
          console.log(data)

        });


  }

  return (
    <div className="w-full h-full p-10">
      <div className="flex flex-row items-center">
        <div className="text-left text-3xl font-bold my-5">My Groups</div>
        <Button sx={{ marginLeft: "10px" }} onClick={() => {navigate('/creategroups')}}><AddIcon sx={{ color: 'black'}} /></Button>
      </div>
      <div className="w-full h-[80%] flex flex-col items-center gap-5">
        {groups.map((group, i) => {
          return (
            <div
              className="w-[90%] h-[100px] outline outline-1 rounded-md flex justify-between items-center pl-10 pr-4"
              key={i}
              onClick={()=>{navigate(`/groupdetails/${group["gid"]}`)}}
            >
              <div className="text-2xl">{group["friends"]}</div>
              <Button onClick={() => leaveGroup(group["gid"])}>
                leave group
              </Button>
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
