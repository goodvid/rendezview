import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./views/Login/Login";
import React from "react";
import "./App.css";
import Main from "./views/Main";
import Username from "./views/Username/Username";
import Register from "./views/Register/Register";
import Profile from "./views/Profile/Profile";
import Quiz from "./views/Quiz/Quiz";
import Settings from "./views/Settings/Settings";
import EventDetails from "./views/EventDetails/EventDetails";
import CreateEvent from "./views/CreateEvent/createEvent";
import Events from "./views/Events/Events";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Settings />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/username" element={<Username />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/eventdetails/:id" element={<EventDetails />} />
          <Route path="/newevent" element={<CreateEvent/>}/>
          <Route path="/events" element={<Events />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
