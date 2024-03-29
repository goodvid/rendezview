import User from "../../components/User/User"
import { useEffect, useState } from "react"
import Navbar from "../../components/Navbar/Navbar";
function FriendsList(){

    const [friends, setFriends] = useState([])
    const [requests, setRequests] = useState([]);
    const [show, setShow] = useState(false)
    useEffect(()=>{
        fetch("http://127.0.0.1:5000/get_friends", {
          method: "GET",
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
            "Content-Type": "application/json",

            "Content-Type": "application/json",
          },
          
        }).then((res)=>{
            if( res.status == 200){
                setShow(true)
                
                return res.json()
                
                
            }
        }).then((data)=>{
          console.log(data)
          if (data["names"]){
            console.log(data["names"]);
            setFriends(data["names"]);
          }
          if (data["requests"]){
            setRequests(data["requests"])
          }

         
            
        });
    }, [])
    return (
      <div>
        <Navbar></Navbar>
        {show ? (
          <div style={{ margin: "3%" }}>
            {requests.length >= 1 ? (
              <h3 className="text-left text-3xl font-bold">Friend Requests </h3>
            ) : (
              <></>
            )}

            {requests.map((user, _) => {
              return (
                <User
                  name={user.name}
                  isFriend={user.isFriend}
                  relationship={user.relationship}
                  id={user.id}
                />
              );
            })}
            <h3 className="text-left text-3xl font-bold">Friends</h3>
            {friends.map((user, _) => {
              console.log(user);
              return (
                <User
                  name={user.name}
                  isFriend={user.isFriend}
                  relationship={user.relationship}
                  id={user.id}
                />
              );
            })}
          </div>
        ) : (
          <h1 className="text-center text-3xl font-bold ">No friends</h1>
        )}
      </div>
    );
}

export default FriendsList