import React, { useState, useEffect } from 'react';

const ScrollingTextWithDots = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const testimonials = [
    {
      name: "Zargham Shaukat",
      image: "/images/user1.jpg",
      testimonial: "This service helped our community stay safe from wildfires. The predictions are accurate, and the technology is state-of-the-art.",
    },
    {
      name: "Fahad chaudhary",
      image: "/images/user2.jpg",
      testimonial: "A game-changer in wildfire prevention. The predictive analytics have saved countless lives and resources. Highly recommend!",
    },
    {
      name: "Murtaza Ahmad",
      image: "/images/user3.jpg",
      testimonial: "Impressive results. The system provided us with accurate warnings and timely updates, ensuring we could act before it's too late.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000); // Change testimonials every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full py-16 ">
      <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
        <h2 className="text-red-600 text-4xl font-bold  uppercase mb-6">What Our Clients Say</h2>

        <div className="flex justify-center mb-6">
          <div className="w-16 h-1 bg-white rounded-full"></div>
        </div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`flex flex-col items-center bg-white p-6 rounded-lg shadow-xl border-2 border-black transition-all duration-500 ease-in-out transform ${
                activeIndex === index ? 'opacity-100 scale-105' : 'opacity-50'
              } hover:scale-105 hover:opacity-100`}
            >
              <div className="mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-24 h-24 rounded-full mx-auto border-4 border-white"
                />
              </div>
              <p className="text-lg italic text-center">"{testimonial.testimonial}"</p>
              <h3 className="mt-4 text-red-600  text-xl font-semibold">{testimonial.name}</h3>
            </div>
          ))}
        </div>

        {/* Dots to indicate active testimonial */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {testimonials.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${activeIndex === index ? 'bg-white' : 'border-2 border-white'}`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScrollingTextWithDots;
