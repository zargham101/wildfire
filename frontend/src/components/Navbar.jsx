import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

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

        <ul className="flex space-x-5 text-black font-medium">
          <li>
            <Link to="#">Home</Link>
          </li>
          <li>
            <Link to="#">About Us</Link>
          </li>
          <li>
            <Link to="#">Contact Us</Link>
          </li>
          <li>
            <Link to="#">Login</Link>
          </li>
          <li>
            <Link to="#">Sign Up</Link>
          </li>
          {/* <li>
            <a href="#">Members</a>
          </li> */}
        </ul>

        <div className="flex items-center space-x-5 text-black">
          {/* <a href="#">EN/FR</a> */}
          <input className="border p-2" type="text" placeholder="Search" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
