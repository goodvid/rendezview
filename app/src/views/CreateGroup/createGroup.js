import React from "react";
import { useState, useEffect } from "react";
import { Chip, Button } from "@mui/material";
import Navbar from "../../components/Navbar/Navbar";
import axios from "axios";

//import { withAuth } from "../withAuth";

function CreateGroups() {

    const [friends, setFriends] = useState([]);
    const [addFriends, setAddFriends] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/get_friends", {
            headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
            "Content-Type": "application/json",
            },
        })
        .then((res) => {
            if (res.data['status'] == 200) {
                setFriends(res.data['names']);
            }
        })
        .catch((err) => {
            console.log(err);
        });
    }, []);

    const addToGroup = (friend) => {
        console.log(addFriends.includes(friend));
        for (var i = 0; i < addFriends.length; i++) {
            if (addFriends[i] == friend) {
                addFriends.splice(i, 1);
                setAddFriends(addFriends);
                return;
            }
        }
        addFriends.push(friend);
        setAddFriends(addFriends);
        console.log(addFriends);
    }

    const createGroup = () => {
        const groupStr = Array.from(addFriends).join(',');
        axios.post("http://localhost:5000/create_group", {
            'groupStr': groupStr,
        }, {
            headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
            "Content-Type": "application/json",
            }
        })
        .then((res) => {
            if (res.data['status'] != 200) {
                console.log("Error creating group");
            }
        })
        .catch((err) => {
            console.log(err);
        });
        setAddFriends([]);
    }

    return (
        <div>
            <Navbar />
            <div className="flex flex-col items-center">
                <div className="mt-[40px] text-5xl">Choose Friends</div>
                <div className="w-[500px] h-[500px] mt-[40px] flex flex-col items-center outline outline-1 rounded-lg overflow-y-scroll">
                    {friends.map((friend, i) => {
                        return (
                            <Chip
                                key = {friend['name']}
                                label = {friend['name']}
                                variant={addFriends.includes(friend['name']) ? "filled" : "outlined"}
                                onClick={() => addToGroup(friend['name'])}
                                className="w-[40%] auto"
                                sx={{
                                    fontSize: '30px',
                                    width: '500px',
                                    height: 'auto',
                                    padding: '2px'
                                }}
                            />
                        );
                    })}
                </div>
                <Button
                onClick={createGroup}
                sx={{
                    backgroundColor: "#B8E2F2",
                    color: "black",
                    marginTop: "30px"
                }}
                >Create Group</Button>
            </div>
        </div>
    );
}
export default CreateGroups;
