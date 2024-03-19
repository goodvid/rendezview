import React from "react";
import { Link } from "react-router-dom";
function User({name, isFriend, relationship, id})  {

        return (
          <Link to={"/userinfo" + id} class="w-[80%] flex   justify-between">
            <div class=" text-left text-3xl font-bold">
              {name}
              {isFriend ? <div>{relationship}</div> : <div></div>}
            </div>

            {isFriend ? (
              <div></div>
            ) : (
              <button class="bg-yellow-500   hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
                Add friend
              </button>
            )}
          </Link>
        );
    }
    export default User