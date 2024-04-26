import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainNavbar from "../../components/MainNavbar/MainNavbar";
import AddIcon from "@mui/icons-material/Add";
import {Chip,  Button } from "@mui/material";
function GroupDetails() {
  const navigate = useNavigate();

  const {id} = useParams();

  const [user, setUser]  = useState("")

  const [members, setMembers] = useState([])

  const [owner, setOwner] = useState("")



 

   const getUserID = () => {
    
     fetch("http://localhost:5000/get_user_id", {
       method: "GET",
       headers: {
         "Content-Type": "application/json",
         Authorization: "Bearer " + sessionStorage.getItem("token"),
       },
     })
       .then((response) => {
         
         return response.json();
       })
       .then((data) => {
         console.log("userID:", data);
         setUser(data.userID);
       })
       .catch((error) => {
         console.log("error", error);
       });
   };

    useEffect(() => {
      console.log(id);
      getUserID();
      fetch("http://localhost:5000/group/get_group", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(id),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setMembers(data["members"]);
          setOwner(data["user"])
        });
    }, [user]);

  const removeMember = (fid) =>{
    fetch("http://localhost:5000/group/remove_member", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        friend: fid,
        gid: id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {console.log(data)});

  }

  return (
    <div className="w-full h-full ">
      <MainNavbar />

      <div className="p-5 w-90">
        <h1>Group {id} members</h1>

        {members.map((member, index) => (
          <div
            key={index}
            style={{
              margin: "3%",

              width: "80%",
              
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{ marginRight: "10px" ,cursor: "pointer",}}
              onClick={() => {
                navigate(`/friend/${member[0]}`);
              }}
            >
              {member[1]}
            </span>

            {owner == user ? <button
              style={{
                background: "",
                color: "",
                border: "1px solid #000",
                padding: "8px 16px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={()=>{removeMember(member[0])}}
            >
              remove member
            </button>: <></> }
            
          </div>
        ))}
      </div>
    </div>
  );
}

export default GroupDetails;
