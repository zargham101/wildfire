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
    }, 4000); // show each image for 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col md:flex-row items-center justify-center bg-black min-h-screen p-14">
      {/* Left: Slider */}
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

        {/* Dots */}
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

      {/* Right: Content */}
      <div className="text-center md:text-left mt-10 md:mt-0 md:ml-16 max-w-xl">
        <h2 className="text-2xl font-semibold mb-6 text-white">
          What you can achieve with <span className="font-bold">ClimaChain*</span>
        </h2>

        <div className="flex justify-center md:justify-start space-x-8 text-left">
          <div>
            <p className="text-4xl font-bold text-white">40%</p>
            <p className="text-sm text-white">Uplift in forecast accuracy</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-white">30%</p>
            <p className="text-sm text-white">Fewer stockouts</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-white">16x</p>
            <p className="text-sm text-white">Return on investment (ROI)</p>
          </div>
        </div>

        <div className="mt-6 text-xs text-white italic leading-snug">
          <p>1: Based on preliminary results</p>
          <p>2: Projected based on improved forecasting accuracy</p>
          <p>
            3: Projected ROI for a live use case based on incremental revenue from improved
            forecasting
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClimaChainSlider;
