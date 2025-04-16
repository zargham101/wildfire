import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = [
  "#f87171",
  "#fb923c",
  "#facc15",
  "#4ade80",
  "#60a5fa",
  "#a78bfa",
  "#f472b6",
  "#34d399",
  "#fbbf24",
];

const ITEMS_PER_PAGE = 5;

const FeatureVisualizationPage = () => {
  const [predictions, setPredictions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchPredictions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5001/api/prediction/user/me/predictions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPredictions(res.data.predictions);
    } catch (error) {
      console.error("Failed to fetch predictions", error);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, []);

  const paginatedData = predictions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(predictions.length / ITEMS_PER_PAGE);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center font-serif mb-10">
        Feature Visualization for Wildfire Predictions
      </h1>

      {paginatedData.map((prediction, idx) => {
        const chartData = Object.entries(prediction.input).map(([key, val]) => ({
          name: key,
          value: val,
        }));

        return (
          <div key={prediction._id} className="mb-12 p-4 border rounded shadow-sm">
            <h2 className="text-xl font-bold text-gray-700 mb-4">
              Prediction #{(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
            </h2>

            <div className="mb-6">
              <h3 className="font-semibold mb-2 text-gray-600">Feature Bar Chart</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#dc2626" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2 text-gray-600">Feature Pie Chart</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {chartData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2 text-gray-600">
                FFMC vs FWI (Scatter Chart)
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <ScatterChart>
                  <CartesianGrid />
                  <XAxis dataKey="FFMC" name="FFMC" />
                  <YAxis dataKey="FWI" name="FWI" />
                  <Tooltip />
                  <Scatter
                    name="Prediction"
                    data={[
                      {
                        FFMC: prediction.input.FFMC,
                        FWI: prediction.fwi,
                      },
                    ]}
                    fill="#0ea5e9"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      })}

      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Prev
        </button>
        <span className="font-semibold text-lg">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FeatureVisualizationPage;
