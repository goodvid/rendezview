import "./App.css";
import Homepage from "./pages/Homepage";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Settings from "./pages/Settings"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path = "/" element = {<Settings />} />
          <Route path = "/Settings" element = {<Settings />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
