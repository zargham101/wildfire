import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Signup from "./components/SignUp";
import ContactUs from "./components/ContactUs";
import AboutUs from "./components/AboutUs";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ReserPassword";
import PredictionHomePage from "./components/PredictionHome";
import UserProfile from "./components/UserProfile";
import FeatureVisualizationPage from "./components/FeaturedVisualization";
import NewsDetail from "./components/NewsDetail";
import InstructionPage from "./components/InstructionPage";
import GoogleAuthSuccess from "./routes/GoogleAuthSuccess";
import FirePredictionUpload from "./components/FirePredictionUpload";
import ScrollToTop from "./components/ScrollToTop";
import axios from "axios";
import AdminDashboard from "./components/AdminDashboard";
import ConfirmOtp from "./components/ConfirmOTP";
import AgencyDashboard from "./components/AgencyDashboard";

function App() {
  const [news, setNews] = useState([]);
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage news={news} />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/predictionHomePage" element={<PredictionHomePage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/agency" element={<AgencyDashboard />} />
        <Route path="/confirm-otp" element={<ConfirmOtp />} />
        <Route
          path="/feature-visualization"
          element={<FeatureVisualizationPage />}
        />
        <Route path="/google-auth-success" element={<GoogleAuthSuccess />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/news/:id" element={<NewsDetail news={news} />} />
        <Route path="/instructions/:type" element={<InstructionPage />} />
        <Route path="/predict/cam/result" element={<FirePredictionUpload />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
