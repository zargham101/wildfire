import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

    try {
      const response = await fetch(
        "http://localhost:5001/api/user/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );


      let data = {};
      try {
        data = await response.json();
      } catch (jsonErr) {
        console.warn("Could not parse JSON:", jsonErr);
      }

      if (!response.ok) {
        const errorMsg = data.message || data.error || "Something went wrong";
        throw new Error(errorMsg);
      }

      setMessage("Password reset link has been sent to your email.");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      console.error("Error in forgot password:", err);
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
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-md shadow-lg text-white text-sm z-50 flex items-center justify-between gap-4
    ${message ? "bg-green-500" : "bg-red-500"}`}
        >
          <span>{message || error}</span>
          <button
            onClick={() => {
              setMessage("");
              setError("");
            }}
            className="ml-2 text-white font-bold"
          >
            &times;
          </button>
        </div>
      )}

      <div className=" p-8 max-w-md w-full">
        <h2 className="text-4xl font-bold text-center text-gray-700 font-serif">
          Forgot Password?
        </h2>
        <p className="text-gray-500 text-center mt-2 font-serif">
          Enter your email to receive a password reset link.
        </p>

        <form onSubmit={handleSubmit} className="mt-6">
          <label className="block text-gray-700 text-sm font-medium font-serif font-semibold">
            Email Address
          </label>
          <input
            type="email"
            className="w-full p-3 mt-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-red-700 mt-3 text-white py-2 hover:bg-white hover:border-b-4 hover:border-red-700 hover:text-black"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
