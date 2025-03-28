import React, { useEffect, useState } from "react";
import axios from "axios";

const PredictionHistoryTable = () => {
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState("");

  const fetchPredictions = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get("http://localhost:5001/api/prediction/user/me/predictions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPredictions(res.data.predictions);
    } catch (err) {
      console.error("Failed to fetch predictions:", err);
      setError("Failed to load prediction history.");
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
         Prediction History
      </h2>

      {error && <div className="text-red-600 font-medium mb-4">{error}</div>}

      <div className="overflow-x-auto shadow border border-gray-300 rounded">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Inputs</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">FWI Result</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {predictions.map((pred, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-600">
                  <pre className="whitespace-pre-wrap break-all">
                    {JSON.stringify(pred.input, null, 2)}
                  </pre>
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-blue-700">
                  {pred.fwi.toFixed(4)}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => alert("Feature coming soon!")}
                    className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
                  >
                    Read in Detail
                  </button>
                </td>
              </tr>
            ))}
            {predictions.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                  No predictions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PredictionHistoryTable;
