import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
function User({name, isFriend, relationship, id})  {
  const navigate = useNavigate()
  const eventLink = "/friend/" + id 
  

        return (
          <div class="w-[80%] flex   justify-between" style={{ margin: "1%" }}>
            <div class=" text-left text-xl font-bold my-3">
              {name}
              {isFriend ? <div className="text-md">status: {relationship}</div> : <div></div>}
            </div>

            {isFriend ? (
              <button
                onClick={() => navigate(eventLink)}
                class="bg-yellow-500   hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                style={{ padding: "1%" }}
              >
                View Profile
              </button>
            ) : (
              <button
                onClick={() => navigate(eventLink)}
                class="bg-yellow-500   hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                style={{ padding: "1%" }}
              >
                Add friend
              </button>
            )}
          </div>
        );
    }
    export default User