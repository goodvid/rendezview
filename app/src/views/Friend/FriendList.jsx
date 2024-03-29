import User from "../../components/User/User"
import { useEffect, useState } from "react"
import Navbar from "../../components/Navbar/Navbar";
function FriendsList(){

    const [friends, setFriends] = useState([])
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
                return res.json()
            }
        }).then((data)=>{
            setFriends(data["names"])
            console.log(friends, data)
        });
    })
    return (
      <>
      <Navbar></Navbar>
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
      </>
    );
}

export default FriendsList