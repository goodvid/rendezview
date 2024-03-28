import { React, useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import User from "../../components/User/User";
function Friends(){
  const [username, setUsername] = useState("")
  const [users, setUsers] = useState([])
  const handleChange = (event) => {
    setUsername(event.target.value)
    console.log(username, event.target.value)

  }
  const handleSubmit = (event) => {
    console.log(username, "fjfjfj")
    fetch("http://127.0.0.1:5000/get_all_usernames", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
        "Content-Type": "application/json",

        "Content-Type": "application/json",
      },
      body: JSON.stringify(username),
    })
      .then((res) => {
        //setUsers(res.)
        return res.json();
      })
      .then((data) => {
        setUsers(data["names"]);
        console.log(data, users);
      });
  }
  return (
    <>
      <Navbar></Navbar>
      <div className="m-[5%] text-left ">
        <div className="text-3xl font-bold mb-[20%]">Enter Username</div>

        <input
          name="eventName"
          className=" w-[80%] h-[45px] border-login-blue outline rounded-md align-left"
          onChange={handleChange}
          value={username}
        ></input>
        <div className="">
          <button
            onClick={handleSubmit}
            class="w-[20%] h-[45px] bg-yellow-500 mt-5 text-white font-bold  rounded"
          >
            Search
          </button>
        </div>
      </div>
      <div>
        {users.map((user, _) => {
          console.log(user)
          return <User name={user.name} isFriend={user.isFriend} relationship={user.relationship} id={user.id} />;
        })}
      </div>
    </>
  );

  }
export default Friends