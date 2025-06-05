import React from "react";
import {
  FaInstagram,
  FaFacebook,
  FaYoutube,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative bg-gray-900 text-gray-300 select-none">
      {/* Background GIF + lighter overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/fire-background.gif"
          alt="Fire background"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>

      {/* Content */}
      <div
        className="relative z-10 max-w-screen-xl mx-auto px-6 py-8
          grid grid-cols-1 md:grid-cols-3 gap-8
          animate-inspireFade"
      >
        {/* Logo & Description */}
        <div className="flex flex-col space-y-3 animate-inspireFade delay-100">
          <div className="flex items-center space-x-3 mb-1">
            <img src="/images/logo.png" alt="FireZon Logo" className="h-8" />
            <Link
              to="/"
              className="text-red-500 font-serif text-xl font-extrabold tracking-wide drop-shadow-md hover:text-red-400 transition transform hover:scale-110"
            >
              WildFire Watch
            </Link>
          </div>
          <p className="text-gray-400 font-light leading-relaxed text-sm max-w-sm">
            We monitor and report wildfires across regions to ensure safety and
            timely response. Our mission is to provide transparency and support
            emergency services.
          </p>
        </div>

        {/* Quick Links */}
        <div className="animate-inspireFade delay-200">
          <h3 className="text-white text-lg font-semibold border-b-2 border-red-500 pb-1 mb-3 tracking-wide">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm text-gray-400">
            {[
              { name: "Home", to: "/" },
              { name: "About", to: "/aboutus" },
              { name: "Contact Us", to: "/contactus" },
            ].map(({ name, to }) => (
              <li
                key={name}
                className="hover:text-red-400 transition cursor-pointer"
              >
                <Link to={to}>{name}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="animate-inspireFade delay-300">
          <h3 className="text-white text-lg font-semibold border-b-2 border-red-500 pb-1 mb-3 tracking-wide">
            Contact
          </h3>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex items-center gap-2 hover:text-red-400 transition cursor-default">
              <FaEnvelope className="text-red-400 w-5 h-5" />
              wildfirewatch@example.com
            </li>
            <li className="flex items-center gap-2 hover:text-red-400 transition cursor-default">
              <FaPhone className="text-red-400 w-5 h-5" />
              +123 456 7890
            </li>
            <li className="flex items-center gap-2 hover:text-red-400 transition cursor-default">
              <FaMapMarkerAlt className="text-red-400 w-5 h-5" />
              123 Fire Lane, Smoke City, USA
            </li>
          </ul>
        </div>
      </div>

      {/* Social Icons */}
      <div className="relative z-5 flex justify-center space-x-6 mb-1 animate-bounceIn delay-400">
        <SocialIcon icon={<FaInstagram size={24} />} url="#" />
        <SocialIcon icon={<FaFacebook size={24} />} url="#" />
        <ExternalSocialIcon icon={<FaYoutube size={24} />} url="https://www.youtube.com/" />
      </div>

      {/* Footer Bottom */}
      <div className="relative z-10 border-t border-red-600 pt-3 pb-4 text-center text-xs text-gray-500 tracking-wide select-text animate-inspireFade delay-500">
        <p>&copy; 2025 WildFire Watch — All Rights Reserved</p>
      
      </div>

      {/* Animations */}
      <style>{`
        @keyframes inspireFade {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
            filter: drop-shadow(0 0 0 transparent);
          }
          60% {
            opacity: 1;
            transform: translateY(0) scale(1.05);
            filter: drop-shadow(0 0 8px rgba(255, 69, 0, 0.8));
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: drop-shadow(0 0 4px rgba(255, 69, 0, 0.6));
          }
        }
        .animate-inspireFade {
          animation: inspireFade 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          opacity: 0;
        }
        
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.5) translateY(50px);
            filter: drop-shadow(0 0 0 transparent);
          }
          60% {
            opacity: 1;
            transform: scale(1.2) translateY(-10px);
            filter: drop-shadow(0 0 10px rgba(255, 69, 0, 0.9));
          }
          80% {
            transform: scale(0.95) translateY(0);
            filter: drop-shadow(0 0 6px rgba(255, 69, 0, 0.7));
          }
          100% {
            transform: scale(1) translateY(0);
            filter: drop-shadow(0 0 4px rgba(255, 69, 0, 0.5));
          }
        }
        .animate-bounceIn {
          animation: bounceIn 0.9s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          opacity: 0;
        }

        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
      `}</style>
    </footer>
  );
};

const SocialIcon = ({ icon, url }) => (
  <Link
    to={url}
    className="flex items-center justify-center w-10 h-10 rounded-full bg-red-600 text-white transition transform hover:scale-125 duration-300 shadow-lg"
    style={{ filter: "drop-shadow(0 0 6px rgba(255,69,0,0.8))" }}
  >
    {icon}
  </Link>
);

const ExternalSocialIcon = ({ icon, url }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-center w-10 h-10 rounded-full bg-red-600 text-white transition transform hover:scale-125 duration-300 shadow-lg"
    style={{ filter: "drop-shadow(0 0 6px rgba(255,69,0,0.8))" }}
  >
    {icon}
  </a>
);

export default Footer;
