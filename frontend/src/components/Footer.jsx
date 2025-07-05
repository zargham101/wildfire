import React, { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  Linkedin,
  Github,
  Flame,
  Shield,
  Activity,
  Globe,
  ChevronUp,
  ExternalLink
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = ({ isDarkMode = false }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = [
    { name: "Home", to: "/" },
    { name: "Dashboard", to: "/dashboard" },
    { name: "Predictions", to: "/predictions" },
    { name: "History", to: "/history" },
    { name: "About", to: "/about" },
    { name: "Contact", to: "/contact" }
  ];

  const socialLinks = [
    { icon: Instagram, url: "https://instagram.com", label: "Instagram" },
    { icon: Facebook, url: "https://facebook.com", label: "Facebook" },
    { icon: Twitter, url: "https://twitter.com", label: "Twitter" },
    { icon: Youtube, url: "https://youtube.com", label: "YouTube" },
    { icon: Linkedin, url: "https://linkedin.com", label: "LinkedIn" },
    { icon: Github, url: "https://github.com", label: "GitHub" }
  ];

  const features = [
    { icon: Flame, text: "Real-time Fire Detection" },
    { icon: Shield, text: "Advanced Risk Assessment" },
    { icon: Activity, text: "24/7 Monitoring" },
    { icon: Globe, text: "Global Coverage" }
  ];

  return (
    <footer className={`relative overflow-hidden transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900' 
        : 'bg-gradient-to-br from-gray-900 via-red-950 to-black'
    }`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-400/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-red-500 to-red-600 p-3 rounded-xl">
                  <Flame className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <Link
                  to="/"
                  className="text-3xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent hover:from-red-300 hover:to-red-500 transition-all duration-300"
                >
                  WildFire Watch
                </Link>
                <p className="text-gray-400 text-sm mt-1">AI-Powered Fire Detection</p>
              </div>
            </div>
            
            <p className="text-gray-300 leading-relaxed max-w-md">
              Advanced wildfire monitoring and prediction system using cutting-edge AI technology. 
              Protecting communities and environments through real-time risk assessment and early detection.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="p-2 bg-red-500/20 rounded-lg group-hover:bg-red-500/30 transition-colors">
                    <feature.icon className="w-4 h-4 text-red-400" />
                  </div>
                  <span className="text-gray-300 text-sm font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white relative">
              Quick Links
              <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full"></div>
            </h3>
            <ul className="space-y-3">
              {footerLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.to}
                    className="text-gray-300 hover:text-red-400 transition-all duration-300 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white relative">
              Contact Info
              <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full"></div>
            </h3>
            <div className="space-y-4">
              {[
                { icon: Mail, text: "wildfirewatch@example.com", href: "mailto:wildfirewatch@example.com" },
                { icon: Phone, text: "+1 (555) 123-4567", href: "tel:+15551234567" },
                { icon: MapPin, text: "123 Fire Safety Blvd, Alert City, CA 90210", href: "#" }
              ].map((contact, index) => (
                <a
                  key={index}
                  href={contact.href}
                  className="flex items-start space-x-3 text-gray-300 hover:text-red-400 transition-colors group"
                >
                  <div className="p-2 bg-red-500/20 rounded-lg group-hover:bg-red-500/30 transition-colors mt-0.5">
                    <contact.icon className="w-4 h-4 text-red-400" />
                  </div>
                  <span className="text-sm leading-relaxed">{contact.text}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gradient-to-r from-transparent via-red-500/30 to-transparent"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="bg-gradient-to-r from-red-500 to-red-600 w-16 h-1 rounded-full"></div>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="text-center space-y-6">
          <h3 className="text-xl font-bold text-white">Stay Connected</h3>
          <div className="flex justify-center space-x-4">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
                aria-label={social.label}
              >
                <div className="absolute inset-0 bg-red-500 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-red-500 hover:border-red-500 transition-all duration-300 transform hover:scale-110">
                  <social.icon className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © {currentYear} WildFire Watch. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Powered by advanced AI technology for wildfire detection and prevention.
              </p>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-red-400 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-red-400 transition-colors">
                Terms of Service
              </Link>
              <a 
                href="#" 
                className="text-gray-400 hover:text-red-400 transition-colors flex items-center space-x-1"
              >
                <span>API Docs</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 group"
          aria-label="Scroll to top"
        >
          <div className="absolute inset-0 bg-red-500 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
          <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-lg hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-110">
            <ChevronUp className="w-5 h-5 text-white" />
          </div>
        </button>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.3); }
          50% { box-shadow: 0 0 30px rgba(239, 68, 68, 0.6); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;