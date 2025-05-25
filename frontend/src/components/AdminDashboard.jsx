import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("users");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("admin_token"));
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [imageFile, setImageFile] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const baseUrl = "http://localhost:5001/api/admin";

  useEffect(() => {
    if (!token) navigate("/login");
    else fetchData();
  }, [selectedCategory, page]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${baseUrl}/${selectedCategory}?page=${page}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`${baseUrl}/${selectedCategory}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUserCreation = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    if (imageFile) {
      formDataToSend.append("image", imageFile);
    }
    try {
      await axios.post("http://localhost:5001/api/user/register", formDataToSend);
      setOpenDialog(false);
      setFormData({ name: "", email: "", password: "" });
      setImageFile(null);
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 5000);
      fetchData();
    } catch (err) {
      console.error("User creation failed", err);
    }
  };

  const openCreateModal = () => {
    if (selectedCategory === "users") {
      setOpenDialog(true);
    } else if (selectedCategory === "image-predictions") {
      navigate("/predict/cam/result");
    } else if (selectedCategory === "feature-predictions") {
      navigate("/predictionHomePage");
    }
  };

  const formatLabel = (label) => {
    return label
      .replace(/_/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/^./, str => str.toUpperCase());
  };

  const renderCell = (key, value) => {
    if (key === "userId" && value && typeof value === "object") {
      return value.name || "Unknown";
    }
    if (key === "input" && value && typeof value === "object") {
      return Object.entries(value).map(([k, v]) => (
        <div key={k}><strong>{formatLabel(k)}:</strong> {String(v)}</div>
      ));
    }
    if (key === "imageUrl" || key === "camImageUrl") {
      return <img src={value} alt={key} className="w-24 h-auto" />;
    }
    return String(value);
  };

  const getVisibleKeys = () => {
    if (!Array.isArray(data) || data.length === 0) return [];
    const keys = Object.keys(data[0]);
    if (selectedCategory === "image-predictions") {
      return ["userId", "imageUrl", "predictionResult", "noWildfireConfidence", "wildfireConfidence", "camImageUrl"];
    } else if (selectedCategory === "feature-predictions") {
      return ["userId", "input", "prediction"];
    }
    return keys.filter((key) => key !== "_id" && key !== "__v");
  };

  return (
    <div className={`flex min-h-screen mt-[90px] ${isDarkTheme ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <aside className={`w-64 ${isDarkTheme ? 'bg-gray-950' : 'bg-gray-800'} text-white p-4`}>
        <h2 className="text-lg font-semibold mb-6">Admin Panel</h2>
        <ul className="space-y-2">
          <li><button onClick={() => setSelectedCategory("users")} className="w-full text-left hover:text-yellow-400">Users</button></li>
          <li><button onClick={() => setSelectedCategory("image-predictions")} className="w-full text-left hover:text-yellow-400">Image Predictions</button></li>
          <li><button onClick={() => setSelectedCategory("feature-predictions")} className="w-full text-left hover:text-yellow-400">Processed Predictions</button></li>
          <li><button onClick={() => setSelectedCategory("reviews")} className="w-full text-left hover:text-yellow-400">Reviews</button></li>
        </ul>
      </aside>
      <main className="flex-1 p-6">
        <div className="flex justify-between mb-4 items-center">
          <h1 className="text-2xl font-bold capitalize">{selectedCategory.replace("-", " ")}</h1>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={openCreateModal}>+ Create</button>
            <button onClick={() => setIsDarkTheme(!isDarkTheme)} className="text-2xl">
              {isDarkTheme ? "🌞" : "🌙"}
            </button>
          </div>
        </div>

        {loading ? (<p>Loading...</p>) : (
          <>
            <table className="w-full table-auto border">
              <thead>
                <tr className="bg-gray-200 text-black">
                  {getVisibleKeys().map((key) => (
                    <th key={key} className="p-2 border text-left">{formatLabel(key === "userId" ? "User" : key)}</th>
                  ))}
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(data) && data.map((item) => (
                  <tr key={item._id} className="border-b">
                    {getVisibleKeys().map((key) => (
                      <td key={key} className="p-2 border text-sm">{renderCell(key, item[key])}</td>
                    ))}
                    <td className="p-2 border text-sm flex space-x-2">
                      <VisibilityIcon style={{ color: 'blue', cursor: 'pointer' }} onClick={() => alert(JSON.stringify(item, null, 2))} />
                      {selectedCategory === "users" && (
                        <EditIcon style={{ color: 'orange', cursor: 'pointer' }} onClick={() => openCreateModal(item)} />
                      )}
                      <DeleteIcon style={{ color: 'red', cursor: 'pointer' }} onClick={() => deleteItem(item._id)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 flex justify-between">
              <button className="px-4 py-2 border rounded" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
              <span>Page {page}</span>
              <button className="px-4 py-2 border rounded" onClick={() => setPage((p) => p + 1)}>Next</button>
            </div>
          </>
        )}

        {openDialog && selectedCategory === "users" && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-xl w-full max-w-lg">
              <h2 className="text-xl font-bold mb-4">Create User</h2>
              <input className="w-full p-2 border border-gray-300 rounded mb-3" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              <input className="w-full p-2 border border-gray-300 rounded mb-3" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              <input type="password" className="w-full p-2 border border-gray-300 rounded mb-3" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
              <input type="file" className="w-full mb-3" onChange={(e) => setImageFile(e.target.files[0])} />
              <div className="flex justify-end space-x-2">
                <button className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100" onClick={() => setOpenDialog(false)}>Cancel</button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={handleUserCreation}>Create</button>
              </div>
            </div>
          </div>
        )}

        {showSuccessPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg shadow-xl flex items-center space-x-4">
              <span className="text-3xl">✅</span>
              <span className="text-lg font-medium">User created successfully!</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}