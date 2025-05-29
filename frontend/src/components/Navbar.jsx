import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Avatar from "./Avatar";
import UserProfileDropdown from "./UserProfileDropdown";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);
  const [selectedToolLabel, setSelectedToolLabel] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const toolsLinks = [
    { label: "Prediction", path: "/predictionHomePage" },
    { label: "Detection", path: "/predict/cam/result" },
    { label: "Visualization", path: "/feature-visualization" },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const handleProtectedRouteClick = (e, path) => {
    if (!user) {
      e.preventDefault();
      navigate("/login");
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Set selected tool label based on current pathname and handle click outside
  useEffect(() => {
    const match = toolsLinks.find((link) => link.path === location.pathname);
    if (match) setSelectedToolLabel(match.label);
    else setSelectedToolLabel("");

    const handleClickOutside = (event) => {
      if (
        showToolsDropdown &&
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowToolsDropdown(false);
      }
    };

    if (showToolsDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [location.pathname, showToolsDropdown]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled || location.pathname !== "/"
          ? "bg-white/80 backdrop-blur-md shadow-md border-b border-gray-200"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 md:px-8 xl:px-12 2xl:px-16 py-4 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex-1 flex items-center space-x-3">
          <img
            src="/images/logo.png"
            alt="WildfireWatch Logo"
            className="h-10 md:h-12 xl:h-14 2xl:h-16 w-auto object-contain translate-y-[-5px]"
          />
          <h1 className="text-xl md:text-2xl xl:text-3xl font-bold font-serif leading-tight">
            <span className="text-red-500">Wildfire</span>
            <span className="text-green-500">Watch</span>
          </h1>
        </div>

        <ul className="flex flex-auto justify-center space-x-4 lg:space-x-6 xl:space-x-10 text-sm md:text-base xl:text-lg font-medium font-serif text-gray-600">
          {[
            { label: "Home", path: "/" }, 
            { label: "About Us", path: "/aboutus" }, 
            { label: "Contact Us", path: "/contactus" }
          ].map(({ label, path }) => (
            <li key={path}>
              <Link
                to={path}
                className={`hover:text-red-500 transition-all ${
                  isActive(path)
                    ? "text-red-500 border-b-2 border-red-500 pb-1"
                    : ""
                }`}
              >
                {label}
              </Link>
            </li>
          ))}

          <li className="relative">
            <button
              type="button"
              ref={buttonRef}
              onClick={() => setShowToolsDropdown((prev) => !prev)}
              className="flex items-center space-x-1 text-gray-700 hover:text-red-600 font-medium transition"
            >
              <span className="text-base md:text-lg font-serif">
                {selectedToolLabel || "Tools"}
              </span>
              <svg
                className="w-4 h-4 mt-[1px]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showToolsDropdown && (
              <ul 
                ref={dropdownRef}
                className="absolute left-0 mt-3 w-56 bg-white border rounded-md shadow-xl z-20 overflow-hidden"
              >
                {toolsLinks.map(({ label, path }) => {
                  const active = location.pathname === path;
                  return (
                    <li key={path}>
                      <Link
                        to={user ? path : "#"}
                        onClick={(e) => {
                          if (!user) {
                            handleProtectedRouteClick(e, path);
                          } else {
                            setSelectedToolLabel(label);
                            setShowToolsDropdown(false);
                          }
                        }}
                        className={`block px-5 py-3 text-base font-medium font-serif transition-all ${
                          active
                            ? "bg-red-600 text-white"
                            : "text-gray-700 hover:bg-red-100 hover:text-red-700"
                        }`}
                      >
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </li>
        </ul>

        {/* Right: Auth Section */}
        <div className="flex-1 flex justify-end items-center space-x-3">
          {!user ? (
            <>
              <Link
                to="/login"
                className={`hover:text-red-500 text-sm font-serif transition-all ${
                  isActive("/login") ? "text-red-500 underline" : ""
                }`}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className={`hover:text-red-500 text-sm font-serif transition-all ${
                  isActive("/signup") ? "text-red-500 underline" : ""
                }`}
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Avatar user={user} />
              <UserProfileDropdown user={user} handleLogout={handleLogout} />
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;