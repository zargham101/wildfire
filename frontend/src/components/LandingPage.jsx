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
        console.log("total users::",totalUsers)

        const reviewsResponse = await axios.get(
          "http://localhost:5001/api/review/getAllReview"
        );
        const totalReviews = reviewsResponse.data.totalReviews;
        console.log("total reviews::",totalReviews)

        // const predictionResponse = await axios.get(
        //   "http://localhost:5001/api/prediction/prediction-count"
        // );
        // const totalPredictions = predictionResponse.data.totalPredictions 
        // console.log("total predictions::",totalPredictions)

        setCounts({
          users: totalUsers,
          reviews: totalReviews,
          predictions: 100,
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
      const duration = 5000; 
      const stepTime = Math.abs(Math.floor(duration / end));

      const interval = setInterval(() => {
        start += 1;
        setDynamicCounts((prev) => ({
          ...prev,
          [setStateKey]: start,
        }));

        if (start === end) {
          clearInterval(interval);

          setTimeout(() => {
            setDynamicCounts((prev) => ({
              ...prev,
              [setStateKey]: 0,
            }));
            countUp(target, setStateKey); 
          }, 2000);
        }
      }, stepTime);
    };

    if (counts.users) countUp(counts.users, "users");
    if (counts.reviews) countUp(counts.reviews, "reviews");
    if (counts.predictions) countUp(counts.predictions, "predictions");
    if (counts.reports) countUp(counts.reports, "reports");
  }, [counts]);

  return (
    <div
      style={{
        backgroundImage: `url('images/texture.jpg')`,
        backgroundRepeat: "repeat",
      }}
    >
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
      <div className=" w-full flex justify-center items-center h-[500px] mt-6 relative z-0">
        <div className="flex w-full max-w-7xl mx-auto px-6">
          {/* Left side: Image */}
          <div className="w-1/2">
            <img
              src="/images/fire-committment.jpg"
              alt="Wildfire Watch"
              className="w-full h-[300px] pr-3 object-cover rounded-lg transition-all duration-300 hover:translate-y-2 hover:shadow-xl"
            />
          </div>

          {/* Right side: Text container with red border */}
          <div className="w-1/2 pl-6 border-l-4 border-red-500 p-6">
            <h2 className="text-2xl font-bold font-serif text-black mb-2">
              To Comunity
            </h2>
            <p className="text-lg font-serif text-gray-600">
              "WildFire watch makes it easy for you to live a life with no
              worrries and utmost safety from the unknown wild fire incidents
              and making sure the complete use of our team availability and
              guidance for the user to live a safe and happy life."
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 py-10">
        <div className="bg-red-700 w-[1200px] mr-[60px] ml-[70px] mt-[50px] p-1 relative">
          <p className="text-white font-serif  text-base ml-[15px]">
            Your safety is our priority
          </p>
          <div className="absolute left-0 top-1/2 p-1 transform -translate-y-1/2  rounded-full w-[10px] h-[10px] ml-1 shadow-lg border-2 border-white"></div>
          <div className="absolute right-0 top-1/2 p-1 transform -translate-y-1/2  rounded-full w-[10px] h-[10px] mr-1 shadow-lg border-2 border-white"></div>
        </div>
        <div className="text-center mb-12 mt-6">
          <h2 className="text-4xl font-extrabold text-center font-serif text-black ">
            Precautions
          </h2>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Card */}
          <div className="flex flex-col h-auto border rounded-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg group">
            <div className="relative group">
              <img
                src="/images/smoke-alarm.jpeg"
                alt="Precaution"
                className="w-full h-[300px] object-cover transition duration-300 ease-in-out group-hover:opacity-75"
              />
              {/* Heading always visible */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white opacity-100 transition-opacity duration-300  bg-opacity-100 p-4 text-center">
                <span className="font-bold text-2xl mb-[80px]">
                  #Protection
                </span>
              </div>
              {/* Line and other text hidden by default and visible on hover */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-red-500 bg-opacity-50 p-4 text-center">
                <hr className="border-t-2 border-white my-2 w-1/2 mx-auto" />
                <p className="mt-2 text-sm">
                  Install smoke alarms: Smoke alarms are essential for early
                  fire detection.
                </p>
              </div>
            </div>
          </div>

          {/* Second Card */}
          <div className="flex flex-col h-auto border rounded-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg group">
            <div className="relative group">
              <img
                src="/images/fire-escape.jpg"
                alt="Precaution"
                className="w-full h-[300px] object-cover transition duration-300 ease-in-out group-hover:opacity-75"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white opacity-100 transition-opacity duration-300  bg-opacity-100 p-4 text-center">
                <span className="font-bold text-2xl mb-[80px]">
                  #Preparedness
                </span>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-red-500 bg-opacity-50 p-4 text-center">
                <hr className="border-t-2 border-white my-2 w-1/2 mx-auto" />
                <p className="mt-2 text-sm">
                  Develop a fire escape plan: Having a well-rehearsed escape
                  plan can save lives.
                </p>
              </div>
            </div>
          </div>

          {/* Third Card */}
          <div className="flex flex-col h-auto border rounded-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg group">
            <div className="relative group">
              <img
                src="/images/prevention.jpeg"
                alt="Precaution"
                className="w-full h-[300px] object-cover transition duration-300 ease-in-out group-hover:opacity-75"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white opacity-100 transition-opacity duration-300  bg-opacity-100 p-4 text-center">
                <span className="font-bold text-2xl mb-[80px]">
                  #Prevention
                </span>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-red-500 bg-opacity-50 p-4 text-center">
                <hr className="border-t-2 border-white my-2 w-1/2 mx-auto" />
                <p className="mt-2 text-sm">
                  Store flammable materials safely: Keep flammable liquids and
                  materials away from heat sources.
                </p>
              </div>
            </div>
          </div>

          {/* Fourth Card */}
          <div className="flex flex-col h-auto border rounded-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg group">
            <div className="relative group">
              <img
                src="/images/vigilance.jpeg"
                alt="Precaution"
                className="w-full h-[300px] object-cover transition duration-300 ease-in-out group-hover:opacity-75"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white opacity-100 transition-opacity duration-300  bg-opacity-100 p-4 text-center">
                <span className="font-bold text-2xl mb-[80px]">#Vigilance</span>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-red-500 bg-opacity-50 p-4 text-center">
                <hr className="border-t-2 border-white my-2 w-1/2 mx-auto" />
                <p className="mt-2 text-sm">
                  Maintain electrical appliances: Regularly check appliances for
                  damage and avoid overloading outlets.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-red-700 w-[1200px] mr-[60px] ml-[70px] mt-[50px] p-3 relative">
          <div className="absolute left-0 top-1/2 p-1 transform -translate-y-1/2  rounded-full w-[10px] h-[10px] ml-1 shadow-lg border-2 border-white"></div>
          <div className="absolute right-0 top-1/2 p-1 transform -translate-y-1/2  rounded-full w-[10px] h-[10px] mr-1 shadow-lg border-2 border-white"></div>
        </div>
      </div>

      <div className=" py-12 border-2 shadow-lg p-3 rounded-md m-6">
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

      <div className="bg-red-700 w-[1200px] mr-[60px] ml-[70px] mt-[50px] p-1 relative">
        <p className="text-white font-serif  text-base ml-[15px]">
          Our Mission
        </p>
        <div className="absolute left-0 top-1/2 p-1 transform -translate-y-1/2  rounded-full w-[10px] h-[10px] ml-1 shadow-lg border-2 border-white"></div>
        <div className="absolute right-0 top-1/2 p-1 transform -translate-y-1/2  rounded-full w-[10px] h-[10px] mr-1 shadow-lg border-2 border-white"></div>
      </div>

      <div className="m-5 flex items-center">
        {/* Left side: Image */}
        <div className="w-1/2">
          <img
            src="/videos/graph.gif"
            alt="Wildfire Watch"
            className="w-[500px] h-[400px] ml-[150px] object-cover rounded-lg transition-all duration-300 hover:translate-y-2 hover:shadow-xl"
          />
        </div>

        {/* Right side: Text container with red border */}
        <div className="w-1/2 pl-5 border-l-4 border-red-500 border-solid p-5">
          <h2 className="text-black font-serif text-4xl text-left mb-[60px]">
            Monitor critical events and equip your yourself to
            manage its effects
          </h2>
          <p className="text-xl font-sans italic">
            "Wildfire Watch is a crucial platform for individuals and
            communities to predict and prevent devastating wildfires. By
            leveraging real-time data, we empower people to take the necessary
            precautions in time, potentially saving lives and reducing
            destruction."
          </p>
        </div>
      </div>

      <div className="bg-red-700 w-[1200px] mr-[60px] ml-[70px] mt-[50px] p-1 relative">
        <p className="text-white font-serif  text-base ml-[15px]">
          Related Content
        </p>
        <div className="absolute left-0 top-1/2 p-1 transform -translate-y-1/2  rounded-full w-[10px] h-[10px] ml-1 shadow-lg border-2 border-white"></div>
        <div className="absolute right-0 top-1/2 p-1 transform -translate-y-1/2  rounded-full w-[10px] h-[10px] mr-1 shadow-lg border-2 border-white"></div>
      </div>

      <div className="mt-[30px] mx-[85px] p-5">
        <Carousel />
      </div>
    </div>
  );
};

export default LandingPage;
