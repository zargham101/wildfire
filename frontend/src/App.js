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
import PredictionHomePage from "./components/PredictionHome";
import UserProfile from "./components/UserProfile";
import FeatureVisualizationPage from "./components/FeaturedVisualization";
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
        <Route path="/predictionHomePage" element={<PredictionHomePage />} />
        <Route path="/feature-visualization" element={<FeatureVisualizationPage />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
