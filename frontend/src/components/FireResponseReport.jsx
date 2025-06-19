import React, { useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
// Make sure this path is correct if calculateResources is in a different file
import { calculateResources, getFireSeverity } from "../condition/resourceCalculator";
import axios from "axios";

const FireResponseReport = ({
  fireSize,
  predictionDate, // Still needed for PDF
  predictionId,   // Still needed for sendResourceRequest
  userId,         // Still needed for sendResourceRequest
  latitude,       // Still needed for sendResourceRequest
  longitude,      // Still needed for sendResourceRequest
}) => {
  const [showAlert, setShowAlert] = useState(true);
  const [error, setError] = useState("");
  const [sendingRequest, setSendingRequest] = useState(false);

  // This check is important: if fireSize is null (initial state), don't render.
  if (fireSize === null || typeof fireSize !== 'number') return null;

  // Now, calculateResources only needs fireSize.
  // windSpeed and humidity are NOT passed directly for the report calculation within this component.
  // If they are still needed for the resource calculation logic, they must be part of your `calculateResources`
  // and derived from the `PredictionHomePage`'s `selectedMarker.originalData.data`
  // and passed to THIS component.
  const {
    fireSeverity,
    initialResources,
    longTermResources,
    specialAdjustments,
    inspectorsNeeded,
  } = calculateResources(fireSize); // Call without windSpeed, humidity

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

    // These values MUST be passed as props if used here
    if (!predictionId || !userId || !latitude || !longitude) {
        setError("Missing critical data for resource request. Please ensure a marker is selected.");
        setSendingRequest(false);
        return;
    }

    const token = localStorage.getItem("token");

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
      console.error("Error sending resource request:", err);
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
            className="
    w-[180px] py-2 rounded-md font-semibold
    bg-gradient-to-r from-red-600 to-red-800 text-white
    transition-transform duration-300 ease-in-out
    hover:bg-white hover:text-white-700 hover:border-b-4 hover:border-red-700
    hover:scale-105
    shadow-md hover:shadow-lg
    focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 focus:ring-offset-2
  "
          >
            Download Full Report
          </button>
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={sendResourceRequest}
            disabled={sendingRequest}
            className={`
    w-[180px] py-2 rounded-md font-semibold text-white
    bg-gradient-to-r from-green-600 to-green-800
    disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed disabled:text-gray-200
    hover:from-green-700 hover:to-green-900
    transform transition-all duration-300 ease-in-out
    ${sendingRequest ? "cursor-wait scale-100" : "hover:scale-105"}
    focus:outline-none focus:ring-4 focus:ring-green-400 focus:ring-opacity-50
    shadow-md hover:shadow-lg
  `}
          >
            {sendingRequest ? (
              <div className="flex items-center justify-center space-x-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                  />
                </svg>
                <span>Sending...</span>
              </div>
            ) : (
              "Send Request to Admin"
            )}
          </button>
        </div>

        {error && <div className="mt-4 text-red-600 font-medium">{error}</div>}
      </div>
    </div>
  );
};

export default FireResponseReport;