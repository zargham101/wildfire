import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Avatar from "./Avatar";
import UserProfileDropdown from "./UserProfileDropdown";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
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
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, [location]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 p-5 border-b-2 border-white transition-colors duration-300 ${
        location.pathname === "/" && !isScrolled ? "bg-transparent" : "bg-white"
      }`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2 text-black">
          <img
            src="/images/logo.png"
            alt="WildfireWatch Logo"
            className="h-8"
          />
          <h1 className="text-xl font-bold">
            <span className="text-red-500">Wildfire</span>
            <span className="text-green-500">Watch</span>
          </h1>
        </div>

        <ul className="flex space-x-5 text-gray-500 font-bold mx-auto">
          <li>
            <Link
              to="/"
              className={`px-3 py-2 transition-all duration-300 hover:text-red-500 ${
                isActive("/") ? "border-b-2 border-red-500" : ""
              }`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/aboutus"
              className={`px-3 py-2 transition-all duration-300 hover:text-red-500 ${
                isActive("/aboutus") ? "border-b-2 border-red-500" : ""
              }`}
            >
              About Us
            </Link>
          </li>
          <li>
            <Link
              to="/contactus"
              className={`px-3 py-2 transition-all duration-300 hover:text-red-500 ${
                isActive("/contactus") ? "border-b-2 border-red-500" : ""
              }`}
            >
              Contact Us
            </Link>
          </li>
          {user && (
            <>
              <li>
                <Link
                  to="/prediction-home"
                  className={`px-3 py-2 transition-all duration-300 hover:text-red-500 ${
                    isActive("/prediction-home")
                      ? "border-b-2 border-red-500"
                      : ""
                  }`}
                >
                  Prediction Home Page
                </Link>
              </li>
              <li>
                <Link
                  to="/weather-prediction"
                  className={`px-3 py-2 transition-all duration-300 hover:text-red-500 ${
                    isActive("/weather-prediction")
                      ? "border-b-2 border-red-500"
                      : ""
                  }`}
                >
                  Weather Prediction
                </Link>
              </li>
              <li>
                <Link
                  to="/generate-reports"
                  className={`px-3 py-2 transition-all duration-300 hover:text-red-500 ${
                    isActive("/generate-reports")
                      ? "border-b-2 border-red-500"
                      : ""
                  }`}
                >
                  Generate Reports
                </Link>
              </li>
            </>
          )}
        </ul>

        {!user && (
          <div className="flex items-center space-x-5 text-gray-500 font-bold">
            <Link
              to="/login"
              className={`px-3 py-2 transition-all duration-300 hover:text-red-500 ${
                isActive("/login") ? "border-b-2 border-red-500" : ""
              }`}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className={`px-3 py-2 transition-all duration-300 hover:text-red-500 ${
                isActive("/signup") ? "border-b-2 border-red-500" : ""
              }`}
            >
              Sign Up
            </Link>
          </div>
        )}

        {user && (
          <div className="flex items-center space-x-3 mr-4 mt-1">
            <Avatar user={user} />

            <UserProfileDropdown user={user} handleLogout={handleLogout} />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
