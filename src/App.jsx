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
import LaptopDetailPage from "./pages/LaptopDetailPage";
import CartPage from "./pages/CartPage";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<GeneralPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/about-us" element={<Zaglushka />} />
          <Route path="/sellout" element={<Zaglushka />} />
          <Route path="/auctions" element={<Zaglushka />} />
          <Route path="/laptop/:id" element={<LaptopDetailPage />} />
          <Route path="/basket" element={<CartPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
