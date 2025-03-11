import React from "react";
import { useNavigate } from "react-router-dom"; 

const TrainingSection = ({ isAuthenticated, isUser }) => {
  const navigate = useNavigate(); 

  const cards = [
    {
      title: "Wildfire Prediction",
      description:
        "Serving humanity for a better and improved quality of life by making sure that everyone knows the best probability to check if the upcoming time is safe and secure and there are no or minor possibility for natural or accidental wildfires to happen in their surrounding...",
    },
    {
      title: "Resource Analysis",
      description:
        "Serving humanity for a better and improved quality of life by making sure that everyone knows the best probability to check if the upcoming time is safe and secure and there are no or minor possibility for natural or accidental wildfires to happen in their surrounding...",
    },
    {
      title: "Data Visualization",
      description:
        "Serving humanity for a better and improved quality of life by making sure that everyone knows the best probability to check if the upcoming time is safe and secure and there are no or minor possibility for natural or accidental wildfires to happen in their surrounding...",
    },
  ];

  const handleRedirect = () => {
    if (isAuthenticated) {
      navigate("/training-details"); 
    } else if (isUser === false) {
      navigate("/register"); 
    } else {
      navigate("/login");
    }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/aboutBG.jpg')" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      <div className="relative z-10 text-center max-w-4xl px-6">
        
        <h2 className="text-white text-4xl font-bold uppercase mb-6">
          How We Work
        </h2>

        
        <div className="flex flex-wrap justify-center gap-5">
          {cards.map((card, index) => (
            <div
              key={index}
              className="relative w-[260px] p-6 bg-white bg-opacity-10 backdrop-blur-md text-white text-left transition-all duration-300 hover:bg-opacity-20 hover:border-white border border-transparent"
            >
              <h3 className="text-lg font-bold mb-2">{card.title}</h3>
              <p className="text-sm">{card.description}</p>

              <div
                className="absolute bottom-4 right-4 text-white text-xl cursor-pointer hover:text-gray-300"
                onClick={handleRedirect}
              >
                ➜
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrainingSection;
