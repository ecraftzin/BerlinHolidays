// src/Pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaUserShield, FaEye, FaEyeSlash } from "react-icons/fa";
import { BiSun } from "react-icons/bi";
import { IoMoonSharp } from "react-icons/io5";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // DEMO ONLY - replace with real API
    if (email === "admin@berlinholidays.com" && password === "admin123") {
      localStorage.setItem("auth", "1"); // simple flag for demo
      navigate("/admin/dashboard");
    } else {
      setError("Invalid email or password. Please try again.");
    }
  };

  const handleDarkMode = () => {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-whiteSmoke via-white to-gray-50 dark:from-normalBlack dark:via-mediumBlack dark:to-Black relative overflow-hidden font-Lora">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-khaki opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-khaki opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-khaki opacity-5 rounded-full blur-3xl"></div>
      </div>

      {/* Dark Mode Toggle */}
      <div className="absolute top-8 right-8 z-20">
        <button
          onClick={handleDarkMode}
          className="p-3 rounded-full bg-white dark:bg-normalBlack shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          {isDarkMode ? (
            <BiSun
              className="text-khaki group-hover:rotate-90 transition-all duration-300"
              size={24}
            />
          ) : (
            <IoMoonSharp
              className="text-khaki group-hover:rotate-[360deg] transition-all duration-300"
              size={24}
            />
          )}
        </button>
      </div>

      {/* Back to Home Link */}
      <Link
        to="/"
        className="absolute top-8 left-8 z-20 flex items-center gap-2 text-lightBlack dark:text-white hover:text-khaki dark:hover:text-khaki transition-all duration-300 font-Garamond uppercase text-sm tracking-wider"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Home
      </Link>

      {/* Login Container */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-khaki rounded-full mb-4 shadow-lg">
            <FaUserShield className="text-white text-4xl" />
          </div>
          <h1 className="text-4xl font-bold text-lightBlack dark:text-white font-Garamond mb-2">
            Welcome Back
          </h1>
          <p className="text-gray dark:text-lightGray font-Lora">
            Sign in to access your admin dashboard
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white dark:bg-mediumBlack rounded-2xl shadow-2xl p-8 md:p-10 backdrop-blur-sm border border-gray-100 dark:border-gray/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-lightBlack dark:text-white font-Garamond uppercase tracking-wider"
              >
                Email Address
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
                  placeholder="admin@berlinholidays.com"
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
                Password
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
                  placeholder="Enter your password"
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

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-khaki hover:bg-khaki/90 text-white font-Garamond uppercase tracking-wider py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg font-semibold relative overflow-hidden group"
            >
              <span className="relative z-10">Sign In</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
          </form>

          {/* Demo Credentials Info */}
          <div className="mt-6 p-4 bg-khaki/10 dark:bg-khaki/5 rounded-lg border border-khaki/20">
            <p className="text-xs text-center text-gray dark:text-lightGray font-Lora mb-2">
              <span className="font-semibold text-khaki">Demo Credentials:</span>
            </p>
            <p className="text-xs text-center text-gray dark:text-lightGray font-Lora">
              Email: admin@berlinholidays.com
            </p>
            <p className="text-xs text-center text-gray dark:text-lightGray font-Lora">
              Password: admin123
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

export default LoginPage;
