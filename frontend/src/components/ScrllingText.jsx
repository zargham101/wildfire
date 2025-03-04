import React, { useState, useEffect } from 'react';

const ScrollingTextWithDots = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const texts = [
    " Wildfire Watch - Stay Safe.",
    " Predict Fire Hazards with Advanced Technology.",
    " Keep your community safe with accurate predictions.",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 3000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full bg-black opacity-80">
      
      <img
        src="/images/scrolling.jpg"
        alt="Background"
        className="w-full h-[400px] object-cover opacity-30"
      />

      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col space-y-4">
          <div
            className={`text-white text-2xl font-bold text-center transition-opacity duration-500 ${activeIndex === 0 ? 'opacity-100' : 'opacity-0'}`}
          >
            {texts[0]}
          </div>
          <div
            className={`text-white text-2xl font-bold text-center transition-opacity duration-500 ${activeIndex === 1 ? 'opacity-100' : 'opacity-0'}`}
          >
            {texts[1]}
          </div>
          <div
            className={`text-white text-2xl font-bold text-center transition-opacity duration-500 ${activeIndex === 2 ? 'opacity-100' : 'opacity-0'}`}
          >
            {texts[2]}
          </div>
        </div>
      </div>

      {/* Dots to indicate active text */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {texts.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${activeIndex === index ? 'bg-white' : 'border-2 border-white'}`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default ScrollingTextWithDots;
