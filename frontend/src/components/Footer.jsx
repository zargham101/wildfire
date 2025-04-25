import React from "react";
import { FaInstagram, FaFacebook, FaYoutube, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="relative text-white">
      {/* Background GIF */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/fire-background.gif" // Make sure this exists in public/images/
          alt="Fire background"
          className="w-full h-full object-cover opacity-20"
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-80 z-0"></div>

      {/* Footer Content */}
      <div className="relative z-10 max-w-screen-xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row justify-between gap-10">

          {/* Logo & Description */}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <img src="/images/logo.png" alt="FireZon Logo" className="h-12" />
              <span className="text-red-500 font-serif text-3xl font-bold tracking-wide">
                WildFire Watch
              </span>
            </div>
            <p className="text-gray-300 font-light">
              We monitor and report wildfires across regions to ensure safety and timely response.
              Our mission is to provide transparency and support emergency services.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex-1">
            <h3 className="text-white text-xl font-semibold border-b-2 border-red-500 pb-2 mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/" className="hover:text-red-400 transition">Home</Link></li>
              <li><Link to="/alerts" className="hover:text-red-400 transition">Fire Alerts</Link></li>
              <li><Link to="/resources" className="hover:text-red-400 transition">Safety Resources</Link></li>
              <li><Link to="/contact" className="hover:text-red-400 transition">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex-1">
            <h3 className="text-white text-xl font-semibold border-b-2 border-red-500 pb-2 mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-center gap-2"><FaEnvelope className="text-red-400" /> wildfirewatch@example.com</li>
              <li className="flex items-center gap-2"><FaPhone className="text-red-400" /> +123 456 7890</li>
              <li className="flex items-center gap-2"><FaMapMarkerAlt className="text-red-400" /> 123 Fire Lane, Smoke City, USA</li>
            </ul>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center mt-12 space-x-6">
          <SocialIcon icon={<FaInstagram size={22} />} url="#" />
          <SocialIcon icon={<FaFacebook size={22} />} url="#" />
          <SocialIcon icon={<FaYoutube size={22} />} url="https://www.youtube.com/" />
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 border-t border-red-500 pt-4 text-center text-sm text-gray-400">
          <p>&copy; 2025 WildFire Watch — All Rights Reserved</p>
          <p className="mt-1">Crafted with ❤️ by <span className="text-white">Hassnain & Kainat</span></p>
        </div>
      </div>
    </div>
  );
};

const SocialIcon = ({ icon, url }) => (
  <Link
    to={url}
    target="_blank"
    rel="noopener noreferrer"
    className="text-red-400 hover:text-white transition transform hover:scale-125 duration-300"
  >
    {icon}
  </Link>
);

export default Footer;
