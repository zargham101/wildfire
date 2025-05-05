import React, { useState } from "react";
import axios from "axios";

const WildfireCamPrediction = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      alert("Please select an image to upload.");
      return;
    }
  
    setError("");
    setLoading(true);
    setResult(null);
  
    try {
      const formData = new FormData();
      formData.append("image", selectedImage);
  
      const token = localStorage.getItem("token");
  
      const response = await axios.post(
        "http://localhost:5001/api/prediction/predict/cam/result",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      setResult(response.data.data);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Prediction failed. Try again later.";
  
      alert(message); 
      window.location.reload(); 
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div
      style={{
        backgroundImage: `url('/images/bgCam.jpg')`,
        backgroundRepeat: "repeat",
      }}
      className="w-full min-h-screen bg-gray-100 flex flex-col items-center p-6"
    >
      {/* Main Content */}
      <div className="w-full max-w-screen-xl flex flex-col lg:flex-row p-6 rounded-lg shadow-lg mt-[150px]">
        {/* Left Side: Image Upload (unchanged) */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 lg:border-r-2 border-gray-300">
          <h2 className="text-2xl font-bold mb-4">
            Upload Image to Predict Wildfire Risk
          </h2>
          <form onSubmit={handleSubmit} className="w-full">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mb-4 w-full text-center border-2 border-gray-300 p-4 rounded-md cursor-pointer"
            />
            {selectedImage && (
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Image Preview"
                className="mb-4 w-full h-64 object-cover rounded-lg shadow-lg border-2 border-dashed border-gray-500"
              />
            )}
            <button
              type="submit"
              className="w-full bg-red-700 text-white py-3 rounded-md hover:bg-red-800 transition duration-200"
            >
              {loading ? "Predicting..." : "Predict"}
            </button>
          </form>
        </div>

        {/* Right Side: Result - Updated with color scale */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6">
          {error && (
            <div className="text-red-600 font-semibold mb-4">{error}</div>
          )}
          {result ? (
            <div className="w-full flex">
              {/* Result Image (80% width) */}
              <div className="w-5/6 mb-8 border-2 border-dashed border-gray-500 rounded-lg p-4">
                <img
                  src={result.camImageUrl}
                  alt="Predicted Heatmap"
                  className="w-full h-full object-cover rounded-lg shadow-md"
                />
              </div>

              {/* Color Scale (20% width) */}
              <div className="w-1/6 flex justify-center ml-4">
                <img 
                  src={result.colorScale.scaleImageUrl} 
                  alt="Color Scale" 
                  className="h-[400px] object-contain"
                />
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center">
              <div className="w-full mb-8 border-2 border-dashed border-gray-500 rounded-lg p-4 flex items-center justify-center">
                <span className="text-center font-bold font-serif text-black">
                  Output Result
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Prediction Details Card (unchanged) */}
      {result && (
        <div className="w-full max-w-screen-xl p-6 shadow-lg rounded-lg">
          <h3 className="text-2xl font-bold mb-4">Prediction Details</h3>
          <div className="mb-4">
            <p className="font-semibold text-lg">Prediction:</p>
            <p
              className={`text-2xl font-bold mt-2 ${
                result.predictionResult === "Wildfire Detected"
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              {result.predictionResult}
            </p>
          </div>

          <div className="mb-4">
            <p className="font-semibold text-lg">No Wildfire Confidence:</p>
            <div className="w-full bg-gray-200 rounded-full h-4 mt-1">
              <div
                className="bg-blue-500 h-4 rounded-full"
                style={{ width: `${result.noWildfireConfidence}%` }}
              ></div>
            </div>
            <p className="text-lg font-bold text-right mt-1">
              {result.noWildfireConfidence}%
            </p>
          </div>

          <div className="mb-4">
            <p className="font-semibold text-lg">Wildfire Confidence:</p>
            <div className="w-full bg-gray-200 rounded-full h-4 mt-1">
              <div
                className="bg-red-500 h-4 rounded-full"
                style={{ width: `${result.wildfireConfidence}%` }}
              ></div>
            </div>
            <p className="text-lg font-bold text-right mt-1">
              {result.wildfireConfidence}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WildfireCamPrediction;