import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { HiEye, HiEyeOff } from "react-icons/hi";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const resetToken = params.get("token");

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage("");
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5001/api/user/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ resetToken, newPassword }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Something went wrong");
      }

      setMessage("Password reset successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      console.error("Error in reset password:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen px-4 relative"
      style={{
        backgroundImage: `url('images/texture.jpg')`,
        backgroundRepeat: "repeat",
      }}
    >
      {(message || error) && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-md shadow-lg text-white text-sm z-50 transition-all duration-300
          ${message ? "bg-green-500" : "bg-red-500"}`}
        >
          {message || error}
        </div>
      )}

      <div className="p-8 max-w-md w-full">
        <p className="text-black text-center mt-2 font-serif font-bold text-2xl">
          Enter a new password to reset your account password.
        </p>

        <form onSubmit={handleSubmit} className="mt-6">
          <label className="block text-gray-700 text-sm font-semibold font-serif">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full p-3 mt-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <span
              className="absolute right-3 mt-[15px] top-3 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <HiEyeOff /> : <HiEye />}
            </span>
          </div>

          <label className="block text-gray-700 text-sm font-medium mt-4 font-semibold font-serif">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="w-full p-3 mt-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span
              className="absolute right-3 top-3 mt-[15px] cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <HiEyeOff /> : <HiEye />}
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-red-700 text-white py-2 mt-4 hover:bg-white hover:border-b-4 hover:border-red-700 hover:text-black"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
