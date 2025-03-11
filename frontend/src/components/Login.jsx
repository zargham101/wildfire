import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5001/api/user/login",
        {
          email,
          password,
        }
      );
      const loggedInUser = response.data.user;

      localStorage.setItem("user", JSON.stringify(loggedInUser));


      localStorage.setItem("token", response.data.token);

      setSuccessMessage(response.data.message);
      setUser(loggedInUser);
      navigate("/predictionHomePage");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-white"
      style={{
        backgroundImage: `url('/images/texture.jpg')`,
        backgroundRepeat: "repeat",
      }}
    >
      <div className="w-full fixed top-0 left-0 z-50">
        {successMessage && (
          <div className="bg-green-500 text-white p-2 text-center">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="bg-red-500 text-white p-2 text-center">
            {errorMessage}
          </div>
        )}
      </div>

      <div className="p-8">
        <p className="text-4xl w-full font-bold font-serif  mb-6">
          Your username is your Email
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Username
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-2 border-2 border-black p-3"
            />
          </div>

          <div className="mb-4 relative">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full p-2 border-2 border-black  pr-10 p-3"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-9 right-3 text-gray-500 mt-2"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-red-700 text-white py-2  hover:bg-white hover:border-b-4 hover:border-red-700 hover:text-black"
          >
            Sign in
          </button>
        </form>

        <div className="mt-[60px] text-center">
          <p className="text-gray-700 font-serif font-semibold">
            Not a member?{" "}
            <Link to="/signup" className="text-blue-400  hover:underline">
              Sign Up
            </Link>
          </p>
          <p className="text-gray-700 font-serif font-semibold">
            I dont know my&nbsp;
            <Link
              to="/forgot-password"
              className="text-blue-400 hover:underline"
            >
              Password
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
