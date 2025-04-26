import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // for navigation to the detail page
import axios from "axios";

const Carousel = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [scrollIndex, setScrollIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(true);
  const [news, setNews] = useState([]);

  const NEWS_API_KEY = "2e7991dbdd07498791097d5b0c925624"; // Your API Key
  const navigate = useNavigate(); // Use the navigate hook for routing

  // Fetch news data directly from NewsAPI with a search query for fire, disaster, emergency-related topics
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`https://newsapi.org/v2/everything?q=fire+emergency+natural+disaster+emergency+services&apiKey=${NEWS_API_KEY}`);
        setNews(response.data.articles || []);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, []);

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
        prevIndex > 0 ? prevIndex - 1 : news.length - 4
      );
    } else {
      setScrollIndex((prevIndex) =>
        prevIndex < news.length - 4 ? prevIndex + 1 : 0
      );
    }
  };

  useEffect(() => {
    if (isScrolling) {
      const interval = setInterval(() => {
        setScrollIndex((prevIndex) => (prevIndex + 1) % (news.length - 3));
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isScrolling, news.length]);

  // Handle news card click to navigate to the news detail page
  const handleCardClick = (id) => {
    navigate(`/news/${id}`);
  };

  return (
    <div className="mb-10 relative w-full overflow-hidden">
      <div
        className="flex transition-all ease-in-out duration-500"
        style={{
          transform: `translateX(-${(scrollIndex * 100) / 4}%)`,
        }}
      >
        {news.map((item, index) => (
          <div
            key={index}
            className="w-1/4 p-0 flex-shrink-0 bg-white shadow-lg m-2 transform transition-all ease-in-out duration-300 hover:scale-105 hover:shadow-xl"
            style={{ minWidth: "250px" }}
            onClick={() => handleCardClick(index)} // Add onClick to each card
          >
            <div className="relative w-full h-48 overflow-hidden mb-4">
              <img
                src={item.urlToImage || "/images/placeholder.jpg"}  // Fallback to a placeholder if no image is found
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <h3
                className="absolute bottom-2 left-2 bg-opacity-60 text-white px-3 py-1 text-2xl rounded-md"
                style={{ fontFamily: "Bebas Neue, sans-serif" }}
              >
                {item.title}
              </h3>
            </div>
            <p className="text-lg mt-2 ml-2 font-serif">
              {expandedIndex === index
                ? item.description
                : `${item.description?.slice(0, 100)}...`}  {/* Optional chaining for description */}
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
