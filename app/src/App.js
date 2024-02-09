import Homepage from "./pages/Homepage";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import React from 'react';
import './App.css';
import Main from './views/Main';
import Login from './views/Login/Login';
import Register from './views/Register/Register';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
