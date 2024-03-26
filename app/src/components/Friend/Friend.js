import React from "react";
import { Link } from "react-router-dom";
import "./Friend.css";
import { Stack, Avatar, Button } from "@mui/material";

function Friend({id, name, relationship, profilePic}) {
    id = 1;
    name = "Name";
    relationship = "Relationship";
    profilePic = "/profile_pics/concert.jpg";

  return (
    <Link
        to={"/userinfo/" + id}
        className="w-[95%] h-[fit-content]"
    >
         <Stack
            direction="row"
            spacing={3}
            borderRadius="16px"
          >
            <Stack sx={{paddingTop: 1}}>
              <Avatar src={profilePic} sx={{ width: 85, height: 85}} />
            </Stack>
            <Stack direction="column" justifyContent="center">
              <h2
                style={{
                  textAlign: "left",
                  verticalAlign: "middle",
                }}
              >
                {name}
              </h2>
              <h3 
                style={{
                  textAlign: "left",
                  verticalAlign: "middle",
                }}
              >
                <em>{relationship.toUpperCase()}</em>
              </h3>
            </Stack>
            <Stack
              width="100%"
              direction="row"
              justifyContent="flex-end"
              gap="1rem"
            >
              <Stack direction="column" justifyContent="center" sx={{p: 2}}>
                <Button
                  justifyContent="center"
                  variant="contained"
                  color="inherit"
                  disableElevation
                  sx={{ backgroundColor: "#ECECEC", color: "black", textTransform: "none", height: "50px", width: "100px", borderRadius: "15px", "&:hover": { backgroundColor: "#FFA7A7", color: "black" }}}
                >
                  Remove
                </Button>
              </Stack>
            </Stack>
          </Stack>

        

        
    </Link>
    /*
    <Link
      to={"/userinfo/" + id}
      className="w-[90%] h-[fit-content] rounded-lg outline"
    >
      <div className="w-[80%] h-[80%] flex flex-row justify-center items-center gap-5 ">
        {<div className=" w-[180px] h-[180px] bg-light-gray">Image: {profilePic} </div>}
        <div className="w-[100%] h-[100%] flex flex-col p-[1rem]">
          <span className="text-left font-bold">{name}</span>
          {<span className="text-left">Tags</span>}
          <div className="text-left">Relationship: {relationship}</div>
        </div>
      </div>
    </Link>
    */
  );
}

export default Friend;
