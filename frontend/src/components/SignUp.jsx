import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, X } from "lucide-react";
import axios from "axios";
import {useAuth} from "../routes/AuthContext"

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: ""
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    if (location.state?.verified) {
      setIsVerified(true);
      if (location.state?.name) setName(location.state.name);
      if (location.state?.email) setEmail(location.state.email);
    }
  }, [location.state]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "name":
        if (!value) error = "Name is required";
        break;
      case "email":
        if (!value) {
          error = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Invalid email format";
        }
        break;
      case "password":
        if (!value) {
          error = "Password is required";
        } else if (value.length < 6) {
          error = "Password must be at least 6 characters";
        }
        break;
      case "confirmPassword":
        if (value !== password) {
          error = "Passwords do not match";
        }
        break;
      case "otp":
        if (!value && otpSent) {
          error = "OTP is required";
        } else if (value && value.length !== 4) {
          error = "OTP must be 4 digits";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setFieldErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    
    // Validate name and email before sending OTP
    const nameError = validateField("name", name);
    const emailError = validateField("email", email);
    
    setFieldErrors({
      ...fieldErrors,
      name: nameError,
      email: emailError
    });

    if (nameError || emailError) return;

    try {
      const res = await axios.post("http://localhost:5001/api/user/send-otp", {
        name,
        email,
      });
      setSuccessMessage(res.data.message);
      setOtpSent(true);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to send OTP");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpError = validateField("otp", otp);
    setFieldErrors(prev => ({ ...prev, otp: otpError }));
    
    if (otpError) return;

    try {
      const res = await axios.post("http://localhost:5001/api/user/verify-otp", {
        email,
        otp
      });
      setIsVerified(true);
      setSuccessMessage(res.data.message);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Invalid OTP");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const passwordError = validateField("password", password);
    const confirmPasswordError = validateField("confirmPassword", confirmPassword);
    
    setFieldErrors({
      ...fieldErrors,
      password: passwordError,
      confirmPassword: confirmPasswordError
    });

    if (passwordError || confirmPasswordError) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    if (image) formData.append("image", image);

    try {
      const response = await axios.post("http://localhost:5001/api/user/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      login(response.data.user);
      setSuccessMessage(response.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Registration failed");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5001/api/user/google?mode=signup";
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white mt-24">
      <div className="p-8 w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-6 font-serif">
          Become Part of the Safe Community
        </h1>
        <h2 className="text-2xl font-bold text-center mb-6 font-serif">
          Create an Account
        </h2>

        <form onSubmit={isVerified ? handleSubmit : (otpSent ? handleVerifyOtp : handleSendOtp)}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Name *</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleBlur}
              placeholder="John Doe"
              className={`w-full p-2 border-2 ${fieldErrors.name ? "border-red-500" : "border-black"}`}
              required
              disabled={otpSent}
            />
            {fieldErrors.name && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.name}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email *</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={handleBlur}
              placeholder="johndoe@example.com"
              className={`w-full p-2 border-2 ${fieldErrors.email ? "border-red-500" : "border-black"}`}
              required
              disabled={otpSent}
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
            )}
          </div>

          {otpSent && !isVerified && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">OTP *</label>
              <input
                type="text"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                onBlur={handleBlur}
                placeholder="Enter 4-digit OTP"
                className={`w-full p-2 border-2 ${fieldErrors.otp ? "border-red-500" : "border-black"}`}
                required
              />
              {fieldErrors.otp && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.otp}</p>
              )}
            </div>
          )}

          {isVerified && (
            <>
              <div className="mb-4 relative">
              <label className="block text-gray-700 text-sm font-bold mb-2">Password *</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={handleBlur}
                placeholder="Enter your password"
                className={`w-full p-2 border-2 ${fieldErrors.password ? "border-red-500" : "border-black"} pr-10`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-9 right-3 text-gray-500 mt-1"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {fieldErrors.password && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>
              )}
            </div>

            <div className="mb-4 relative">
              <label className="block text-gray-700 text-sm font-bold mb-2">Confirm Password *</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={handleBlur}
                placeholder="Confirm your password"
                className={`w-full p-2 border-2 ${fieldErrors.confirmPassword ? "border-red-500" : "border-black"} pr-10`}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-9 right-3 text-gray-500 mt-1"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {fieldErrors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.confirmPassword}</p>
              )}
            </div>
              <div className="mb-4">
                <label htmlFor="file-upload" className="block text-sm mb-2 font-bold text-gray-700">Upload Image</label>
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleImageChange}
                  className="w-full"
                />
                {image && (
                  <div className="mt-4 relative w-32 h-32">
                    <img
                      src={URL.createObjectURL(image)}
                      onClick={() => setImage(null)}
                      alt="Selected"
                      className="w-32 h-32 object-cover cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={() => setImage(null)}
                      className="absolute -top-2 -right-2 bg-white border border-gray-300 rounded-full p-1 shadow hover:bg-red-500 hover:text-white"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-red-700 text-white py-2 hover:bg-white hover:border-b-4 hover:border-red-700 hover:text-black"
          >
            {isVerified ? "Sign Up" : otpSent ? "Verify OTP" : "Send OTP"}
          </button>
        </form>

        {/* Google Sign-In Button */}
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

        {errorMessage && !Object.values(fieldErrors).some(err => err) && (
          <div className="mt-4 rounded-md bg-red-100 border border-red-400 text-red-700 px-4 py-3">
            <strong className="font-bold">Error:</strong> <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mt-4 rounded-md bg-green-100 border border-green-400 text-green-700 px-4 py-3">
            <strong className="font-bold">Success:</strong> <span>{successMessage}</span>
          </div>
        )}

        <div className="mt-4 text-center">
          <p className="text-gray-700 font-serif font-semibold">
            Already a member?{" "}
            <Link to="/login" className="text-blue-400 font-serif hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;