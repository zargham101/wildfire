import React, { useState } from "react";
import axios from "axios";
import WildfirePredictionResult from "./WildFirePredictionResult";

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
      setError("Please select an image to upload.");
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
      console.error(error);
      setError(
        error.response?.data?.message || "Prediction failed. Try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6 mt-20">
      <div className="text-4xl font-serif font-bold text-center mb-10">
        Predict Wildfire Risk from Image
      </div>

      {/* Upload Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center w-full max-w-xl bg-gray-50 p-8 rounded-lg shadow-lg"
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mb-4 border p-2 w-full rounded-md"
        />

        {selectedImage && (
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Preview"
            className="mb-4 w-64 h-64 object-cover rounded-lg shadow"
          />
        )}

        <button
          type="submit"
          className="bg-red-700 text-white px-6 py-2 rounded-lg hover:bg-red-800 transition mb-4"
        >
          {loading ? "Predicting..." : "Predict"}
        </button>
      </form>

      {error && (
        <div className="mt-6 text-red-600 font-semibold">{error}</div>
      )}

      {/* Prediction Result */}
      {result && (
        <WildfirePredictionResult predictionData={result} />
      )}
    </div>
  );
};

export default WildfireCamPrediction;
