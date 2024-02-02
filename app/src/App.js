import "./App.css";
import {
  BrowserRouter as BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Homepage from "./pages/Homepage";
import Profile from "./pages/Profile";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
