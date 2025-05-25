import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const ConfirmOtp = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const email = searchParams.get("email");

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5001/api/user/verify-otp", {
        email,
        otp,
      });
      const { name } = res.data;
      navigate("/signup", { state: { email, name, verified: true } });
    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid OTP");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white mt-24">
      <div className="p-8">
        <h2 className="text-3xl font-bold text-center font-serif mb-6">
          Confirm Your Email
        </h2>
        <form onSubmit={handleVerify}>
          <label className="block text-gray-700 font-bold mb-2">Enter OTP sent to {email}</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-2 border-2 border-black mb-4"
            maxLength={4}
            placeholder="4-digit OTP"
          />
          <button type="submit" className="w-full bg-red-700 text-white py-2 hover:bg-white hover:border-b-4 hover:border-red-700 hover:text-black">
            Verify
          </button>
        </form>
        {message && (
          <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmOtp;
