import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function AgencyDashboard() {
  const [agencyResources, setAgencyResources] = useState(null);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [token] = useState(localStorage.getItem("agency_token"));

  const baseUrl = "http://localhost:5001/api/agency";

  useEffect(() => {
    if (!token) return;
    fetchAgencyResources();
    fetchIncomingRequests();
  }, [token]);

  const fetchAgencyResources = async () => {
    try {
      const res = await axios.get(`${baseUrl}/agencies/me/resources`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAgencyResources(res.data);
    } catch (err) {
      console.error("Error fetching agency resources:", err);
    }
  };

  const fetchIncomingRequests = async () => {
    try {
      const res = await axios.get(`${baseUrl}/resource-requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data;
      data.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setIncomingRequests(data);
    } catch (err) {
      console.error("Error fetching resource requests:", err);
    }
  };

  const handleRespond = async (requestId, status) => {
    const input = await Swal.fire({
      title: `Are you sure you want to ${status} this request?`,
      input: "text",
      inputLabel: "Optional message",
      showCancelButton: true,
      confirmButtonText: `Yes, ${status}`,
    });

    if (!input.isConfirmed) return;

    try {
      const res = await axios.post(
        `${baseUrl}/resource-requests/${requestId}/respond`,
        {
          requestId,
          status,
          message: input.value,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Swal.fire("Success", `Request ${status}ed successfully!`, "success");
      fetchIncomingRequests();
      fetchAgencyResources();
    } catch (err) {
      console.error("Error responding to request:", err);
      const message =
        err.response?.data?.message ||
        "Failed to respond to the request. Please try again.";

      Swal.fire("Error", message, "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Agency Dashboard</h1>

      <div className="bg-white rounded shadow p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">Your Resources</h2>
        {agencyResources ? (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Firefighters:</strong>{" "}
              {agencyResources.currentResources.firefighters}
            </div>
            <div>
              <strong>Firetrucks:</strong>{" "}
              {agencyResources.currentResources.firetrucks}
            </div>
            <div>
              <strong>Helicopters:</strong>{" "}
              {agencyResources.currentResources.helicopters}
            </div>
            <div>
              <strong>Commanders:</strong>{" "}
              {agencyResources.currentResources.commanders}
            </div>
            <div className="col-span-2">
              <strong>Heavy Equipment:</strong>{" "}
              {agencyResources.heavyEquipment?.join(", ") || "None"}
            </div>
          </div>
        ) : (
          <p>Loading resources...</p>
        )}
      </div>

      <div className="bg-white rounded shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Incoming Requests</h2>
        {incomingRequests.length > 0 ? (
          <div className="space-y-4">
            {incomingRequests.map((req) => {
              const isUnavailable =
                agencyResources?.locked && req.status === "pending";

              return (
                <div
                  key={req._id}
                  className={`border rounded p-4 shadow-sm transition duration-200 ${
                    req.status === "completed"
                      ? "bg-green-50 border-green-200"
                      : req.status === "rejected" || isUnavailable
                      ? "bg-red-50 border-red-200"
                      : "bg-white"
                  }`}
                >
                  <div className="mb-2">
                    <strong>User:</strong> {req.userId?.name || "Unknown"}
                  </div>

                  <div className="mb-2">
                    <strong>Status:</strong>{" "}
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        req.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : req.status === "rejected" || isUnavailable
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {req.status === "completed"
                        ? "✔️ Accepted"
                        : req.status === "rejected"
                        ? "❌ Rejected"
                        : isUnavailable
                        ? "❌ Unavailable – Not enough resources"
                        : "⏳ Pending"}
                    </span>
                  </div>

                  <div className="mb-2">
                    <strong>Resources:</strong>
                    <ul className="list-disc ml-6 text-sm mt-1">
                      <li>
                        Firefighters: {req.requiredResources.firefighters}
                      </li>
                      <li>Firetrucks: {req.requiredResources.firetrucks}</li>
                      <li>Helicopters: {req.requiredResources.helicopters}</li>
                      <li>Commanders: {req.requiredResources.commanders}</li>
                      <li>
                        Heavy Equipment:{" "}
                        {req.requiredResources.heavyEquipment?.join(", ") ||
                          "None"}
                      </li>
                    </ul>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    {req.status === "pending" && !isUnavailable ? (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleRespond(req._id, "accepted")}
                          className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRespond(req._id, "rejected")}
                          className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400 italic">
                        No further action allowed
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p>No incoming requests at the moment.</p>
        )}
      </div>
    </div>
  );
}
