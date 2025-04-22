import React from "react";
import { FaInstagram, FaFacebook, FaTimes, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="bg-black text-white py-8">
      <div className="max-w-screen-xl mx-auto flex flex-col items-center text-center">
        <div className="flex items-center space-x-2 mb-4">
          <img src="/images/logo.png" alt="FireZon Logo" className="h-10" />
          <span className="text-orange-500 font-serif text-2xl font-bold">
            WildFire Watch
          </span>
        </div>
        <p className="text-sm mb-4 font-serif">
          Fire departments are organization within municipality county.
        </p>
        <div className="flex space-x-6 mb-4">
          <Link to="#" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-white">
            <FaInstagram size={24} />
          </Link>
          <Link to="#" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-white">
            <FaFacebook size={24} />
          </Link>
          <Link to="#" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-white">
            <FaTimes size={24} />
          </Link>
          <Link to="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-white">
            <FaYoutube size={24} />
          </Link>
        </div>
        <div className=" w-[1345px] border-t-2 border-orange-500 mt-8">
          <div className="text-sm text-gray-400 pt-4 font-serif">
            <p>&copy; 2025 - All Rights Reserved | Created By Hassnain & Kainat</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
