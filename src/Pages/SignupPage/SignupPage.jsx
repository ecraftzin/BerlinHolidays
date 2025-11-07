// src/Pages/SignupPage/SignupPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaUser, FaPhone, FaUserPlus, FaEye, FaEyeSlash } from "react-icons/fa";
import { BiSun } from "react-icons/bi";
import { IoMoonSharp } from "react-icons/io5";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!phoneNumber.trim()) {
      setError("Phone number is required");
      return;
    }
    if (!password.trim()) {
      setError("Password is required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    // Phone number validation (basic)
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(phoneNumber.replace(/[\s-]/g, ""))) {
      setError("Please enter a valid phone number");
      return;
    }

    // DEMO ONLY - In production, this would call an API
    // Store user data in localStorage (for demo purposes)
    const userData = {
      name,
      email,
      phoneNumber,
      password, // In production, never store plain passwords!
    };
    
    localStorage.setItem("signupData", JSON.stringify(userData));
    
    setSuccess("Account created successfully! Redirecting to login...");
    
    // Navigate to login page after 2 seconds
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-whiteSmoke via-white to-khaki/10 dark:from-normalBlack dark:via-mediumBlack dark:to-lightBlack relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-khaki/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-khaki/20 rounded-full blur-3xl"></div>
      </div>

      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-6 right-6 p-3 bg-white dark:bg-mediumBlack rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 group"
        aria-label="Toggle Dark Mode"
      >
        {isDarkMode ? (
          <BiSun className="text-2xl text-khaki group-hover:rotate-180 transition-transform duration-500" />
        ) : (
          <IoMoonSharp className="text-2xl text-khaki group-hover:-rotate-12 transition-transform duration-500" />
        )}
      </button>

      {/* Signup Container */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-khaki rounded-full mb-4 shadow-lg">
            <FaUserPlus className="text-white text-4xl" />
          </div>
          <h1 className="text-4xl font-bold text-lightBlack dark:text-white font-Garamond mb-2">
            Create Account
          </h1>
          <p className="text-gray dark:text-lightGray font-Lora">
            Join Berlin Holidays for exclusive experiences
          </p>
        </div>

        {/* Signup Form Card */}
        <div className="bg-white dark:bg-mediumBlack rounded-2xl shadow-2xl p-8 md:p-10 backdrop-blur-sm border border-gray-100 dark:border-gray/20">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-lightBlack dark:text-white font-Garamond uppercase tracking-wider"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaUser className="text-khaki text-lg" />
                </div>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter your full name"
                  className="w-full pl-12 pr-4 py-4 bg-whiteSmoke dark:bg-normalBlack border-2 border-transparent focus:border-khaki rounded-lg text-lightBlack dark:text-white placeholder-gray dark:placeholder-lightGray transition-all duration-300 outline-none font-Lora"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-lightBlack dark:text-white font-Garamond uppercase tracking-wider"
              >
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaEnvelope className="text-khaki text-lg" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your.email@example.com"
                  className="w-full pl-12 pr-4 py-4 bg-whiteSmoke dark:bg-normalBlack border-2 border-transparent focus:border-khaki rounded-lg text-lightBlack dark:text-white placeholder-gray dark:placeholder-lightGray transition-all duration-300 outline-none font-Lora"
                />
              </div>
            </div>

            {/* Phone Number Input */}
            <div className="space-y-2">
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-lightBlack dark:text-white font-Garamond uppercase tracking-wider"
              >
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaPhone className="text-khaki text-lg" />
                </div>
                <input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  placeholder="Enter your phone number"
                  className="w-full pl-12 pr-4 py-4 bg-whiteSmoke dark:bg-normalBlack border-2 border-transparent focus:border-khaki rounded-lg text-lightBlack dark:text-white placeholder-gray dark:placeholder-lightGray transition-all duration-300 outline-none font-Lora"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-lightBlack dark:text-white font-Garamond uppercase tracking-wider"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaLock className="text-khaki text-lg" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Create a strong password"
                  className="w-full pl-12 pr-12 py-4 bg-whiteSmoke dark:bg-normalBlack border-2 border-transparent focus:border-khaki rounded-lg text-lightBlack dark:text-white placeholder-gray dark:placeholder-lightGray transition-all duration-300 outline-none font-Lora"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray hover:text-khaki transition-colors duration-300"
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-xl" />
                  ) : (
                    <FaEye className="text-xl" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-red-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm text-red-700 dark:text-red-400 font-Lora">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm text-green-700 dark:text-green-400 font-Lora">
                    {success}
                  </p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-khaki hover:bg-khaki/90 text-white font-Garamond uppercase tracking-wider py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg font-semibold relative overflow-hidden group"
            >
              <span className="relative z-10">Create Account</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray dark:text-lightGray font-Lora">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-khaki hover:text-khaki/80 font-semibold transition-colors duration-300"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center mt-6 text-sm text-gray dark:text-lightGray font-Lora">
          © 2024 Berlin Holidays. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default SignupPage;

