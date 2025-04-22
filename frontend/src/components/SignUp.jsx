import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { Eye, EyeOff, X } from "lucide-react";
import axios from "axios";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    if (image) formData.append("image", image);

    try {
      const response = await axios.post(
        "http://localhost:5001/api/user/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccessMessage(response.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.log("isko b dekho:::", error.response.data.message);
      setErrorMessage(error.response?.data?.message || "Registration failed");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5001/api/user/google";
  };

  const isPasswordMismatch =
    confirmPassword.length > 0 && confirmPassword !== password;

  return (
    <div className="flex justify-center items-center min-h-screen bg-white mt-24">
      <div className="p-8">
        <h1 className="text-4xl font-bold text-center mb-6 font-serif">
          Become Part of the Safe Community
        </h1>
        <h2 className="text-2xl font-bold text-center mb-6 font-serif">
          Create an Account
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2 cursor-help"
              title="Enter full name"
            >
              Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full p-2 border-2 border-black"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2 cursor-help"
              title="Enter complete email"
            >
              Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="johndoe@example.com"
              className="w-full p-2 border-2 border-black"
            />
          </div>

          <div className="mb-4 relative">
            <label
              className="block text-gray-700 text-sm font-bold mb-2 cursor-help"
              title="Enter Password"
            >
              Password *
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full p-2 border-2 border-black pr-10"
            />

            <div className="mb-4 mt-4 relative">
              <label
                className="block text-gray-700 text-sm font-bold mb-2 cursor-help"
                title="Confirm your password"
              >
                Confirm Password *
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className={`w-full p-2 border-2 ${
                  isPasswordMismatch ? "border-red-500" : "border-black"
                }`}
              />
            </div>
            {isPasswordMismatch && (
              <p className="text-red-500 text-sm mt-1">
                Passwords do not match.
              </p>
            )}

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-9 right-3 text-gray-500 mt-1"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="mb-4">
            <label
              htmlFor="file-upload"
              className="w-full p-2 bg-red-700 text-white text-center cursor-pointer rounded-md hover:bg-red-800 cursor-help"
              title="Upload your profile picture"
            >
              Upload Image
            </label>
            <input
              id="file-upload"
              type="file"
              onChange={handleImageChange}
              className="hidden"
            />

            {image && (
              <div className="mt-4 relative w-32 h-32">
                <img
                  src={URL.createObjectURL(image)}
                  onClick={() => setImage(null)}
                  alt="Selected Image"
                  className="w-32 h-32 object-cover"
                  title="Click to remove"
                />
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="absolute -top-2 -right-2 bg-white border border-gray-300 rounded-full p-1 shadow hover:bg-red-500 hover:text-white transition"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-red-700 text-white py-2 hover:bg-white hover:border-b-4 hover:border-red-700 hover:text-black"
          >
            Sign Up
          </button>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex items-center justify-center w-full mt-4 bg-white text-black border border-gray-300 py-2 rounded hover:bg-gray-100 transition"
          >
            <img
              src="/images/gLogo.png"
              alt="Google Logo"
              className="w-5 h-5 mr-3"
            />
            Continue with Google
          </button>
        </form>

        {errorMessage && (
          <div className="mt-4 rounded-md bg-red-100 border border-red-400 text-red-700 px-4 py-3">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mt-4 rounded-md bg-green-100 border border-green-400 text-green-700 px-4 py-3">
            <strong className="font-bold">Success: </strong>
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}

        <div className="mt-4 text-center">
          <p className="text-gray-700 font-serif font-semibold">
            Already a member?{" "}
            <Link
              to="/login"
              className="text-blue-400 font-serif hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
