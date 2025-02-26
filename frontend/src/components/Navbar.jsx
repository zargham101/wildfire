import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

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

  const isLandingPage = location.pathname === "/";

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-10 p-5 border-b-2 border-white transition-colors duration-300 ${
        isLandingPage && !isScrolled ? "bg-transparent" : "bg-white"
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

        <ul className="flex space-x-5 text-gray-500 font-bold">
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
          <li>
            <Link
              to="/login"
              className={`px-3 py-2 transition-all duration-300 hover:text-red-500 ${
                isActive("/login") ? "border-b-2 border-red-500" : ""
              }`}
            >
              Login
            </Link>
          </li>
          <li>
            <Link
              to="/signup"
              className={`px-3 py-2 transition-all duration-300 hover:text-red-500 ${
                isActive("/signup") ? "border-b-2 border-red-500" : ""
              }`}
            >
              Sign Up
            </Link>
          </li>
          <li>
            <li className="relative group">
              <button className="focus:outline-none">More</button>

              {/* Dropdown menu */}
              <div className="absolute left-0 mt-2 space-y-2 bg-white shadow-lg w-auto opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 hover:opacity-100 hover:visible">
                <ul className="space-y-2">
                  <li>
                    <Link
                      to="#"
                      className="block px-4 py-2 transition-all duration-300 hover:bg-gray-100"
                    >
                      Wildfire prediction
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="#"
                      className="block px-4 py-2 transition-all duration-300 hover:bg-gray-100"
                    >
                      Resource analysis
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="#"
                      className="block px-4 py-2 transition-all duration-300 hover:bg-gray-100"
                    >
                      Data visualization
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
          </li>
        </ul>

        <div className="flex items-center space-x-5 text-black">
          <input className="border p-2" type="text" placeholder="Search" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
