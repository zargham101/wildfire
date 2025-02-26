import React, { useState } from "react";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import FormatQuoteOutlinedIcon from '@mui/icons-material/FormatQuoteOutlined';

const AboutUs = () => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpansion = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      <div
        className="relative w-full h-[500px] bg-cover bg-center mt-20"
        style={{ backgroundImage: "url(/images/aboutHero.jpeg)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-700 opacity-50"></div>
        <div className="relative z-10 flex items-center justify-start h-full pl-10 text-white">
          <div className="max-w-lg">
            <h1 className="text-4xl font-bold">About Us</h1>
            <p className="mt-4 text-lg">
              We are dedicated to providing the best services for our customers
              and making a positive impact in the world. Our team is passionate
              about innovation and excellence.
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between px-10 py-10">
        <div className="w-1/2">
          <img
            src="/images/vision.jpg"
            alt="Our Vision"
            className="w-full h-full object-cover rounded-lg shadow-xl"
          />
        </div>
        <div className="w-1/2 bg-black text-white p-8 m-8 h-auto relative">
          <span className="absolute top-0 left-0 text-white text-6xl mb-8">
            <FormatQuoteOutlinedIcon sx={{fontSize: '6rem'}}/>
          </span>
          <p className="mt-16 text-xl mb-8">
            Our vision is to build a more sustainable and inclusive future. By
            working together, we can achieve great things and contribute to the
            well-being of the planet.
          </p>
        </div>
      </div>

      <div className="px-10 py-10 border-b-2 border-gray-300">
        <h2 className="text-3xl font-bold">Our Mission</h2>
        <p className="mt-4 text-lg">
          We strive to provide the highest quality service, create lasting
          relationships, and foster a culture of continuous improvement.
        </p>

        <div
          className="relative p-6 bg-slate-50 mt-6 border-2 rounded-md border-white hover:shadow-xl hover:translate-y-2 transition-all duration-300"
          style={{
            borderColor: "#f0f0f0",
          }}
        >
          <h1 className="mt-2 text-3xl font-serif font-semibold">
            Wilfire prediction
          </h1>
          <p className="text-base font-serif mt-1">
            Serving the humanity for a better and improved quality of life by
            making sure that everyone kow the best probabilty to check if the
            upcoming time is safe and secure and there are no or minor
            possibilty for natural or accidental wildfires to happen in there
            sorrounding...
          </p>
          <div
            className={`mt-4 overflow-hidden transition-all duration-500 ${
              expanded ? "h-auto" : "h-0"
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
            onClick={toggleExpansion}
            className="bg-white text-orange-500 px-3 py-2 rounded-full w-auto flex items-center justify-center mx-auto transition-all duration-500"
          >
            {expanded ? (
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
          className="relative p-6 bg-slate-50 mt-6 border-2 rounded-md border-white hover:shadow-xl hover:translate-y-2 transition-all duration-300"
          style={{
            borderColor: "#f0f0f0",
          }}
        >
          <h1 className="mt-2 text-3xl font-serif font-semibold">
            Resource analysis
          </h1>
          <p className="text-base font-serif mt-1">
            Serving the humanity for a better and improved quality of life by
            making sure that everyone kow the best probabilty to check if the
            upcoming time is safe and secure and there are no or minor
            possibilty for natural or accidental wildfires to happen in there
            sorrounding...
          </p>
          <div
            className={`mt-4 overflow-hidden transition-all duration-500 ${
              expanded ? "h-auto" : "h-0"
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
            onClick={toggleExpansion}
            className="bg-white text-orange-500 px-3 py-2 rounded-full w-auto flex items-center justify-center mx-auto transition-all duration-500"
          >
            {expanded ? (
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
          className="relative p-6 bg-slate-50 mt-6 border-2 rounded-md border-white hover:shadow-xl hover:translate-y-2 transition-all duration-300"
          style={{
            borderColor: "#f0f0f0",
          }}
        >
          <h1 className="mt-2 text-3xl font-serif font-semibold">
            Data Visualization
          </h1>
          <p className="text-base font-serif mt-1">
            Serving the humanity for a better and improved quality of life by
            making sure that everyone kow the best probabilty to check if the
            upcoming time is safe and secure and there are no or minor
            possibilty for natural or accidental wildfires to happen in there
            sorrounding...
          </p>
          <div
            className={`mt-4 overflow-hidden transition-all duration-500 ${
              expanded ? "h-auto" : "h-0"
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
            onClick={toggleExpansion}
            className="bg-white text-orange-500 px-3 py-2 rounded-full w-auto flex items-center justify-center mx-auto transition-all duration-500"
          >
            {expanded ? (
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
    </>
  );
};

export default AboutUs;
