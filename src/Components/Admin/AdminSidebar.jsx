// src/Components/Admin/AdminSidebar.jsx
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBlog,
  FaSearch,
  FaBed,
  FaTags,
  FaGift,
  FaUtensils,
  FaChevronDown,
  FaChevronRight,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaHotel,
  FaCalendarAlt,
  FaDollarSign,
  FaListAlt,
  FaQuestionCircle,
} from "react-icons/fa";

const AdminSidebar = ({ isOpen, toggleSidebar, isDarkMode }) => {
  const navigate = useNavigate();
  const [expandedMenus, setExpandedMenus] = useState({
    rooms: false,
    restaurant: false,
  });

  const toggleMenu = (menu) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/login");
  };

  const menuItems = [
    {
      name: "Dashboard",
      icon: FaTachometerAlt,
      path: "/admin/dashboard",
    },
    {
      name: "Blog Posts",
      icon: FaBlog,
      path: "/admin/blog",
    },
    {
      name: "SEO Settings",
      icon: FaSearch,
      path: "/admin/seo",
    },
    {
      name: "Rooms",
      icon: FaBed,
      hasSubmenu: true,
      key: "rooms",
      submenu: [
        { name: "Room Types", icon: FaHotel, path: "/admin/rooms/types" },
        { name: "Rate Plans", icon: FaDollarSign, path: "/admin/rooms/rate-plans" },
        { name: "Rates Calendar", icon: FaCalendarAlt, path: "/admin/rooms/rates" },
        { name: "Availability", icon: FaListAlt, path: "/admin/rooms/availability" },
      ],
    },
    {
      name: "Pricing Plans",
      icon: FaTags,
      path: "/admin/pricing-plans",
    },
    {
      name: "Special Offers",
      icon: FaGift,
      path: "/admin/special-offers",
    },
    {
      name: "FAQ",
      icon: FaQuestionCircle,
      path: "/admin/faq",
    },
    {
      name: "Restaurant",
      icon: FaUtensils,
      hasSubmenu: true,
      key: "restaurant",
      submenu: [
        { name: "Categories", icon: FaListAlt, path: "/admin/restaurant/categories" },
        { name: "Menu Items", icon: FaUtensils, path: "/admin/restaurant/menu-items" },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full border-r z-50 transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 w-64 flex flex-col ${
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        }`}
        style={!isDarkMode ? { backgroundColor: "#f7f5f2" } : {}}
      >
        {/* Logo Section */}
        <div className={`p-6 border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#c49e72" }}>
                <FaHotel className="text-white text-xl" />
              </div>
              <div>
                <h2
                  className={`text-lg font-bold font-Garamond ${
                    isDarkMode ? "text-white" : ""
                  }`}
                  style={!isDarkMode ? { color: "#1e1e1e" } : {}}
                >
                  Berlin Holidays
                </h2>
                <p className={`text-xs font-Lora ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Admin Panel
                </p>
              </div>
            </div>
            <button
              onClick={toggleSidebar}
              className={`lg:hidden ${
                isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {menuItems.map((item, index) => (
              <li key={index}>
                {item.hasSubmenu ? (
                  <>
                    <button
                      onClick={() => toggleMenu(item.key)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 font-Lora text-sm group ${
                        isDarkMode
                          ? "text-gray-300 hover:bg-gray-700"
                          : "text-gray-700 hover:bg-white/50"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className="text-lg group-hover:scale-110 transition-transform" style={{ color: "#c49e72" }} />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      {expandedMenus[item.key] ? (
                        <FaChevronDown className="text-xs" />
                      ) : (
                        <FaChevronRight className="text-xs" />
                      )}
                    </button>
                    {expandedMenus[item.key] && (
                      <ul className="mt-1 ml-4 space-y-1">
                        {item.submenu.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <NavLink
                              to={subItem.path}
                              className={({ isActive }) =>
                                `flex items-center space-x-3 px-4 py-2 rounded-lg text-sm transition-all duration-200 font-Lora ${
                                  isActive
                                    ? "text-white font-semibold shadow-md"
                                    : isDarkMode
                                    ? "text-gray-400 hover:bg-gray-700"
                                    : "text-gray-600 hover:bg-white/50"
                                }`
                              }
                              style={({ isActive }) =>
                                isActive ? { backgroundColor: "#c49e72" } : {}
                              }
                            >
                              <subItem.icon className="text-base" />
                              <span>{subItem.name}</span>
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 font-Lora text-sm group ${
                        isActive
                          ? "text-white font-semibold shadow-md"
                          : isDarkMode
                          ? "text-gray-300 hover:bg-gray-700"
                          : "text-gray-700 hover:bg-white/50"
                      }`
                    }
                    style={({ isActive }) =>
                      isActive ? { backgroundColor: "#c49e72" } : {}
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon
                          className="text-lg group-hover:scale-110 transition-transform"
                          style={{ color: isActive ? "#fff" : "#c49e72" }}
                        />
                        <span className="font-medium">{item.name}</span>
                      </>
                    )}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className={`p-4 border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-white font-Lora text-sm font-semibold hover:opacity-90 transition-all duration-200 shadow-md"
            style={{ backgroundColor: "#006938" }}
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;

