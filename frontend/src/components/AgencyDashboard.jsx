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
      console.log("res:::",res)
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
      console.log('res::',res)
      setIncomingRequests(res.data);
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
      await axios.post(
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
      Swal.fire("Error", "Failed to respond to the request", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Agency Dashboard</h1>

      <div className="bg-white rounded shadow p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">Your Resources</h2>
        {agencyResources ? (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><strong>Firefighters:</strong> {agencyResources.currentResources.firefighters}</div>
            <div><strong>Firetrucks:</strong> {agencyResources.currentResources.firetrucks}</div>
            <div><strong>Helicopters:</strong> {agencyResources.currentResources.helicopters}</div>
            <div><strong>Commanders:</strong> {agencyResources.currentResources.commanders}</div>
            <div className="col-span-2">
              <strong>Heavy Equipment:</strong> {agencyResources.heavyEquipment?.join(", ") || "None"}
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
            {incomingRequests.map((req) => (
              <div
                key={req._id}
                className="border rounded p-4 bg-gray-50"
              >
                <div className="mb-2">
                  <strong>User:</strong> {req.userId?.name || "Unknown"}
                </div>
                <div className="mb-2">
                  <strong>Status:</strong> {req.status}
                </div>
                <div className="mb-2">
                  <strong>Resources:</strong>
                  <ul className="list-disc ml-6">
                    <li>Firefighters: {req.requiredResources.firefighters}</li>
                    <li>Firetrucks: {req.requiredResources.firetrucks}</li>
                    <li>Helicopters: {req.requiredResources.helicopters}</li>
                    <li>Commanders: {req.requiredResources.commanders}</li>
                    <li>Heavy Equipment: {req.requiredResources.heavyEquipment?.join(", ")}</li>
                  </ul>
                </div>
                <div className="flex gap-4 mt-2">
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
              </div>
            ))}
          </div>
        ) : (
          <p>No incoming requests at the moment.</p>
        )}
      </div>
    </div>
  );
}
