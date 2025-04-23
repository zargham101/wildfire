import React from "react";
import { useParams } from "react-router-dom";

const NewsDetail = ({ news }) => {
  const { id } = useParams();  // Get the id from the URL params
  const article = news[id];    // Find the article using the id

  if (!article) {
    return <p className="text-center text-red-600 font-bold text-xl">Loading...</p>;  // Show a loading state if no article is found
  }

  return (
    <div className="bg-white text-gray-800 shadow-xl rounded-lg max-w-screen-xl mx-auto my-8 overflow-hidden">
      {/* Full-width image with margin-top */}
      <div className="w-full mt-20 mb-6">
        <img
          src={article.urlToImage || "/images/placeholder.jpg"}
          alt={article.title}
          className="w-full h-96 object-cover rounded-t-lg shadow-md"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Title */}
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6 sm:text-5xl">
          {article.title}
        </h1>

        {/* Description */}
        <p className="text-lg text-gray-600 mb-6 sm:text-xl">
          {article.description}
        </p>

        {/* Content */}
        <div className="text-lg text-gray-700 mb-8 leading-relaxed space-y-6">
          {article.content}
        </div>

        {/* Link to the full article */}
        <div className="text-center mb-8">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-red-600 text-white text-lg px-10 py-4 rounded-full shadow-lg hover:bg-red-700 transition duration-300 transform hover:scale-105"
          >
            Read Full Article
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;