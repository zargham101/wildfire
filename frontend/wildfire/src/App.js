import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./components/LandingPage";
import Review from "./components/Review";
import Login from "./components/Login";
import Register from "./components/Register";
function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />  
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Review />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
