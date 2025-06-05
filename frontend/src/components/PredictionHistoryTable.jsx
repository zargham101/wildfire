import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const PredictionHistoryTable = () => {
  const [predictions, setPredictions] = useState([]);
  const [filteredPredictions, setFilteredPredictions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);

  const fetchPredictions = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("User is not authenticated. Please log in.");
      return;
    }

    try {
      const res = await axios.get(
        "http://localhost:5001/api/prediction/my/fire/prediction",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPredictions(res.data.data);
      setFilteredPredictions(res.data.data);
    } catch (err) {
      console.error("Failed to fetch predictions:", err);
      setError("Failed to load prediction history.");
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [filter, predictions]);

  const applyFilter = () => {
    if (filter === "all") {
      setFilteredPredictions(predictions);
      return;
    }

    const now = new Date();
    let daysAgo = 0;

    switch (filter) {
      case "5days":
        daysAgo = 5;
        break;
      case "10days":
        daysAgo = 10;
        break;
      case "1month":
        daysAgo = 30;
        break;
      case "3months":
        daysAgo = 90;
        break;
      case "6months":
        daysAgo = 180;
        break;
      case "1year":
        daysAgo = 365;
        break;
      default:
        daysAgo = 0;
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(now.getDate() - daysAgo);

    const filtered = predictions.filter((pred) => {
      const predictionDate = new Date(pred.createdAt);
      return predictionDate >= cutoffDate;
    });

    setFilteredPredictions(filtered);
  };

  const downloadPDF = () => {
    const pdf = new jsPDF();

    const tableData = filteredPredictions.map((pred) => [
      Object.entries(pred.input)
        .filter(([key]) => key !== "_id") // Skip _id
        .map(
          ([key, value]) =>
            `${key}: ${
              typeof value === "object" && value !== null
                ? Object.values(value)[0]
                : value
            }`
        )
        .join("\n"),
      typeof pred.prediction === "number" ? pred.prediction.toFixed(6) : "N/A",
      new Date(pred.createdAt).toLocaleDateString(),
    ]);

    autoTable(pdf, {
      head: [["Inputs", "FWI Result", "Predicted On"]],
      body: tableData,
      styles: { cellPadding: 3, fontSize: 10 },
      headStyles: { fillColor: [220, 38, 38] },
      margin: { top: 20 },
    });

    pdf.save("predictions.pdf");
  };

  const formatFieldName = (key) => {
    return key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())
      .trim();
  };

  return (
    <div className="w-full px-6 py-10 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-extrabold font-serif text-red-700 mb-8 text-center tracking-wide drop-shadow-md">
        Prediction History
      </h2>

      <div className="flex justify-end mb-8">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-3 border border-red-600 rounded-md bg-red-50 text-red-700 font-semibold hover:bg-red-100 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          <option value="all">All Predictions</option>
          <option value="5days">Last 5 Days</option>
          <option value="10days">Last 10 Days</option>
          <option value="1month">Last 1 Month</option>
          <option value="3months">Last 3 Months</option>
          <option value="6months">Last 6 Months</option>
          <option value="1year">Last 1 Year</option>
        </select>
      </div>

      {error && (
        <div className="text-red-600 font-medium mb-6 text-center">{error}</div>
      )}

      <div className="overflow-x-auto border border-red-300 rounded-lg shadow-md bg-white">
        <table className="min-w-full divide-y divide-red-200">
          <thead className="bg-red-700">
            <tr>
              <th className="px-8 py-4 text-left text-white text-lg font-semibold font-serif tracking-wide">
                Inputs
              </th>
              <th className="px-6 py-4 text-center text-white text-lg font-semibold font-serif tracking-wide">
                WildFire Size
              </th>
              <th className="px-6 py-4 text-center text-white text-lg font-semibold font-serif tracking-wide">
                Predicted On
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPredictions.length > 0 ? (
              (showAll ? filteredPredictions : filteredPredictions.slice(0, 5)).map(
                (pred, index) => (
                  <tr
                    key={index}
                    className="transition-transform duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg even:bg-red-50 odd:bg-white cursor-pointer"
                    style={{ animation: `fadeInUp 0.5s ease forwards`, animationDelay: `${index * 0.1}s` }}
                  >
                    <td className="px-8 py-5 text-sm text-gray-900 whitespace-pre-wrap">
                      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                        {pred.input &&
                          Object.entries(pred.input)
                            .filter(([key]) => key !== "_id")
                            .map(([key, value], idx) => {
                              let displayValue = value;
                              if (typeof value === "object" && value !== null) {
                                const innerKey = Object.keys(value)[0];
                                displayValue = value[innerKey];
                              }
                              return (
                                <div key={idx} className="flex justify-between font-mono text-sm">
                                  <span className="font-semibold text-red-700">
                                    {formatFieldName(key)}:
                                  </span>
                                  <span className="text-gray-800">{displayValue}</span>
                                </div>
                              );
                            })}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center font-bold text-red-600 text-lg">
                      {typeof pred.prediction === "number"
                        ? pred.prediction.toFixed(6)
                        : "N/A"}
                    </td>
                    <td className="px-6 py-5 text-center font-medium text-red-700 text-lg">
                      {new Date(pred.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-12 text-center text-gray-400 font-semibold"
                >
                  No predictions found for the selected period.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredPredictions.length > 5 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-8 py-3 rounded-md bg-red-600 text-white font-semibold tracking-wide shadow-lg hover:bg-red-700 transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-red-400"
          >
            {showAll ? "Show Less" : "Show More"}
          </button>
        </div>
      )}

      <div className="flex justify-center mt-8">
        <button
          onClick={downloadPDF}
          className="px-8 py-3 rounded-md bg-red-600 text-white font-semibold tracking-wide shadow-lg hover:bg-red-700 transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-red-400"
        >
          Download PDF
        </button>
      </div>

      <style>
        {`
          @keyframes fadeInUp {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default PredictionHistoryTable;
