import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const images = [
  "/images/slide1.webp",
  "/images/slide2.webp",
  "/images/slide3.webp",
];

const ClimaChainSlider = () => {
  const [current, setCurrent] = useState(0);
  const [mounted, setMounted] = useState(false);

  const [activeFeature, setActiveFeature] = useState(null);
  const [activeDesc, setActiveDesc] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    "WildFire Size Prediction",
    "Wildfire Area Detection",
    "Visualization",
  ];

  const descriptions = [
    "1: Uplift in forecast accuracy",
    "2: Mapping of Burnt Area",
    "3: Enhanced User Experience",
  ];

  return (
    <div
      className={`flex flex-col md:flex-row items-center justify-center min-h-[450px] p-6 bg-gradient-to-br from-yellow-50 via-red-50 to-yellow-100 transition-opacity duration-1000 ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Slider */}
      <div className="relative w-[320px] h-[220px] md:w-[380px] md:h-[260px] overflow-hidden rounded-xl shadow-2xl transition-all duration-700">
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Slide ${index + 1}`}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              index === current ? "opacity-100 z-10 animate-fadeIn" : "opacity-0 z-0"
            }`}
          />
        ))}

        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none rounded-xl"></div>

        {/* Dots */}
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none transform ${
                index === current
                  ? "bg-red-600 shadow-lg scale-125 animate-bounce"
                  : "bg-red-300 hover:bg-red-500 scale-100"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Text content */}
      <div className="text-center md:text-left mt-6 md:mt-0 md:ml-8 max-w-md">
        <h2 className="text-xl md:text-2xl font-semibold mb-5 font-serif text-gray-900 drop-shadow-md animate-popUp cursor-pointer inline-block">
          <Link to="/" className="hover:text-red-700 transition-colors">
            What you can achieve with{" "}
            <span className="font-bold text-red-700">WildFireWatch*</span>
          </Link>
        </h2>

        <div className="flex flex-col md:flex-row justify-center md:justify-start space-y-4 md:space-y-0 md:space-x-8 text-left">
          {features.map((feature, idx) => (
            <div
              key={idx}
              style={{ animationDelay: `${idx * 0.3 + 0.5}s` }}
              onClick={() =>
                setActiveFeature(idx === activeFeature ? null : idx)
              }
              className={`text-lg font-bold drop-shadow-sm cursor-pointer select-none transition-all duration-300 ease-in-out animate-popUp opacity-0 
              ${
                activeFeature === idx
                  ? "text-white bg-red-600 rounded-lg px-3 py-1 shadow-lg"
                  : "text-red-600 hover:text-red-800 hover:bg-red-200 rounded-md px-2 py-1"
              }`}
            >
              {feature}
            </div>
          ))}
        </div>

        <div
          className="mt-5 text-xs text-gray-700 italic leading-relaxed space-y-1 animate-popUp opacity-0"
          style={{ animationDelay: "1.5s" }}
        >
          {descriptions.map((desc, idx) => (
            <p
              key={idx}
              onClick={() => setActiveDesc(idx === activeDesc ? null : idx)}
              className={`cursor-pointer select-none transition-all duration-300 ease-in-out px-3 py-1 rounded-md
              ${
                activeDesc === idx
                  ? "bg-red-600 text-white font-semibold shadow-lg"
                  : "hover:bg-red-200 hover:text-red-800"
              }`}
            >
              {desc}
            </p>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        @keyframes popUp {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease forwards;
        }
        .animate-popUp {
          animation: popUp 0.6s ease forwards;
        }
      `}</style>
    </div>
  );
};

export default ClimaChainSlider;
