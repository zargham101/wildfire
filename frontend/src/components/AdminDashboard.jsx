import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("users");
  const [unseenSidebarCount, setUnseenSidebarCount] = useState(0);
  const [data, setData] = useState([]);
  const [resourceRequests, setResourceRequests] = useState([]);
  const [newRequestsCount, setNewRequestsCount] = useState(0);
  const [lastSeenRequestIds, setLastSeenRequestIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRequestSent, setIsRequestSent] = useState(false);
  const [selectedAgencyResources, setSelectedAgencyResources] = useState(null);
  const [token] = useState(localStorage.getItem("admin_token"));
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [lockedAgencies, setLockedAgencies] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [userNameMap, setUserNameMap] = useState({});
  const [agencyUsers, setAgencyUsers] = useState([]);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [selectedAgencyUser, setSelectedAgencyUser] = useState(null);
  const [showAgencyCard, setShowAgencyCard] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [viewData, setViewData] = useState(null);
  const [editImageFile, setEditImageFile] = useState(null);
  const [completedRequestsCount, setCompletedRequestsCount] = useState(null);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(null);

  const baseUrl = "http://localhost:5001/api/admin";

  useEffect(() => {
    if (!token) navigate("/login");
    else fetchData();
  }, [selectedCategory, page]);

  useEffect(() => {
    const interval = setInterval(() => {
      axios
        .get("http://localhost:5001/api/agency/resource-requests", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const requests = res.data;
          setResourceRequests(requests);

          const unseenRequests = requests.filter(
            (req) => !lastSeenRequestIds.includes(req._id)
          );

          setNewRequestsCount(unseenRequests.length);
          setUnseenSidebarCount(unseenRequests.length);
        })
        .catch((err) => {
          console.error("Failed to poll resource requests", err);
        });
    }, 10000);

    return () => clearInterval(interval);
  }, [lastSeenRequestIds, token]);

  useEffect(() => {
    const fetchResources = async () => {
      if (!selectedAgencyUser) return;

      try {
        const res = await axios.get(
          `http://localhost:5001/api/agency/agencies/${selectedAgencyUser._id}/resources`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSelectedAgencyResources(res.data);
      } catch (err) {
        console.error("Failed to fetch agency resources", err);
        setSelectedAgencyResources(null);
      }
    };

    fetchResources();
  }, [selectedAgencyUser]);

  const fetchUserName = async (userId) => {
    const id = userId._id || userId; // normalize to ID string
    if (userNameMap[id]) return userNameMap[id]; // check with string key

    try {
      const res = await axios.get(
        `http://localhost:5001/api/user/user-details/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const name = res.data.name;
      setUserNameMap((prev) => ({ ...prev, [id]: name })); // use ID as key
      return name;
    } catch (err) {
      return "Unknown";
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      let res;

      if (selectedCategory === "users") {
        res = await axios.get(`${baseUrl}/users?page=${page}&limit=${limit}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } else if (selectedCategory === "resource-requests") {
        const [requestRes, agencyRes] = await Promise.all([
          axios.get(`http://localhost:5001/api/agency/resource-requests`, {
            headers: { Authorization: `Bearer ${token}` },
          }),

          axios.get(`http://localhost:5001/api/user/user-role?role=agency`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        console.log("req response::", requestRes);

        const enrichedData = await Promise.all(
          requestRes.data.map(async (item) => {
            const userName = await fetchUserName(item.userId);
            console.log("Fetched user name for", item.userId, "→", userName);
            return {
              ...item,
              userName,
            };
          })
        );

        const agencies = Array.isArray(agencyRes.data)
          ? agencyRes.data
          : agencyRes.data.data || [];

        const lockedAgencies = agencies.filter((agency) => agency.locked);
        const availableAgencies = agencies.filter((agency) => !agency.locked);

        setLockedAgencies(lockedAgencies);
        setAgencyUsers(availableAgencies);

        const completedRequests = enrichedData.filter(
          (req) => req.status === "completed"
        );
        const pendingRequests = enrichedData.filter(
          (req) => req.status === "pending"
        );

        const completedRequestsCount = completedRequests.length;
        const pendingRequestsCount = pendingRequests.length;

        enrichedData.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        console.log("Enriched Data with User Names:", enrichedData);

        const unseenCount = enrichedData.filter((req) => !req.isSeen).length;
        setNewRequestsCount(unseenCount);

        setData(enrichedData);
        // setAgencyUsers(agencyRes.data.data || []);
        setCompletedRequestsCount(completedRequestsCount);
        setPendingRequestsCount(pendingRequestsCount);
      } else if (selectedCategory === "image-predictions") {
        res = await axios.get(
          `${baseUrl}/image-predictions?page=${page}&limit=${limit}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setData(res.data);
      } else if (selectedCategory === "feature-predictions") {
        res = await axios.get(
          `${baseUrl}/feature-predictions?page=${page}&limit=${limit}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setData(res.data);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const sendRequestToAgency = async () => {
    try {
      setIsRequestSent(true);
      await axios.post(
        `http://localhost:5001/api/agency/resource-requests/${selectedRequestId}/assign`,
        { agencyId: selectedAgencyUser._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire({
        title: "Request Sent",
        text: "The request has been successfully sent to the agency.",
        icon: "success",
        confirmButtonText: "OK",
      });

      setResourceRequests((prevRequests) =>
        prevRequests.map((req) =>
          req._id === selectedRequestId ? { ...req, sent: true } : req
        )
      );

      setShowAgencyCard(false);

      fetchData();
    } catch (err) {
      console.error("Failed to send request", err);
      Swal.fire(
        "Error",
        "Failed to send the request. Please try again.",
        "error"
      );
    }
  };

  const handleViewItem = async (item) => {
    try {
      let res;
      if (selectedCategory === "users") {
        res = await axios.get(`${baseUrl}/users/${item._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else if (selectedCategory === "image-predictions") {
        res = await axios.get(`${baseUrl}/image-predictions/${item._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else if (selectedCategory === "feature-predictions") {
        res = await axios.get(`${baseUrl}/feature-predictions/${item._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setViewData(res.data);
      setShowViewModal(true);
    } catch (err) {
      console.error("Error fetching item details:", err);
      Swal.fire("Error", "Failed to fetch details", "error");
    }
  };

  const handleEditItem = async (item) => {
    if (selectedCategory === "users") {
      try {
        const res = await axios.get(`${baseUrl}/users/${item._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEditData(res.data);
        setShowEditModal(true);
      } catch (err) {
        console.error("Error fetching user details:", err);
        Swal.fire("Error", "Failed to fetch user details", "error");
      }
    }
  };

  const handleDeleteItem = async (item) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to undo this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        let url;
        if (selectedCategory === "users") {
          url = `${baseUrl}/users/${item._id}`;
        } else if (selectedCategory === "image-predictions") {
          url = `${baseUrl}/image-predictions/${item._id}`;
        } else if (selectedCategory === "feature-predictions") {
          url = `${baseUrl}/feature-predictions/${item._id}`;
        }

        await axios.delete(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchData();
        Swal.fire("Deleted!", "Record has been deleted.", "success");
      } catch (err) {
        console.error("Delete error", err);
        Swal.fire("Error", "Failed to delete", "error");
      }
    }
  };

  const handleSendRequest = (requestId) => {
    setSelectedRequestId(requestId);
    setShowAgencyCard(true);
  };

  const formatLabel = (label) =>
    label
      .replace(/_/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/^./, (str) => str.toUpperCase());

  const getVisibleKeys = () => {
    if (!Array.isArray(data) || data.length === 0) return [];

    if (selectedCategory === "image-predictions")
      return ["imageUrl", "camImageUrl", "predictionResult"];
    if (selectedCategory === "feature-predictions")
      return ["userName", "input", "prediction"];
    if (selectedCategory === "resource-requests")
      return ["userName", "requiredResources", "location", "status"];

    const keys = Object.keys(data[0]);
    return keys.filter((key) => !["_id", "__v", "password"].includes(key));
  };

  const renderCell = (key, value, item) => {
    if (key === "userName") {
      if (selectedCategory === "feature-predictions") {
        return item.userId?.name || "Unknown";
      } else {
        return value || "Unknown";
      }
    }

    if (key === "input" && typeof value === "object") {
      return (
        <div className="text-sm space-y-1">
          {Object.entries(value).map(([k, v]) => (
            <div key={k}>
              <strong>{k.replace(/_/g, " ")}:</strong> {String(v)}
            </div>
          ))}
        </div>
      );
    }

    if (key === "imageUrl" && value) {
      return <img src={value} alt="Prediction" className="w-24 h-auto" />;
    }

    if (key === "camImageUrl" && value) {
      return <img src={value} alt="Camera" className="w-24 h-auto" />;
    }

    if (key === "requiredResources" && value) {
      return (
        <div>
          <div>
            <strong>Firefighters:</strong> {value.firefighters}
          </div>
          <div>
            <strong>Firetrucks:</strong> {value.firetrucks}
          </div>
          <div>
            <strong>Helicopters:</strong> {value.helicopters}
          </div>
          <div>
            <strong>Commanders:</strong> {value.commanders}
          </div>
          <div>
            <strong>Heavy Equipment:</strong> {value.heavyEquipment?.join(", ")}
          </div>
        </div>
      );
    }

    if (key === "location" && value) {
      return (
        <div>
          <div>
            <strong>Latitude:</strong> {value.latitude}
          </div>
          <div>
            <strong>Longitude:</strong> {value.longitude}
          </div>
        </div>
      );
    }

    return String(value);
  };

  return (
    <div
      className={`flex min-h-screen mt-[90px] ${
        isDarkTheme ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <aside
        className={`w-64 ${
          isDarkTheme ? "bg-gray-950" : "bg-gray-800"
        } text-white p-4`}
      >
        <h2 className="text-lg font-semibold mb-6">Admin Panel</h2>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => setSelectedCategory("users")}
              className="w-full text-left hover:text-yellow-400"
            >
              Users
            </button>
          </li>
          <li>
            <button
              onClick={() => setSelectedCategory("image-predictions")}
              className="w-full text-left hover:text-yellow-400"
            >
              Image Predictions
            </button>
          </li>
          <li>
            <button
              onClick={() => setSelectedCategory("feature-predictions")}
              className="w-full text-left hover:text-yellow-400"
            >
              Processed Predictions
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                setSelectedCategory("resource-requests");
                setUnseenSidebarCount(0);
                setLastSeenRequestIds(resourceRequests.map((r) => r._id));
              }}
              className="w-full text-left hover:text-yellow-400 flex justify-between items-center"
            >
              <span>Resource Requests</span>
              {newRequestsCount > 0 && (
                <span className="ml-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {unseenSidebarCount}
                </span>
              )}
            </button>
          </li>
        </ul>
      </aside>

      <main className="flex-1 p-6">
        <div className="flex justify-between mb-4 items-center">
          <h1 className="text-2xl font-bold capitalize">
            {selectedCategory.replace("-", " ")}
          </h1>
          <div className="flex items-center gap-4">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => {
                if (selectedCategory === "users") {
                  setShowCreateModal(true);
                } else if (selectedCategory === "image-predictions") {
                  navigate("/predict/cam/result");
                } else if (selectedCategory === "feature-predictions") {
                  navigate("/predictionHomePage");
                } else {
                  navigate(`/admin/create/${selectedCategory}`);
                }
              }}
            >
              + Create
            </button>
            <button
              onClick={() => setIsDarkTheme(!isDarkTheme)}
              className="text-2xl"
            >
              {isDarkTheme ? "🌞" : "🌙"}
            </button>
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {selectedCategory === "resource-requests" && (
              <div className="flex justify-between space-x-4 mb-8">
                <div className="bg-green-100 p-4 rounded-lg shadow-md w-1/3">
                  <h3 className="font-semibold text-xl text-green-700">
                    Completed Requests
                  </h3>
                  <p className="text-2xl font-bold text-green-800">
                    {completedRequestsCount}
                  </p>
                </div>

                <div className="bg-yellow-100 p-4 rounded-lg shadow-md w-1/3">
                  <h3 className="font-semibold text-xl text-yellow-700">
                    Pending Requests
                  </h3>
                  <p className="text-2xl font-bold text-yellow-800">
                    {pendingRequestsCount}
                  </p>
                </div>
                <div className="bg-yellow-100 p-4 rounded-lg shadow-md w-1/3">
                  <h3 className="font-semibold text-xl text-yellow-700">
                    Total Requests
                  </h3>
                  <p className="text-2xl font-bold text-yellow-800">
                    {newRequestsCount}
                  </p>
                </div>
              </div>
            )}
            <table className="w-full table-auto border">
              <thead>
                <tr className="bg-gray-200 text-black">
                  {getVisibleKeys().map((key) => (
                    <th key={key} className="p-2 border text-left">
                      {formatLabel(key)}
                    </th>
                  ))}
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item._id} className="border-b">
                    {getVisibleKeys().map((key) => (
                      <td key={key} className="p-2 border text-sm">
                        {renderCell(key, item[key], item)}
                      </td>
                    ))}
                    <td className="p-2 border text-sm flex space-x-2 items-center">
                      <VisibilityIcon
                        style={{ color: "blue", cursor: "pointer" }}
                        onClick={() => handleViewItem(item)}
                      />
                      {selectedCategory === "users" && (
                        <EditIcon
                          style={{ color: "orange", cursor: "pointer" }}
                          onClick={() => handleEditItem(item)}
                        />
                      )}
                      <DeleteIcon
                        style={{ color: "red", cursor: "pointer" }}
                        onClick={() => handleDeleteItem(item)}
                      />
                      {selectedCategory === "resource-requests" && (
                        <div className="flex gap-4 mt-2">
                          <button
                            onClick={() => handleSendRequest(item._id)}
                            className="px-4 py-1 bg-green-600 text-white rounded text-xs ml-2"
                            disabled={item.sent}
                          >
                            {item.sent ? "Request Sent" : "Send Request"}{" "}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {showAgencyCard && (
              <div className="fixed top-20 right-10 bg-white text-black p-4 rounded shadow-lg w-96 z-50 border">
                <h2 className="text-xl font-bold mb-4">Select an Agency</h2>
                <ul className="space-y-2 max-h-64 overflow-y-auto">
                  {agencyUsers.map((user) => (
                    <li
                      key={user._id}
                      onClick={() => setSelectedAgencyUser(user)}
                      className={`p-2 border rounded cursor-pointer hover:bg-blue-100 ${
                        selectedAgencyUser?._id === user._id
                          ? "bg-blue-200"
                          : ""
                      }`}
                    >
                      <strong>{user.name}</strong> — {user.email}
                    </li>
                  ))}
                </ul>

                {selectedAgencyResources && (
                  <div className="mt-4 text-sm border-t pt-2">
                    <h3 className="font-semibold text-base mb-2">
                      Resource Summary
                    </h3>
                    <div>
                      <strong>Firefighters:</strong>{" "}
                      {selectedAgencyResources.currentResources.firefighters}
                    </div>
                    <div>
                      <strong>Firetrucks:</strong>{" "}
                      {selectedAgencyResources.currentResources.firetrucks}
                    </div>
                    <div>
                      <strong>Helicopters:</strong>{" "}
                      {selectedAgencyResources.currentResources.helicopters}
                    </div>
                    <div>
                      <strong>Commanders:</strong>{" "}
                      {selectedAgencyResources.currentResources.commanders}
                    </div>
                    <div>
                      <strong>Heavy Equipment:</strong>{" "}
                      {selectedAgencyResources.heavyEquipment?.join(", ")}
                    </div>
                  </div>
                )}

                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    className={`px-4 py-2 rounded ${
                      isRequestSent || !selectedAgencyUser
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                    onClick={sendRequestToAgency}
                    disabled={isRequestSent || !selectedAgencyUser}
                  >
                    {isRequestSent ? "Request Sent" : "Confirm Send"}
                  </button>
                  <button
                    className="bg-gray-400 text-white px-4 py-2 rounded"
                    onClick={() => setShowAgencyCard(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {showCreateModal && (
              <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
                <div className="bg-white p-6 rounded-lg w-[400px] relative">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-black"
                  >
                    <CloseIcon />
                  </button>
                  <h2 className="text-lg font-semibold mb-4">Create User</h2>
                  <input
                    className="w-full p-2 mb-2 border rounded"
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  <input
                    className="w-full p-2 mb-2 border rounded"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                  <input
                    className="w-full p-2 mb-2 border rounded"
                    placeholder="Password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                  <input
                    className="w-full p-2 mb-2 border rounded"
                    type="file"
                    onChange={(e) => setImageFile(e.target.files[0])}
                  />
                  <button
                    onClick={async () => {
                      const form = new FormData();
                      form.append("name", formData.name);
                      form.append("email", formData.email);
                      form.append("password", formData.password);
                      if (imageFile) form.append("photo", imageFile);

                      try {
                        await axios.post(`${baseUrl}/create-user`, form, {
                          headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                          },
                        });
                        setShowCreateModal(false);
                        fetchData();
                        Swal.fire("User created!", "", "success");
                      } catch (err) {
                        console.error("Create failed", err);
                        Swal.fire("Error", "Failed to create user", "error");
                      }
                    }}
                    className="w-full bg-blue-600 text-white p-2 rounded"
                  >
                    Create
                  </button>
                </div>
              </div>
            )}

            {showEditModal && editData && (
              <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
                <div className="bg-white p-6 rounded-lg w-[400px] relative">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-black"
                  >
                    <CloseIcon />
                  </button>
                  <h2 className="text-lg font-semibold mb-4">Edit User</h2>

                  <input
                    className="w-full p-2 mb-2 border rounded"
                    placeholder="Name"
                    value={editData.name || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                  />

                  <input
                    className="w-full p-2 mb-2 border rounded"
                    placeholder="Email"
                    value={editData.email || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, email: e.target.value })
                    }
                  />

                  <input
                    className="w-full p-2 mb-2 border rounded"
                    placeholder="Password"
                    type="password"
                    onChange={(e) =>
                      setEditData({ ...editData, password: e.target.value })
                    }
                  />

                  <input
                    className="w-full p-2 mb-2 border rounded"
                    type="file"
                    onChange={(e) => setEditImageFile(e.target.files[0])}
                  />

                  <button
                    onClick={async () => {
                      const form = new FormData();
                      form.append("name", editData.name);
                      form.append("email", editData.email);
                      if (editData.password)
                        form.append("password", editData.password);
                      if (editImageFile) form.append("photo", editImageFile);

                      try {
                        await axios.put(
                          `${baseUrl}/users/${editData._id}`,
                          form,
                          {
                            headers: {
                              Authorization: `Bearer ${token}`,
                              "Content-Type": "multipart/form-data",
                            },
                          }
                        );
                        setShowEditModal(false);
                        fetchData();
                        Swal.fire(
                          "Updated!",
                          "User updated successfully",
                          "success"
                        );
                      } catch (err) {
                        console.error("Update failed", err);
                        Swal.fire("Error", "Failed to update user", "error");
                      }
                    }}
                    className="w-full bg-green-600 text-white p-2 rounded"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {showViewModal && viewData && (
              <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
                <div className="bg-white p-6 rounded-lg w-[600px] max-h-[80vh] overflow-y-auto relative">
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-black"
                  >
                    <CloseIcon />
                  </button>
                  <h2 className="text-lg font-semibold mb-4">
                    {selectedCategory === "users" && "User Details"}
                    {selectedCategory === "image-predictions" &&
                      "Image Prediction Details"}
                    {selectedCategory === "feature-predictions" &&
                      "Feature Prediction Details"}
                  </h2>

                  <div className="space-y-4">
                    {Object.entries(viewData).map(([key, value]) => {
                      if (["_id", "__v", "password"].includes(key)) return null;

                      return (
                        <div key={key} className="border-b pb-2">
                          <strong className="capitalize">
                            {formatLabel(key)}:
                          </strong>
                          <div className="mt-1">
                            {key === "imageUrl" || key === "camImageUrl" ? (
                              <img
                                src={value}
                                alt={key}
                                className="w-48 h-auto"
                              />
                            ) : typeof value === "object" ? (
                              <div className="text-sm space-y-1">
                                {Object.entries(value).map(([k, v]) => (
                                  <div key={k}>
                                    <strong>{formatLabel(k)}:</strong>{" "}
                                    {String(v)}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              String(value)
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 flex justify-between">
              <button
                className="px-4 py-2 border rounded"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </button>
              <span>Page {page}</span>
              <button
                className="px-4 py-2 border rounded"
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
