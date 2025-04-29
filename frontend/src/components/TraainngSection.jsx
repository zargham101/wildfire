import React from "react";
import { useNavigate } from "react-router-dom";

const TrainingSection = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('token') !== null;

  const cards = [
    {
      title: "Wildfire Prediction",
      description:"Helping you stay ahead of danger",
      detail:
        "Helping you stay ahead of danger. We predict the probability and size of upcoming wildfires based on weather and vegetation data — making sure you and your community can stay safe, alert, and prepared for whatever lies ahead.",
      image: "/images/wildfire-prediction.jpg", // Replace with your image path
    },
    {
      title: "Data Visualization",
      description:"Making Complex data simple",
      detail:
        "Making complex data simple. We transform wildfire trends, risks, and patterns into clear, interactive visuals. So you can quickly see, understand, and act — because knowledge should never be complicated in a crisis.",
      image: "/images/data-visualization.jpg", // Replace with your image path
    },
    {
      title: "Resource Analysis",
      description:"Empowering smarter actions",
      detail:
        "Empowering smarter action. We analyze crucial resources — from firefighting teams to equipment — ensuring that when the threat arises, every second and every move counts toward protecting life and nature.",
      image: "/images/resource-analysis.jpg", // Replace with your image path
    },
    {
      title: "Wildfire Detection",
      description:"Spotting Wildfires before they spread",
      detail:
        "Spotting wildfires before they spread, saving lives and protecting communities. We detect and assess wildfires in real time using satellite imagery and AI — ensuring you and your community can stay ahead of the danger, stay informed, and take action before it's too late.",
      image: "/images/wildfire-detection.jpg", // Replace with your image path
    },
  ];
  
  const handleRedirect = () => {
    if (isAuthenticated) {
      navigate("/predictionHomePage");
    }else {
      navigate("/login");
    }
  };

  return (
    <div className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6">
        <h2 className="text-red-600 text-4xl font-bold uppercase mb-12 text-center">
          How We Make a Difference
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 border-red-500 transform hover:-translate-y-2 hover:scale-105 cursor-pointer"
              onClick={handleRedirect}
            >
              {/* Card Image */}
              <div className="h-48 overflow-hidden">
                <img 
                  src={card.image} 
                  alt={card.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Card Content */}
              <div className="p-6 text-centre">
                <h3 className="text-xl font-bold mb-4 text-gray-800 text-centre">{card.title}</h3>
                <p className="text-red-600 font-bold mb-6 text-centre">{card.description}</p>
                <p className="text-gray-600 mb-6">{card.detail}</p>
                <div className="flex justify-end">
                  <button 
                    className="text-red-600 hover:text-red-800 font-bold py-2 px-4 rounded-full transition-colors duration-300 flex items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRedirect();
                    }}
                  >
                    Learn More 
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </div>

              {/* Glow Effect on Hover */}
              <div className="absolute inset-0 rounded-xl pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-red-100 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrainingSection;