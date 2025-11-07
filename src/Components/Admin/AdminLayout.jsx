// src/Components/Admin/AdminLayout.jsx
import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { DarkModeProvider } from "../../Context/DarkModeContext";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize from localStorage
    const savedMode = localStorage.getItem("darkMode");
    return savedMode === "true";
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const auth = localStorage.getItem("auth");
    if (!auth) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    // Apply dark mode to document
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    // Save preference to localStorage
    localStorage.setItem("darkMode", isDarkMode.toString());
  }, [isDarkMode]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900" : ""
      }`}
      style={!isDarkMode ? { backgroundColor: "#f7f5f2" } : {}}
    >
      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} isDarkMode={isDarkMode} />

      {/* Main Content Area */}
      <div className="lg:ml-64 min-h-screen flex flex-col">
        {/* Header */}
        <AdminHeader
          toggleSidebar={toggleSidebar}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6">
          <DarkModeProvider isDarkMode={isDarkMode}>
            <Outlet />
          </DarkModeProvider>
        </main>

        {/* Footer */}
        <footer
          className={`border-t py-4 px-6 transition-colors duration-300 ${
            isDarkMode
              ? "border-gray-700 bg-gray-800 text-gray-300"
              : "border-gray-200 bg-white text-gray-600"
          }`}
        >
          <div className="flex flex-col md:flex-row items-center justify-between text-sm font-Lora">
            <p>© 2024 Berlin Holidays, Wayanad. All rights reserved.</p>
            <p className="mt-2 md:mt-0">
              Powered by <span className="font-semibold" style={{ color: "#c49e72" }}>Admin Panel v1.0</span>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;

