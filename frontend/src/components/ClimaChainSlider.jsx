import React, { useEffect, useState } from "react";

const images = [
  "/images/slide1.webp",
  "/images/slide2.webp",
  "/images/slide3.webp",
];

const ClimaChainSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col md:flex-row items-center justify-center  min-h-screen  p-14">
      <div className="relative w-[500px] h-[350px] md:w-[700px] md:h-[450px] overflow-hidden rounded-lg shadow-lg transition-all duration-500">
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Slide ${index + 1}`}
            className={`absolute top-0 left-0 w-full h-full object-contain transition-opacity duration-500 ease-in-out ${
              index === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          />
        ))}

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === current ? "bg-gray-800" : "bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="text-center md:text-left mt-10 md:mt-0 md:ml-16 max-w-xl">
        <h2 className="text-2xl font-semibold mb-6 font-serif text-black">
          What you can achieve with <span className="font-bold">WildFireWatch*</span>
        </h2>

        <div className="flex justify-center md:justify-start space-x-8 text-left">
          <div>
            <p className="text-2xl font-bold text-red-600">WildFire Size Prediction</p>
            <p className="text-sm text-red-600"></p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600">Wildfire Area Detection</p>
            
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600">Visualization</p>
      
          </div>
        </div>

        <div className="mt-6 text-xs text-black italic leading-snug">
          <p>1: Uplift in forecast accuracy</p>
          <p>2: Mappin of Burnt Area</p>
          <p>
            3: Enhanced User Experience
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClimaChainSlider;