import React, { useState } from "react";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import FormatQuoteOutlinedIcon from "@mui/icons-material/FormatQuoteOutlined";
import FAQ from "./FAQ";
import ScrollingTextWithDots from "./ScrllingText";
import TrainingSection from "./TraainngSection";

const AboutUs = () => {
  const [expanded, setExpanded] = useState([false, false, false]);

  const toggleExpansion = (index) => {
    setExpanded((prev) =>
      prev.map((item, idx) => (idx === index ? !item : item))
    );
  };

  return (
    <>
      <div className="relative w-full h-[500px] mt-20">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
        >
          <source src="/videos/aboutus.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-700 opacity-50"></div>
        <div className="relative z-10 flex items-center justify-start h-full pl-10 text-white">
          <div className="max-w-lg bg-black opacity-80 p-5 rounded-lg mx-[350px]">
            <h1 className="text-4xl font-serif font-bold text-white">About Us</h1>
            <p className="mt-4 text-lg font-serif text-white">
              We are dedicated to providing the best services for our customers
              and making a positive impact in the world. Our team is passionate
              about innovation and excellence.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-10 py-10">
        <div className="w-1/2 relative">
          <img
            src="/images/vision.jpg"
            alt="Our Vision"
            className="w-full h-full object-cover rounded-lg shadow-xl"
          />
          <div className="absolute inset-0 bg-black text-white p-8 opacity-45">
            <span className="absolute top-0 left-0 text-white text-6xl mb-8">
              <FormatQuoteOutlinedIcon sx={{ fontSize: "6rem" }} />
            </span>
            <p className="mt-16 text-xl mb-8">
              Our vision is to build a more sustainable and inclusive future. By
              working together, we can achieve great things and contribute to
              the well-being of the planet.
            </p>
          </div>
        </div>
        <div className="w-1/2 h-[330px] ml-4 border-l-2 border-red-700">
          <p className="font-serif text-left text-lg mt-[15%] p-4">
            "Making this world a safe more predictable and secure place for the
            people living in it.Enhancing user experience to take precautions
            and make themselves feel safe with everything done before damage is
            something done amazinf and for this our team ad models help the
            world to make their living more safe more happy and worth every
            moment."
          </p>
        </div>
      </div>

      <div className="m-6 p-4">
      <TrainingSection/>
      </div>

      <div className="justify-center m-[40px] p-6 bg-black opacity-80 ">
        <ScrollingTextWithDots/>
      </div>
      <div className="mt-3 mx-[250px] w-full">
        <FAQ />
      </div>
      
    </>
  );
};

export default AboutUs;
