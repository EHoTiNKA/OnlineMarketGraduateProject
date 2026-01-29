import "./App.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import GeneralPage from "./pages/GeneralPage";
import AdminPage from "./pages/AdminPage";
import Zaglushka from "./pages/Zaglushka";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<GeneralPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/about-us" element={<Zaglushka />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
