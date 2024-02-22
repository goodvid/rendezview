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
import Settings from "./views/Settings/Settings";
import ChangeUsername from "./views/Settings/ChangeUsername/ChangeUsername";
import ChangeEmail from "./views/Settings/ChangeEmail/ChangeEmail";
import ChangePassword from "./views/Settings/ChangePassword/ChangePassword";
import ResetPassword from "./views/ResetPassword/ResetPassword";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/username" element={<Username />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/eventdetails/:id" element={<EventDetails />} />
          <Route path="/new_event" element={<CreateEvent />} />
          <Route path="/events" element={<Events />} />
          <Route path="/edit_event" element={<EditEvent />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/changeusername" element={<ChangeUsername />} />
          <Route path="/changeemail" element={<ChangeEmail />} />
          <Route path="/changepassword" element={<ChangePassword />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
