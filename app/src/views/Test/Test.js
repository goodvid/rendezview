import React from "react";
import axios from "axios";
import "./Test.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Test() {
    const [status, setStatus] = useState("");
    const updateStatus = (event) => {
        if (event != null) {
            setStatus(event.target.value);
        }
    };
    const onClick = () => {
        axios
        .post("http://localhost:5000/set_status", {
            headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
            "Content-Type": "application/json",
            },
            status: status
        })
        .then((res) => {
            console.log(res.data["events"]);
        });
    }
    return (
        <div className="bg-gray-500">
            <input onChange={updateStatus}></input>
            <button onClick={onClick(status)}>Set</button>
        </div>
    );
}

export default Test;
