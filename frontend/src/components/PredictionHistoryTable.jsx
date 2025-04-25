import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const PredictionHistoryTable = () => {
  const [predictions, setPredictions] = useState([]);
  const [filteredPredictions, setFilteredPredictions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");

  const fetchPredictions = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("User is not authenticated. Please log in.");
      return;
    }

    try {
      const res = await axios.get(
        "http://localhost:5001/api/prediction/user/me/predictions",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPredictions(res.data.predictions);
      setFilteredPredictions(res.data.predictions);
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
        .map(
          ([key, value]) =>
            `${key}: ${
              typeof value === "object" && value !== null
                ? Object.values(value)[0]
                : value
            }`
        )
        .join("\n"),
      pred.fwi.toFixed(6),
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


  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-8 w-full">
      <h2 className="text-2xl font-bold font-serif text-gray-800 mb-6 text-center">
        Prediction History
      </h2>

      <div className="flex justify-end mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded bg-red-700 p-3 text-white"
        >
          <option value="all">All Predictions</option>
          <option value="5days">5 Days</option>
          <option value="10days">10 Days</option>
          <option value="1month">1 Month</option>
          <option value="3months">3 Months</option>
          <option value="6months">6 Months</option>
          <option value="1year">1 Year</option>
        </select>
      </div>

      {error && <div className="text-red-600 font-medium mb-4">{error}</div>}

      <div className="overflow-x-auto shadow border border-gray-300 rounded w-full">
        <table className="w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-100">
            <tr className="bg-red-700">
              <th className="px-6 py-3 text-center font-serif text-md font-semibold text-white">
                Inputs
              </th>
              <th className="px-6 py-3 text-center font-serif text-md font-semibold text-white">
                FWI Result
              </th>
              <th className="px-6 py-3 text-center font-serif text-md font-semibold text-white">
                Predicted On
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredPredictions.length > 0 ? (
              filteredPredictions.map((pred, index) => (
                <tr
                  key={index}
                  className="hover:-translate-y-1 hover:shadow-md"
                >
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      {pred.input &&
                        Object.entries(pred.input).map(([key, value], idx) => {
                          let displayValue = value;
                          if (typeof value === "object" && value !== null) {
                            const innerKey = Object.keys(value)[0];
                            displayValue = value[innerKey];
                          }
                          return (
                            <div key={idx} className="flex justify-between">
                              <span className="font-semibold text-red-700 ml-2">
                                {key}:
                              </span>
                              <span className="text-gray-800 mr-6">
                                {displayValue}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-bold text-red-700">
                    {typeof pred.fwi === "number" ? pred.fwi.toFixed(6) : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-bold text-red-700">
                    {new Date(pred.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-6 text-center text-gray-500">
                  No predictions found for the selected period.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={downloadPDF}
          className="w-[150px] bg-red-700 text-white py-2  hover:bg-white hover:border-b-4 hover:border-red-700 hover:text-black"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default PredictionHistoryTable;
