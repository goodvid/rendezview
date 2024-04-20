import React from "react";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";

//import { withAuth } from "../withAuth";

function CreateGroups() {

    const [friends, setFriends] = useState([]);

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

    return (
        <div></div>
    );
}
export default CreateGroups;
