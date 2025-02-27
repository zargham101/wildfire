import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import GroupIcon from "@mui/icons-material/Group";
import BatchPredictionIcon from "@mui/icons-material/BatchPrediction";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ReviewsIcon from "@mui/icons-material/Reviews";
import Carousel from "./Carousel";

const LandingPage = () => {
  
  const [counts, setCounts] = useState({
    reviews: 0,
    predictions: 0,
    reports: 0,
    users: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const usersResponse = await axios.get(
          "http://localhost:5001/api/user/all-users"
        );
        const totalUsers = usersResponse.data.totalUsers;

        const reviewsResponse = await axios.get(
          "http://localhost:5001/api/review/getAllReview"
        );
        const totalReviews = reviewsResponse.data.totalReviews;

        setCounts({
          users: totalUsers,
          reviews: totalReviews,
          predictions: 200,
          reports: 200,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCounts();
  }, []);

  const [dynamicCounts, setDynamicCounts] = useState({
    users: 0,
    reviews: 0,
    predictions: 0,
    reports: 0,
  });

  useEffect(() => {
    const countUp = (target, setStateKey) => {
      let start = 0;
      const end = target;
      const duration = 2000; // Duration of the count-up animation
      const stepTime = Math.abs(Math.floor(duration / end));

      const interval = setInterval(() => {
        start += 1;
        setDynamicCounts((prev) => ({
          ...prev,
          [setStateKey]: start,
        }));

        if (start === end) {
          clearInterval(interval);
        }
      }, stepTime);
    };

    if (counts.users) countUp(counts.users, "users");
    if (counts.reviews) countUp(counts.reviews, "reviews");
    if (counts.predictions) countUp(counts.predictions, "predictions");
    if (counts.reports) countUp(counts.reports, "reports");
  }, [counts]);

  return (
    <>
      <div className="relative w-full h-screen">
        <div className="absolute top-0 left-0 w-full h-full">
          <video
            className="w-full h-full object-cover filter blur-sm"
            autoPlay
            muted
            loop
          >
            <source
              src="https://www.iaff.org/wp-content/uploads/2024/02/Website-video-LOOP-v6A.mp4"
              type="video/mp4"
            />
          </video>
          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-40"></div>
        </div>
        <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 text-white text-6xl font-bold max-w-lg text-left">
          <h1 className="relative font-mono ">
            <span className="shimmering-effect text-red-500 pr-3">
              Wildfire{" "}
            </span>
            <span className="shimmering-effect text-green-500"> Watch</span>
          </h1>
          <p className="text-white text-left text-xl font-serif italic px-5">
            "Wildfire Watch: Predicting and Locating Fire Hazards Through
            Advanced Weather Analysis."
          </p>
          <div className="flex space-x-4 mt-3 px-2 ml-2">
            <Link
              to="/login"
              className="border-b-2 border-red-500 px-4 py-2 text-red-500 bg-transparent  hover:bg-white hover:text-red-500 transition-all duration-300 text-sm"
            >
              Join Us
            </Link>
            <button className="bg-red-500 text-white px-4 py-2  hover:bg-white hover:text-red-500 transition-all duration-300 text-sm">
              What We Do
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white w-full flex justify-center items-center h-[500px] mt-6 relative">
        <div className="flex items-center justify-center max-w-5xl w-full">
          <div className="flex-shrink-0 w-5/12 absolute top-0 right-0">
            <img
              src="/images/fire-committment.jpg"
              alt="Fire committment"
              className="w-full h-[550px] object-cover py-6 mb-3"
            />
          </div>
          <div className="text-center w-7/12 pl-6 bg-gray-500 relative z-10">
            <div className="flex items-center justify-center mb-4">
              <p className="text-black text-lg font-semibold font-serif italic pr-4 leading-tight">
                Our Commitment
              </p>
              <div className="flex-1 border-t-2 border-black"></div>
            </div>
            <h2 className="text-black text-left text-3xl font-extrabold font-serif mb-2">
              To Community
            </h2>
            <p className="text-black text-left text-lg font-serif italic px-1">
              "Wildfire Watch: Predicting and Locating Fire Hazards Through
              Advanced Weather Analysis."
            </p>
          </div>
        </div>
        <div className="absolute inset-0 bg-cover bg-center">
          <img src="/images/dotted.jpeg" alt="texture-bg" />
        </div>
      </div>

      <div className="bg-gray-100 py-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-center text-black">
            Precautions
          </h2>
        </div>

        <div className="max-w-8xl mx-auto flex flex-col gap-6">
          <div className="flex flex-col md:flex-row h-auto border rounded-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg">
            <div className="md:w-1/2 relative group p-0">
              {" "}
              <img
                src="/images/smoke-alarm.jpeg"
                alt="Precaution "
                className="w-full h-[300px] object-cover transition duration-300 ease-in-out group-hover:opacity-75"
              />
              <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-red-500 bg-opacity-50">
                <span className="font-bold text-2xl">Protection</span>
              </div>
            </div>
            <div className="w-full md:w-1/2 flex items-center p-6 md:pl-10 border-l-4 border-red-500">
              <p className="text-lg font-serif">
                Install smoke alarms: Smoke alarms are essential for early fire
                detection.
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row h-auto border rounded-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg">
            <div className="md:w-1/2 relative group p-0">
              <img
                src="/images/fire-escape.jpg"
                alt="Precaution "
                className="w-full h-[300px] object-cover transition duration-300 ease-in-out group-hover:opacity-75"
              />
              <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-red-500 bg-opacity-50">
                <span className="font-bold text-2xl">Preparedness</span>
              </div>
            </div>
            <div className="w-full md:w-1/2 flex items-center p-6 md:pl-10 border-l-4 border-red-500">
              <p className="text-lg font-serif">
                Develop a fire escape plan: Having a well-rehearsed escape plan
                can save lives.
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row h-auto border rounded-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg">
            <div className="md:w-1/2 relative group p-0">
              <img
                src="/images/prevention.jpeg"
                alt="Precaution "
                className="w-full h-[300px] object-cover transition duration-300 ease-in-out group-hover:opacity-75"
              />
              <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-red-500 bg-opacity-50">
                <span className="font-bold text-2xl">Prevention</span>
              </div>
            </div>
            <div className="w-full md:w-1/2 flex items-center p-6 md:pl-10 border-l-4 border-red-500">
              <p className="text-lg font-serif">
                Store flammable materials safely: Keep flammable liquids and
                materials away from heat sources.
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row h-auto border rounded-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg">
            <div className="md:w-1/2 relative group p-0">
              <img
                src="/images/vigilance.jpeg"
                alt="Precaution "
                className="w-full h-[300px] object-cover transition duration-300 ease-in-out group-hover:opacity-75"
              />
              <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-red-500 bg-opacity-50">
                <span className="font-bold text-2xl">Vigilance</span>
              </div>
            </div>
            <div className="w-full md:w-1/2 flex items-center p-6 md:pl-10 border-l-4 border-red-500">
              <p className="text-lg font-serif">
                Maintain electrical appliances: Regularly check appliances for
                damage and avoid overloading outlets.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white py-12 border-2 shadow-lg p-3 rounded-md m-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center">
            <GroupIcon style={{ fontSize: "4rem" }} className=" text-red-500" />
            <p className="text-3xl font-semibold">{dynamicCounts.users}</p>
            <p className="text-xl text-gray-600">Users</p>
          </div>
          <div className="flex flex-col items-center">
            <ReviewsIcon
              style={{ fontSize: "4rem" }}
              className="text-green-500"
            />
            <p className="text-3xl font-semibold">{dynamicCounts.reviews}</p>
            <p className="text-xl text-gray-600">Reviews</p>
          </div>
          <div className="flex flex-col items-center">
            <BatchPredictionIcon
              style={{ fontSize: "4rem" }}
              className=" text-blue-500"
            />
            <p className="text-3xl font-semibold">
              {dynamicCounts.predictions}
            </p>
            <p className="text-xl text-gray-600">Predictions</p>
          </div>
          <div className="flex flex-col items-center">
            <AssessmentIcon
              style={{ fontSize: "4rem" }}
              className="text-yellow-500"
            />
            <p className="text-3xl font-semibold">{dynamicCounts.reports}</p>
            <p className="text-xl text-gray-600">Reports</p>
          </div>
        </div>
      </div>
      <div className="m-5">
        <Carousel />
      </div>
    </>
  );
};

export default LandingPage;
