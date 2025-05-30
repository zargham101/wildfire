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
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token] = useState(localStorage.getItem("admin_token"));
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [userNameMap, setUserNameMap] = useState({});
  const [agencyUsers, setAgencyUsers] = useState([]);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [selectedAgencyUser, setSelectedAgencyUser] = useState(null);
  const [showAgencyCard, setShowAgencyCard] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
const [editData, setEditData] = useState(null);
const [editImageFile, setEditImageFile] = useState(null);

  const baseUrl = "http://localhost:5001/api/admin";

  useEffect(() => {
    if (!token) navigate("/login");
    else fetchData();
  }, [selectedCategory, page]);

  const fetchUserName = async (userId) => {
    if (userNameMap[userId]) return userNameMap[userId];
    try {
      const res = await axios.get(
        `http://localhost:5001/api/user/user-details/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const name = res.data.name;
      setUserNameMap((prev) => ({ ...prev, [userId]: name }));
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

        const enrichedData = await Promise.all(
          requestRes.data.map(async (item) => ({
            ...item,
            userName: await fetchUserName(item.userId),
          }))
        );

        setData(enrichedData);
        setAgencyUsers(agencyRes.data.data || []);
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
      await axios.post(
        `http://localhost:5001/api/agency/resource-requests/${selectedRequestId}/send-request`,
        { agencyId: selectedAgencyUser._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowAgencyCard(false);
      fetchData();
      alert("Request sent successfully!");
    } catch (err) {
      console.error("Failed to send request", err);
    }
  };

  const handleViewItem = (item) => {
    console.log("View:", item);
  };

  const handleEditItem = (item) => {
  setEditData(item);
  setShowEditModal(true);
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
        await axios.delete(
          `${baseUrl}/delete/${selectedCategory}/${item._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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
      return ["userName", "requiredResources", "status"];

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
            <strong>Heavy Equipment:</strong>{" "}
            {value.heavyEquipment?.join(", ")}
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
              onClick={() => setSelectedCategory("resource-requests")}
              className="w-full text-left hover:text-yellow-400"
            >
              Resource Requests
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
                if (selectedCategory === "users") setShowCreateModal(true);
                else navigate(`/admin/create/${selectedCategory}`);
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
                      <EditIcon
                        style={{ color: "orange", cursor: "pointer" }}
                        onClick={() => handleEditItem(item)}
                      />
                      <DeleteIcon
                        style={{ color: "red", cursor: "pointer" }}
                        onClick={() => handleDeleteItem(item)}
                      />
                      {selectedCategory === "resource-requests" && (
                        <button
                          onClick={() => handleSendRequest(item._id)}
                          className="px-4 py-1 bg-green-600 text-white rounded text-xs ml-2"
                        >
                          Send Request
                        </button>
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
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded"
                    onClick={sendRequestToAgency}
                    disabled={!selectedAgencyUser}
                  >
                    Confirm Send
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
