import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const WildfireHeatMap = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const prepareHeatmapGroups = () => {
    const veryHigh = [];
    const high = [];
    const medium = [];
    const low = [];

    predictions.forEach((p) => {
      const lat = parseFloat(p.input?.fire_location_latitude);
      const lng = parseFloat(p.input?.fire_location_longitude);
      const confidence = p.wildfireConfidence || 0;

      if (!isNaN(lat) && !isNaN(lng)) {
        const point = { latitude: lat, longitude: lng, confidence };

        if (confidence >= 85) {
          veryHigh.push(point); // Yellow (very high risk)
        } else if (confidence >= 70) {
          high.push(point); // Red (high risk)
        } else if (confidence >= 40) {
          medium.push(point); // Green (medium risk)
        } else {
          low.push(point); // Blue (low risk)
        }
      }
    });

    return { veryHigh, high, medium, low };
  };

  const { veryHigh, high, medium, low } = prepareHeatmapGroups();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Wildfire Prediction Heatmap
      </h1>

      {loading ? (
        <Skeleton height={400} />
      ) : (
        <div className="relative w-full h-[500px]">
          {/* 🔥 Background gradient */}
          <div
            className="absolute inset-0 z-0"
            style={{
              background: "linear-gradient(to bottom, #ffe0b2, #ffccbc, #ff8a65)",
              opacity: 0.4,
              borderRadius: "8px",
            }}
          ></div>

          {/* Chart on top */}
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="longitude"
                type="number"
                name="Longitude"
                domain={["auto", "auto"]}
                tickFormatter={(tick) => tick.toFixed(2)}
              />
              <YAxis
                dataKey="latitude"
                type="number"
                name="Latitude"
                domain={["auto", "auto"]}
                tickFormatter={(tick) => tick.toFixed(2)}
              />
              <ZAxis dataKey="confidence" range={[60, 200]} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(value, name) =>
                  [`${value}`, name === "confidence" ? "Confidence (%)" : name]
                }
              />

              {/* 🟡 Very High Risk - Yellow */}
              <Scatter name="Very High Risk" data={veryHigh} fill="#FFD700" />

              {/* 🔥 High Risk - Red */}
              <Scatter name="High Risk" data={high} fill="#FF0000" />

              {/* 🟢 Medium Risk - Green */}
              <Scatter name="Medium Risk" data={medium} fill="#00FF00" />

              {/* 🔵 Low Risk - Blue */}
              <Scatter name="Low Risk" data={low} fill="#0000FF" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default WildfireHeatMap;
