import React, { useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { calculateResources } from "../condition/resourceCalculator";
import axios from "axios";

const FireResponseReport = ({
  fireSize,
  windSpeed,
  humidity,
  predictionDate,
  predictionId,
  userId,
  latitude,
  longitude,
}) => {
  const [showAlert, setShowAlert] = useState(true);
  const [error, setError] = useState("");
  const [sendingRequest, setSendingRequest] = useState(false);

  if (fireSize === null) return null;

  const {
    fireSeverity,
    initialResources,
    longTermResources,
    specialAdjustments,
    inspectorsNeeded,
  } = calculateResources(fireSize, windSpeed, humidity);

  const handleDownloadReport = () => {
    const doc = new jsPDF();
    doc.text("Fire Response Report", 20, 20);

    const formattedDate = predictionDate
      ? new Date(Date.parse(predictionDate)).toLocaleDateString() // Ensure it’s a valid date format
      : "Date Not Available";

    autoTable(doc, {
      startY: 30,
      head: [["Category", "Details"]],
      body: [
        ["Fire Severity", fireSeverity],
        ["Prediction Date", formattedDate],
        ["Initial Firefighters", initialResources.firefighters.toFixed(0)],
        ["Initial Firetrucks", initialResources.firetrucks],
        ["Initial Helicopters", initialResources.helicopters.toFixed(0)],
        ["Commanders", initialResources.commanders],
        ["Daily Firefighters (Long-Term)", longTermResources.dailyFirefighters],
        ["Fire Stations Needed", longTermResources.fireStationsNeeded],
        [
          "Heavy Equipment",
          longTermResources.heavyEquipment.join(", ") || "None",
        ],
        [
          "Backup Fire Station Needed",
          specialAdjustments.backupFireStation ? "Yes" : "No",
        ],
        ["Post Fire Inspectors Needed", inspectorsNeeded],
      ],
    });

    doc.save("fire_response_report.pdf");
  };

  // Send the resource request to the admin
  const sendResourceRequest = async () => {
    setSendingRequest(true);
    setError("");

    const token = localStorage.getItem("token"); // Get the token for authorization

    try {
      const payload = {
        predictionId: predictionId,
        userId: userId,
        message: "This is a fire resource request",
        latitude: latitude,
        longitude: longitude,
        requiredResources: {
          firefighters: initialResources.firefighters,
          firetrucks: initialResources.firetrucks,
          helicopters: initialResources.helicopters,
          commanders: initialResources.commanders,
          heavyEquipment: longTermResources.heavyEquipment,
        },
      };

      // Make an API call to send the request
      const response = await axios.post(
        "http://localhost:5001/api/agency/resource-requests",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        alert("Resource request sent successfully!");
      } else {
        setError("Failed to send request. Please try again.");
      }
    } catch (err) {
      setError("Error sending the request. Please try again.");
    } finally {
      setSendingRequest(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-8">
      {showAlert && (
        <div
          className={`text-center mb-8 p-4 rounded-md font-semibold shadow-lg
          ${
            fireSeverity === "Very Small"
              ? "bg-green-100 text-green-700"
              : fireSeverity === "Small"
              ? "bg-yellow-100 text-yellow-700"
              : fireSeverity === "Moderate"
              ? "bg-orange-100 text-orange-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          ALERT: {fireSeverity} Fire Detected!
        </div>
      )}

      <div className="bg-white p-8 rounded-lg shadow-md border">
        <h2 className="text-3xl font-bold font-serif text-center text-red-700 mb-8">
          Fire Response Report
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Initial Response
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>
                👩‍🚒 Firefighters:{" "}
                <strong>{initialResources.firefighters.toFixed(0)}</strong>
              </li>
              <li>
                🚒 Firetrucks: <strong>{initialResources.firetrucks}</strong>
              </li>
              <li>
                🚁 Helicopters:{" "}
                <strong>{initialResources.helicopters.toFixed(0)}</strong>
              </li>
              <li>
                👨‍✈️ Commanders: <strong>{initialResources.commanders}</strong>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Long-Term Planning
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>
                🧑‍🚒 Daily Firefighters:{" "}
                <strong>{longTermResources.dailyFirefighters}</strong>
              </li>
              <li>
                🏢 Fire Stations Needed:{" "}
                <strong>{longTermResources.fireStationsNeeded}</strong>
              </li>
              <li>
                🛠️ Heavy Equipment:{" "}
                <strong>
                  {longTermResources.heavyEquipment.join(", ") || "None"}
                </strong>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Special Adjustments
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>
                🏢 Backup Fire Station:{" "}
                <strong>
                  {specialAdjustments.backupFireStation ? "Yes" : "No"}
                </strong>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Post Fire Inspection
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>
                🕵️‍♂️ Inspectors Needed: <strong>{inspectorsNeeded}</strong>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={handleDownloadReport}
            className="w-[180px] bg-red-700 text-white py-2 hover:bg-white hover:border-b-4 hover:border-red-700 hover:text-black"
          >
            Download Full Report
          </button>
        </div>

        {/* Button to send resource request */}
        <div className="flex justify-center mt-8">
          <button
            onClick={sendResourceRequest}
            disabled={sendingRequest}
            className="w-[180px] bg-green-700 text-white py-2 hover:bg-white hover:border-b-4 hover:border-green-700 hover:text-black"
          >
            {sendingRequest ? "Sending..." : "Send Request to Admin"}
          </button>
        </div>

        {error && <div className="mt-4 text-red-600 font-medium">{error}</div>}
      </div>
    </div>
  );
};

export default FireResponseReport;
