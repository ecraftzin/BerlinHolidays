// src/Components/Admin/AdminHeader.jsx
import React from "react";
import { FaBars, FaBell, FaUserCircle, FaMoon, FaSun } from "react-icons/fa";

const AdminHeader = ({ toggleSidebar, isDarkMode, toggleDarkMode }) => {
  const currentUser = JSON.parse(localStorage.getItem("signupData")) || {
    name: "Admin User",
    email: "admin@berlinholidays.com",
  };

  return (
    <header
      className={`sticky top-0 z-30 border-b shadow-sm transition-colors duration-300 ${
        isDarkMode
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between px-4 lg:px-6 py-4">
        {/* Left Section - Menu Toggle */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
            }`}
            style={{ color: "#c49e72" }}
          >
            <FaBars size={20} />
          </button>
          <div className="hidden lg:block">
            <h1
              className={`text-xl font-bold font-Garamond ${
                isDarkMode ? "text-white" : ""
              }`}
              style={!isDarkMode ? { color: "#1e1e1e" } : {}}
            >
              Admin Dashboard
            </h1>
            <p className={`text-xs font-Lora ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              Welcome back, {currentUser.name}
            </p>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-3">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
            }`}
            style={{ color: "#c49e72" }}
            title={isDarkMode ? "Light Mode" : "Dark Mode"}
          >
            {isDarkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
          </button>

          {/* Notifications */}
          <button
            className={`relative p-2 rounded-lg transition-colors ${
              isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
            }`}
            style={{ color: "#c49e72" }}
            title="Notifications"
          >
            <FaBell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Profile */}
          <div className={`flex items-center space-x-2 pl-3 border-l ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}>
            <div className="hidden md:block text-right">
              <p
                className={`text-sm font-semibold font-Garamond ${
                  isDarkMode ? "text-white" : ""
                }`}
                style={!isDarkMode ? { color: "#1e1e1e" } : {}}
              >
                {currentUser.name}
              </p>
              <p className={`text-xs font-Lora ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                {currentUser.email}
              </p>
            </div>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: "#c49e72" }}
            >
              <FaUserCircle size={24} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;

