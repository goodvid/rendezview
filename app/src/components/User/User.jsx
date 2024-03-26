import React, { useState } from "react";
import { Link } from "react-router-dom";
function User({name, isFriend, relationship, id})  {

  // const [label, setLabel] = useState("Add friend");
  // const handleSubmit = () => {
  //   fetch("http://127.0.0.1:5000/add_friend", {
  //     method: "POST",
  //     headers: {
  //       Authorization: "Bearer " + sessionStorage.getItem("token"),
  //       "Content-Type": "application/json",

  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(id),
  //   }).then((res)=> {
  //     if (res.status == 200){
  //       setLabel("Added!")
  //     }

  //   });
  // }

        return (
          <div class="w-[80%] flex   justify-between">
            <div class=" text-left text-3xl font-bold">
              {name}
              {isFriend ? <div>{relationship}</div> : <div></div>}
            </div>

            {isFriend ? (
              <div></div>
            ) : (
              <button/*go to page */ class="bg-yellow-500   hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
                Add friend
              </button>
            )}
          </div>
        );
    }
    export default User