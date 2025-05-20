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

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled || location.pathname !== "/"
          ? "bg-white/80 backdrop-blur-md shadow-md border-b border-gray-200"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 md:px-8 xl:px-12 2xl:px-16 py-4 flex items-center justify-between">
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

        {/* Middle - Navigation Links */}
        <ul className="flex flex-auto justify-center space-x-4 lg:space-x-6 xl:space-x-10 text-sm md:text-base xl:text-lg font-medium font-serif text-gray-600">
          {[
            { label: "Home", path: "/" },
            { label: "About Us", path: "/aboutus" },
            { label: "Contact Us", path: "/contactus" },
            { label: "Prediction", path: "/predictionHomePage" },
            { label: "Detection", path: "/predict/cam/result" },
            { label: "Visualization", path: "/feature-visualization" },
          ].map(({ label, path }) => (
            <li key={path}>
              <Link
                to={
                  user || ["/", "/aboutus", "/contactus"].includes(path)
                    ? path
                    : "#"
                }
                onClick={(e) =>
                  !user && !["/", "/aboutus", "/contactus"].includes(path)
                    ? handleProtectedRouteClick(e, path)
                    : undefined
                }
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
        </ul>

        {/* Right - Auth */}
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
