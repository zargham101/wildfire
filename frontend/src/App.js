import Navbar from "./components/Navbar";
import {  Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Signup from "./components/SignUp";
import ContactUs from "./components/ContactUs"
import AboutUs from "./components/AboutUs";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ReserPassword";
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
