import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  CartesianGrid,
} from "recharts";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import WildfireHeatMap from "./WildfireHeatMap";

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

const WildfireDashboard = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedMainMetric, setSelectedMainMetric] = useState("prediction");
  const [mainChartType, setMainChartType] = useState("line");

  const [selectedCategorical, setSelectedCategorical] = useState("fire_type");
  const [categoricalChartType, setCategoricalChartType] = useState("bar");

  const [selectedNumeric, setSelectedNumeric] = useState("temperature");

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5001/api/prediction/my/fire/prediction",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPredictions(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch predictions", error);
    } finally {
      setLoading(false);
    }
  };

  const getAvg = (key) => {
    if (!predictions.length) return 0;
    const sum = predictions.reduce(
      (acc, p) =>
        acc + (key === "prediction" ? p.prediction || 0 : p.input?.[key] || 0),
      0
    );
    return (sum / predictions.length).toFixed(2);
  };

  const prepareMainChartData = () => {
    return predictions.map((p) => ({
      date: new Date(p.createdAt).toLocaleDateString(),
      value:
        selectedMainMetric === "prediction"
          ? p.prediction || 0
          : p.input?.[selectedMainMetric] || 0,
    }));
  };

  const prepareCategoricalData = () => {
    const counts = {};
    predictions.forEach((p) => {
      const cat = p.input?.[selectedCategorical] || "Unknown";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  const prepareScatterData = () => {
    return predictions.map((p) => ({
      x: p.input?.[selectedNumeric] || 0,
      y: p.prediction || 0,
    }));
  };

  return (
    <div
      style={{
        backgroundImage: `url('images/texture.jpg')`,
        backgroundRepeat: "repeat",
      }}
    >
      <div className="p-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center font-serif mb-10">
          Wildfire Analytics Dashboard
        </h1>

        {loading ? (
          <Skeleton height={150} count={2} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-red-100 p-6 rounded shadow text-center">
              <p className="text-lg font-semibold text-red-700">Total Fires</p>
              <p className="text-3xl font-bold">{predictions.length}</p>
            </div>
            <div className="bg-yellow-100 p-6 rounded shadow text-center">
              <p className="text-lg font-semibold text-yellow-700">
                Avg. Fire Size
              </p>
              <p className="text-3xl font-bold">{getAvg("prediction")}</p>
            </div>
            <div className="bg-blue-100 p-6 rounded shadow text-center">
              <p className="text-lg font-semibold text-blue-700">
                Avg. Temperature
              </p>
              <p className="text-3xl font-bold">{getAvg("temperature")}</p>
            </div>
            <div className="bg-green-100 p-6 rounded shadow text-center">
              <p className="text-lg font-semibold text-green-700">
                Avg. Wind Speed
              </p>
              <p className="text-3xl font-bold">{getAvg("wind_speed")}</p>
            </div>
          </div>
        )}

        <div className=" p-6 rounded shadow mb-12">
          <div className="flex justify-between mb-4">
            <h2 className="text-2xl font-bold">Wildfire Trends</h2>
            <div className="flex gap-4">
              <select
                value={selectedMainMetric}
                onChange={(e) => setSelectedMainMetric(e.target.value)}
                className="border p-2 rounded"
              >
                <option value="prediction">Fire Size</option>
                <option value="temperature">Temperature</option>
                <option value="relative_humidity">Humidity</option>
                <option value="wind_speed">Wind Speed</option>
              </select>
              <button
                onClick={() =>
                  setMainChartType(mainChartType === "line" ? "bar" : "line")
                }
                className="bg-red-700 text-white px-4 py-2 rounded"
              >
                {mainChartType === "line" ? "Switch to Bar" : "Switch to Line"}
              </button>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-rose-50">
            <ResponsiveContainer width="100%" height={300}>
              {mainChartType === "line" ? (
                <LineChart data={prepareMainChartData()}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#dc2626" />
                </LineChart>
              ) : (
                <BarChart data={prepareMainChartData()}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#dc2626" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* 🔵 Wildfire Count by Category */}
          <div className=" p-6 rounded shadow">
            <div className="flex justify-between mb-4">
              <h3 className="font-bold text-lg">Wildfire Count by Category</h3>
              <select
                value={selectedCategorical}
                onChange={(e) => setSelectedCategorical(e.target.value)}
                className="border p-2 rounded"
              >
                <option value="fire_type">Fire Type</option>
                <option value="fuel_type">Fuel Type</option>
                <option value="weather_conditions_over_fire">Weather</option>
              </select>
              <button
                onClick={() =>
                  setCategoricalChartType(
                    categoricalChartType === "bar" ? "pie" : "bar"
                  )
                }
                className="bg-red-700 text-white px-2 rounded"
              >
                {categoricalChartType === "bar" ? "Pie" : "Bar"}
              </button>
            </div>

            <div className="p-4 rounded-lg bg-yellow-50">
              {categoricalChartType === "bar" ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={prepareCategoricalData()}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#34d399" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/2">
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={prepareCategoricalData()}
                          dataKey="value"
                          nameKey="name"
                          outerRadius={80}
                        >
                          {prepareCategoricalData().map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-full md:w-1/2 flex flex-col justify-center pl-4">
                    <div className="space-y-2">
                      {prepareCategoricalData().map((entry, i) => (
                        <div key={`legend-${i}`} className="flex items-center">
                          <div
                            className="w-4 h-4 mr-2 rounded-full"
                            style={{
                              backgroundColor: COLORS[i % COLORS.length],
                            }}
                          />
                          <span className="text-sm">
                            {entry.name}: {entry.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className=" p-6 rounded shadow">
            <div className="flex justify-between mb-4">
              <h3 className="font-bold text-lg">Fire Size vs Numeric</h3>
              <select
                value={selectedNumeric}
                onChange={(e) => setSelectedNumeric(e.target.value)}
                className="border p-2 rounded"
              >
                <option value="temperature">Temperature</option>
                <option value="wind_speed">Wind Speed</option>
                <option value="relative_humidity">Humidity</option>
              </select>
            </div>

            <div className="p-4 rounded-lg bg-blue-50">
              <ResponsiveContainer width="100%" height={250}>
                <ScatterChart>
                  <CartesianGrid />
                  <XAxis dataKey="x" name="x" />
                  <YAxis dataKey="y" name="Fire Size" />
                  <Tooltip />
                  <Scatter data={prepareScatterData()} fill="#6366f1" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 🔥 Wildfire Prediction Heatmap */}
        <div className=" p-6 rounded shadow">
          {loading ? (
            <Skeleton height={300} />
          ) : (
            <div className="mt-12">
              <WildfireHeatMap />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WildfireDashboard;
