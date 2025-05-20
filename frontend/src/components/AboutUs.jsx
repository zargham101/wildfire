import React from "react";
import FormatQuoteOutlinedIcon from "@mui/icons-material/FormatQuoteOutlined";
import FAQ from "./FAQ";
import ScrollingTextWithDots from "./ScrllingText";
import TrainingSection from "./TraainngSection";

const AboutUs = () => {
  return (
    <div
      style={{
        backgroundImage: `url('images/texture.jpg')`,
        backgroundRepeat: "repeat",
      }}
    >
      <div className="relative w-full h-[500px] mt-20">
        <img
          src="/images/aboutus.jpg"
          alt="About Us"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-600 opacity-70"></div>

        {/* Centered Text */}
        <div className="relative z-40 flex flex-col items-center justify-center h-full text-center text-white">
          <h1 className="text-6xl font-lato font-bold text-white mb-4">
            About Us
          </h1>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center w-full px-20 py-24 bg-transparent text-black gap-16">
        {/* Icon/Image Section */}
        <div className="flex-shrink-0 w-84 h-84 bg-black flex items-center justify-center rounded-md overflow-hidden shadow-xl">
          <img
            src="/images/fire13.jpg" // Your logo or small image
            alt="Icon"
            className="object-contain w-65 h-65"
          />
        </div>

        {/* Text Content Section */}
        <div className="flex font-bold font-playfair flex-col space-y-8 max-w-4xl">
          <h2 className="text-5xl font-bold">Our Mission</h2>
          <p className="italic text-2xl text-red-600">
            "Predicting wildfires to protect what matters most."
          </p>
          <p className="text-xl text-gray-600 leading-relaxed">
            At WildfireWatch, our mission is to harness technology to predict
            wildfires early, safeguard communities, and preserve our natural
            world for future generations...
          </p>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="bg-red-700 w-full max-w-[1200px] p-3 relative my-6 ">
          <div className="absolute left-0 top-1/2 p-1 transform -translate-y-1/2 rounded-full w-[10px] h-[10px] ml-1 shadow-lg border-2 border-white"></div>
          <div className="absolute right-0 top-1/2 p-1 transform -translate-y-1/2 rounded-full w-[10px] h-[10px] mr-1 shadow-lg border-2 border-white"></div>
        </div>
      </div>

      <div className="m-6 p-4">
        <TrainingSection />
      </div>

      <div className="flex justify-center">
        <div className="bg-red-700 w-full max-w-[1200px] p-3 relative my-6 ">
          <div className="absolute left-0 top-1/2 p-1 transform -translate-y-1/2 rounded-full w-[10px] h-[10px] ml-1 shadow-lg border-2 border-white"></div>
          <div className="absolute right-0 top-1/2 p-1 transform -translate-y-1/2 rounded-full w-[10px] h-[10px] mr-1 shadow-lg border-2 border-white"></div>
        </div>
      </div>

      <div className="justify-center m-[40px] p-6  opacity-80">
        <ScrollingTextWithDots />
      </div>

      <div className="flex justify-center">
        <div className="bg-red-700  w-full max-w-[1200px] p-1 relative my-6">
          <p className="text-white font-serif text-base ml-[15px]">
            What You Need To Know
          </p>
          <div className="absolute left-0 top-1/2 p-1 transform -translate-y-1/2 rounded-full w-[10px] h-[10px] ml-1 shadow-lg border-2 border-white"></div>
          <div className="absolute right-0 top-1/2 p-1 transform -translate-y-1/2 rounded-full w-[10px] h-[10px] mr-1 shadow-lg border-2 border-white"></div>
        </div>
      </div>

      <div className="mt-3 mx-auto w-full max-w-screen-lg">
        <FAQ />
      </div>
    </div>
  );
};

export default AboutUs;
