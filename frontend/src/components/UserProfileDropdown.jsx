import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const UserProfileDropdown = ({ user, handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null); // Reference to the dropdown container

  const toggleDropdown = () => {
    setIsOpen((prevState) => !prevState);
  };

  // Close the dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false); // Close the dropdown if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside); // Listen for click outside
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Cleanup the event listener on unmount
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}> {/* Add ref here */}
      <button
        className="flex items-center space-x-2"
        onClick={toggleDropdown}
      >
        <span className="text-xl font-semibold text-gray-300">{user.name}</span>
        <span className="text-gray-700 text-xl">&#9662;</span>
      </button>

      {isOpen && (
        <div className="absolute mt-2 right-0 bg-white shadow-lg w-48 rounded-lg z-50">
          <ul className="space-y-2">
            <li>
              <Link
                to="/profile"
                className="block px-[70px] py-2 text-gray-700 hover:bg-gray-100 rounded-tl-lg rounded-tr-lg"
              >
                Profile
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="block w-full px-2 py-2 text-gray-700 hover:bg-gray-100 rounded-bl-lg rounded-br-lg"
              >
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;
