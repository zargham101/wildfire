import React, { useState, useEffect } from "react";

const Carousel = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [scrollIndex, setScrollIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(true); 

  const cards = [
    {
      img: "/images/smoke-alarm.jpeg",
      title: "Smoke Alarm",
      text: "Install smoke alarms: Smoke alarms are essential for early fire detection. They help in detecting smoke and fire, giving you an early warning to evacuate and save lives.",
    },
    {
      img: "/images/fire-escape.jpg",
      title: "Fire Escape",
      text: "Develop a fire escape plan: Having a well-rehearsed escape plan can save lives in case of an emergency. Make sure everyone knows the exits and how to escape safely.",
    },
    {
      img: "/images/prevention.jpeg",
      title: "Prevention",
      text: "Store flammable materials safely: Keep flammable liquids and materials away from heat sources. Store them in proper containers and areas to reduce fire risk.",
    },
    {
      img: "/images/vigilance.jpeg",
      title: "Vigilance",
      text: "Maintain electrical appliances: Regularly check appliances for damage and avoid overloading outlets. Also, ensure electrical wiring is in good condition to avoid fires.",
    },
    {
      img: "/images/smoke-alarm.jpeg",
      title: "Smoke Alarm",
      text: "Install smoke alarms: Smoke alarms are essential for early fire detection. They help in detecting smoke and fire, giving you an early warning to evacuate and save lives.",
    },
    {
      img: "/images/fire-escape.jpg",
      title: "Fire Escape",
      text: "Develop a fire escape plan: Having a well-rehearsed escape plan can save lives in case of an emergency. Make sure everyone knows the exits and how to escape safely.",
    },
    {
      img: "/images/prevention.jpeg",
      title: "Prevention",
      text: "Store flammable materials safely: Keep flammable liquids and materials away from heat sources. Store them in proper containers and areas to reduce fire risk.",
    },
    {
      img: "/images/vigilance.jpeg",
      title: "Vigilance",
      text: "Maintain electrical appliances: Regularly check appliances for damage and avoid overloading outlets. Also, ensure electrical wiring is in good condition to avoid fires.",
    },
  ];

  const toggleExpand = (index) => {
    if (expandedIndex === null || expandedIndex !== index) {
      setIsScrolling(false);
    } else {
      setIsScrolling(true);
    }
    setExpandedIndex(expandedIndex === index ? null : index);
  };
  const handleScroll = (direction) => {
    if (direction === "left") {
      setScrollIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : cards.length - 4
      );
    } else {
      setScrollIndex((prevIndex) =>
        prevIndex < cards.length - 4 ? prevIndex + 1 : 0
      );
    }
  };
  useEffect(() => {
    if (isScrolling) {
      const interval = setInterval(() => {
        setScrollIndex((prevIndex) => (prevIndex + 1) % (cards.length - 3));
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isScrolling]);

  return (
    <div className="relative w-full overflow-hidden">
      <div
        className="flex transition-all ease-in-out duration-500"
        style={{
          transform: `translateX(-${(scrollIndex * 100) / 4}%)`,
        }}
      >
        {cards.map((card, index) => (
          <div
            key={index}
            className="w-1/4 p-0 flex-shrink-0 bg-white shadow-lg m-2 transform transition-all ease-in-out duration-300 hover:scale-105 hover:shadow-xl"
            style={{ minWidth: "250px" }}
          >
            <div className="relative w-full h-48 overflow-hidden mb-4">
              <img
                src={card.img}
                alt={card.title}
                className="w-full h-full object-cover"
              />
              <h3
                className="absolute bottom-2 left-2  bg-opacity-60 text-white px-3 py-1 text-2xl rounded-md"
                style={{ fontFamily: "Bebas Neue, sans-serif" }}
              >
                {card.title}
              </h3>
            </div>
            <p className="text-lg mt-2 ml-2 font-serif">
              {expandedIndex === index
                ? card.text
                : `${card.text.slice(0, 100)}...`}
            </p>
            <button
              className="text-red-500 mt-2 ml-2 underline"
              style={{ fontFamily: "Bebas Neue, sans-serif" }}
              onClick={() => toggleExpand(index)}
            >
              {expandedIndex === index ? "Read Less" : "Read More"}
            </button>
          </div>
        ))}
      </div>
      <div
        className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full cursor-pointer hover:bg-gray-600"
        onClick={() => handleScroll("left")}
      >
        <button className="text-xl">&#60;</button>
      </div>
      <div
        className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full cursor-pointer hover:bg-gray-600"
        onClick={() => handleScroll("right")}
      >
        <button className="text-xl">&#62;</button>
      </div>
    </div>
  );
};

export default Carousel;
