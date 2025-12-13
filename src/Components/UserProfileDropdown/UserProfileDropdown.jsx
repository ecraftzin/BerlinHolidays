// src/Components/UserProfileDropdown/UserProfileDropdown.jsx
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle, FaUser, FaCalendarAlt, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../../Context/AuthContext";

const UserProfileDropdown = ({ size = 35, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, customerProfile, isAuthenticated, signOut, getUserInitial } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsOpen(false);
    try {
      await signOut();
      // Force navigation and page refresh to ensure clean state
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout anyway
      window.location.href = "/";
    }
  };

  // If not authenticated, show login link
  if (!isAuthenticated) {
    return (
      <Link to="/login" className={`cursor-pointer group ${className}`} title="Login">
        <FaUserCircle
          className="text-white group-hover:scale-110 transition-all duration-300"
          size={size}/>
      </Link>
    );
  }

  // If authenticated, show user initial with dropdown
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* User Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center rounded-full bg-white text-khaki font-bold hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-khaki"
        style={{
          width: size,
          height: size,
          fontSize: size * 0.45,
        }}
        title={customerProfile?.name || user?.email || "User"}
      >
        {getUserInitial()}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-normalBlack rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-50 animate-fadeIn">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <p className="text-sm font-semibold text-lightBlack dark:text-white font-Garamond truncate">
              {customerProfile?.name || "User"}
            </p>
            <p className="text-xs text-gray dark:text-lightGray font-Lora truncate">
              {user?.email}
            </p>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <Link
              to="/my-account"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-3 text-sm text-lightBlack dark:text-white hover:bg-khaki/10 dark:hover:bg-khaki/20 transition-colors duration-200"
            >
              <FaUser className="mr-3 text-khaki" size={16} />
              <span className="font-Lora">My Account</span>
            </Link>

            <Link
              to="/my-bookings"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-3 text-sm text-lightBlack dark:text-white hover:bg-khaki/10 dark:hover:bg-khaki/20 transition-colors duration-200"
            >
              <FaCalendarAlt className="mr-3 text-khaki" size={16} />
              <span className="font-Lora">My Bookings</span>
            </Link>
          </div>

          {/* Logout Button */}
          <div className="border-t border-gray-100 dark:border-gray-700 pt-1">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
            >
              <FaSignOutAlt className="mr-3" size={16} />
              <span className="font-Lora">Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;

