import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./views/Login/Login";
import React from "react";
import "./App.css";
import Main from "./views/Main";
import Username from "./views/Username/Username";
import Register from "./views/Register/Register";
import Profile from "./views/Profile/Profile";
import Quiz from "./views/Quiz/Quiz";
import EventDetails from "./views/EventDetails/EventDetails";
import CreateEvent from "./views/CreateEvent/createEvent";
import Events from "./views/Events/Events";
import EditEvent from "./views/EditEvent/EditEvent";
import CreateBlog from "./views/CreateBlog/createBlog";
import EditBlog from "./views/EditBlog/EditBlog";
import BlogDetails from "./views/BlogDetails/BlogDetails";
import Blogs from "./views/Blogs/Blogs";
import Settings from "./views/Settings/Settings";
import ChangeUsername from "./views/Settings/ChangeUsername/ChangeUsername";
import ChangeEmail from "./views/Settings/ChangeEmail/ChangeEmail";
import ChangePassword from "./views/Settings/ChangePassword/ChangePassword";
import ChangeProfilePicture from "./views/Settings/ChangeProfilePic/ChangeProfilePic";
import ResetPassword from "./views/ResetPassword/ResetPassword";
import Test from "./views/Test/Test";
import FriendProfile from "./views/Friend/FriendProfile";
import Friends from "./views/Friend/AddFriends";
import FriendsList from "./views/Friend/FriendList";
import ProtectedRoute from "./views/withAuth";
import CreateGroups from "./views/CreateGroup/createGroup";
import ChangeLocation from "./views/Settings/ChangeLocation/ChangeLocation";
import Groups from "./views/Groups/Groups";
import GroupDetails from "./views/Groups/GroupDetails";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/username"
            element={
              <ProtectedRoute>
                <Username />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz"
            element={
              <ProtectedRoute>
                <Quiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/eventdetails/:id" element={<EventDetails />} />
          <Route
            path="/newevent"
            element={
              <ProtectedRoute>
                <CreateEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events"
            element={
              <ProtectedRoute>
                <Events />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit_event/:id"
            element={
              <ProtectedRoute>
                <EditEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/changeusername"
            element={
              <ProtectedRoute>
                <ChangeUsername />
              </ProtectedRoute>
            }
          />
          <Route
            path="/changeemail"
            element={
              <ProtectedRoute>
                <ChangeEmail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/changepassword"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/changeprofilepic" element={<ChangeProfilePicture />} />
          <Route path="/changeLocation" element={<ChangeLocation />} />
          <Route path="/test" element={<Test />} />
          <Route
            path="/friend/:id"
            element={
              <ProtectedRoute>
                <FriendProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addfriends"
            element={
              <ProtectedRoute>
                <Friends />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/profile/friends"
            element={
              <ProtectedRoute>
                <FriendsList />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/creategroups"
            element={
              <ProtectedRoute>
                <CreateGroups />
              </ProtectedRoute>
            }
          />
          <Route path="/blogdetails/:id" element={<BlogDetails />} />
          <Route
            path="/newblog"
            element={
              <ProtectedRoute>
                <CreateBlog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/blogs"
            element={
              <ProtectedRoute>
                <Blogs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editblog/:id"
            element={
              <ProtectedRoute>
                <EditBlog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/groups"
            element={
              <ProtectedRoute>
                <Groups />
              </ProtectedRoute>
            }
          />
          <Route
            path="/groupdetails/:id"
            element={
              <ProtectedRoute>
                <GroupDetails></GroupDetails>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
