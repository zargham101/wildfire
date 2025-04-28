import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Avatar from "./Avatar";
import UserProfileDropdown from "./UserProfileDropdown";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
    // Load user from localStorage when navbar mounts
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, [location]); // Watch location change too, in case login happens on another page

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 px-6 py-4 transition-all duration-300 ${
        isScrolled || location.pathname !== "/"
          ? "bg-white/80 backdrop-blur-md shadow-md border-b border-gray-200"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center text-black space-x-2">
          <div className="flex items-center h-10 mb-3">
            <img
              src="/images/logo.png"
              alt="WildfireWatch Logo"
              className="h-full object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold font-serif leading-tight">
            <span className="text-red-500">Wildfire</span>
            <span className="text-green-500">Watch</span>
          </h1>
        </div>

        {/* Navigation Links */}
        <ul className="hidden md:flex space-x-6 text-md font-medium font-serif text-gray-600">
          <li>
            <Link
              to="/"
              className={`hover:text-red-500 transition-all ${
                isActive("/") ? "text-red-500 border-b-2 border-red-500 pb-1" : ""
              }`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/aboutus"
              className={`hover:text-red-500 transition-all ${
                isActive("/aboutus") ? "text-red-500 border-b-2 border-red-500 pb-1" : ""
              }`}
            >
              About Us
            </Link>
          </li>
          <li>
            <Link
              to="/contactus"
              className={`hover:text-red-500 transition-all ${
                isActive("/contactus") ? "text-red-500 border-b-2 border-red-500 pb-1" : ""
              }`}
            >
              Contact Us
            </Link>
          </li>

          {user && (
            <>
              <li>
                <Link
                  to="/predictionHomePage"
                  className={`hover:text-red-500 transition-all ${
                    isActive("/predictionHomePage")
                      ? "text-red-500 border-b-2 border-red-500 pb-1"
                      : ""
                  }`}
                >
                  Prediction
                </Link>
              </li>
              
              <li>
                <Link
                  to="/predict/cam/result"
                  className={`hover:text-red-500 transition-all ${
                    isActive("/predict/cam/result")
                      ? "text-red-500 border-b-2 border-red-500 pb-1"
                      : ""
                  }`}
                >
                  Detection
                </Link>
              </li>
              <li>
                <Link
                  to="/feature-visualization"
                  className={`hover:text-red-500 transition-all ${
                    isActive("/feature-visualization")
                      ? "text-red-500 border-b-2 border-red-500 pb-1"
                      : ""
                  }`}
                >
                  Visualization
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Auth Buttons or Avatar */}
        {!user ? (
          <div className="flex items-center space-x-4 text-sm font-serif text-gray-700">
            <Link
              to="/login"
              className={`hover:text-red-500 transition-all ${
                isActive("/login") ? "text-red-500 underline" : ""
              }`}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className={`hover:text-red-500 transition-all ${
                isActive("/signup") ? "text-red-500 underline" : ""
              }`}
            >
              Sign Up
            </Link>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <Avatar user={user} />
            <UserProfileDropdown user={user} handleLogout={handleLogout} />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
