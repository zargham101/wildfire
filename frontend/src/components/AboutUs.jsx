import React, { useState } from "react";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import FormatQuoteOutlinedIcon from "@mui/icons-material/FormatQuoteOutlined";
import FAQ from "./FAQ";
import ScrollingTextWithDots from "./ScrllingText";

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

      <div className="px-10 py-10 bg-black opacity-90 border-b-2 border-gray-300">
        <h2 className="font-serif text-3xl font-bold text-slate-300">Our Mission</h2>
        <p className="font-serif text-xl mt-4 text-lg text-slate-300">
          We strive to provide the highest quality service, create lasting
          relationships, and foster a culture of continuous improvement.
        </p>

        <div
          className="relative p-6 mt-6 border-2 rounded-md hover:bg-gradient-to-r from-neutral-500 via-slate-600 to-slate-700 transition-all duration-500"
          style={{
            borderColor: "#f0f0f0",
          }}
        >
          <h1 className="mt-2 text-3xl font-serif font-semibold text-slate-300">
            Wildfire Prediction
          </h1>
          <p className="text-lg font-serif mt-1 text-slate-300">
            Serving humanity for a better and improved quality of life by making
            sure that everyone knows the best probability to check if the
            upcoming time is safe and secure and there are no or minor
            possibility for natural or accidental wildfires to happen in their
            surrounding...
          </p>
          <div
            className={`mt-4 overflow-hidden transition-all duration-500 ${
              expanded[0] ? "h-auto" : "h-0"
            }`}
            style={{ transition: "height 0.5s ease-out" }}
          >
            <ul className="list-disc pl-5">
              <li>Promoting sustainability in all aspects of our work.</li>
              <li>Empowering people through innovation and technology.</li>
              <li>Ensuring a positive impact on the communities we serve.</li>
              <li>
                Fostering collaboration and teamwork across all departments.
              </li>
            </ul>
            <a
              href="/new-page"
              className="bg-orange-500 text-white px-6 py-3 rounded-full inline-block mt-6"
            >
              Learn More
            </a>
          </div>

          <button
            onClick={() => toggleExpansion(0)}
            className="bg-white text-orange-500 px-3 py-2 rounded-full w-auto flex items-center justify-center mx-auto transition-all duration-500"
          >
            {expanded[0] ? (
              <>
                Expand Less{" "}
                <span className="ml-2 text-2xl">
                  <KeyboardDoubleArrowUpIcon />
                </span>
              </>
            ) : (
              <>
                Expand More{" "}
                <span className="ml-2 text-2xl">
                  <KeyboardDoubleArrowDownIcon />
                </span>
              </>
            )}
          </button>
        </div>

        <div
          className="relative p-6 mt-6 border-2 rounded-md hover:bg-gradient-to-r from-neutral-500 via-slate-600 to-slate-700 transition-all duration-500"
          style={{
            borderColor: "#f0f0f0",
          }}
        >
          <h1 className="mt-2 text-3xl font-serif font-semibold text-slate-300">
            Resource Analysis
          </h1>
          <p className="text-base font-serif mt-1 text-slate-300">
            Serving humanity for a better and improved quality of life by making
            sure that everyone knows the best probability to check if the
            upcoming time is safe and secure and there are no or minor
            possibility for natural or accidental wildfires to happen in their
            surrounding...
          </p>
          <div
            className={`mt-4 overflow-hidden transition-all duration-500 ${
              expanded[1] ? "h-auto" : "h-0"
            }`}
            style={{ transition: "height 0.5s ease-out" }}
          >
            <ul className="list-disc pl-5">
              <li>Promoting sustainability in all aspects of our work.</li>
              <li>Empowering people through innovation and technology.</li>
              <li>Ensuring a positive impact on the communities we serve.</li>
              <li>
                Fostering collaboration and teamwork across all departments.
              </li>
            </ul>
            <a
              href="/new-page"
              className="bg-orange-500 text-white px-6 py-3 rounded-full inline-block mt-6"
            >
              Learn More
            </a>
          </div>

          <button
            onClick={() => toggleExpansion(1)}
            className="bg-white text-orange-500 px-3 py-2 rounded-full w-auto flex items-center justify-center mx-auto transition-all duration-500"
          >
            {expanded[1] ? (
              <>
                Expand Less{" "}
                <span className="ml-2 text-2xl">
                  <KeyboardDoubleArrowUpIcon />
                </span>
              </>
            ) : (
              <>
                Expand More{" "}
                <span className="ml-2 text-2xl">
                  <KeyboardDoubleArrowDownIcon />
                </span>
              </>
            )}
          </button>
        </div>

        <div
          className="relative p-6 mt-6 border-2 rounded-md hover:bg-gradient-to-r from-neutral-500 via-slate-600 to-slate-700 transition-all duration-500"
          style={{
            borderColor: "#f0f0f0",
          }}
        >
          <h1 className="mt-2 text-3xl font-serif font-semibold text-slate-300">
            Data Visualization
          </h1>
          <p className="text-base font-serif mt-1 text-slate-300">
            Serving humanity for a better and improved quality of life by making
            sure that everyone knows the best probability to check if the
            upcoming time is safe and secure and there are no or minor
            possibility for natural or accidental wildfires to happen in their
            surrounding...
          </p>
          <div
            className={`mt-4 overflow-hidden transition-all duration-500 ${
              expanded[2] ? "h-auto" : "h-0"
            }`}
            style={{ transition: "height 0.5s ease-out" }}
          >
            <ul className="list-disc pl-5">
              <li>Promoting sustainability in all aspects of our work.</li>
              <li>Empowering people through innovation and technology.</li>
              <li>Ensuring a positive impact on the communities we serve.</li>
              <li>
                Fostering collaboration and teamwork across all departments.
              </li>
            </ul>
            <a
              href="/new-page"
              className="bg-orange-500 text-white px-6 py-3 rounded-full inline-block mt-6"
            >
              Learn More
            </a>
          </div>

          <button
            onClick={() => toggleExpansion(2)}
            className="bg-white text-orange-500 px-3 py-2 rounded-full w-auto flex items-center justify-center mx-auto transition-all duration-500"
          >
            {expanded[2] ? (
              <>
                Expand Less{" "}
                <span className="ml-2 text-2xl">
                  <KeyboardDoubleArrowUpIcon />
                </span>
              </>
            ) : (
              <>
                Expand More{" "}
                <span className="ml-2 text-2xl">
                  <KeyboardDoubleArrowDownIcon />
                </span>
              </>
            )}
          </button>
        </div>
      </div>
      <div className="justify-center mt-4 bg-black opacity-80 ">
        <ScrollingTextWithDots/>
      </div>
      <div className="mt-3 mx-[250px] w-full">
        <FAQ />
      </div>
    </>
  );
};

export default AboutUs;
