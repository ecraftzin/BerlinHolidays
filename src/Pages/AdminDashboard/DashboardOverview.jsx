// src/Pages/AdminDashboard/DashboardOverview.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBed,
  FaBlog,
  FaGift,
  FaUtensils,
  FaUsers,
  FaChartLine,
  FaCalendarCheck,
  FaDollarSign,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import { useDarkMode } from "../../Context/DarkModeContext";

const DashboardOverview = () => {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const stats = [
    {
      title: "Total Rooms",
      value: "24",
      change: "+2",
      trend: "up",
      icon: FaBed,
      color: "#c49e72",
      bgColor: "#c49e72",
    },
    {
      title: "Active Bookings",
      value: "18",
      change: "+5",
      trend: "up",
      icon: FaCalendarCheck,
      color: "#006938",
      bgColor: "#006938",
    },
    {
      title: "Blog Posts",
      value: "42",
      change: "+3",
      trend: "up",
      icon: FaBlog,
      color: "#c49e72",
      bgColor: "#c49e72",
    },
    {
      title: "Revenue (Month)",
      value: "₹2.4L",
      change: "+12%",
      trend: "up",
      icon: FaDollarSign,
      color: "#006938",
      bgColor: "#006938",
    },
    {
      title: "Special Offers",
      value: "8",
      change: "0",
      trend: "neutral",
      icon: FaGift,
      color: "#c49e72",
      bgColor: "#c49e72",
    },
    {
      title: "Menu Items",
      value: "56",
      change: "+4",
      trend: "up",
      icon: FaUtensils,
      color: "#006938",
      bgColor: "#006938",
    },
  ];

  const recentActivities = [
    { action: "New booking for Deluxe Room", time: "2 hours ago", type: "booking" },
    { action: "Blog post 'Wayanad Adventures' published", time: "5 hours ago", type: "blog" },
    { action: "Special offer 'Summer Sale' activated", time: "1 day ago", type: "offer" },
    { action: "Menu item 'Kerala Breakfast' added", time: "2 days ago", type: "menu" },
    { action: "Room rates updated for December", time: "3 days ago", type: "rate" },
  ];

  const upcomingBookings = [
    { guest: "Rajesh Kumar", room: "Deluxe Suite", checkIn: "Dec 15, 2024", status: "Confirmed" },
    { guest: "Priya Sharma", room: "Standard Room", checkIn: "Dec 16, 2024", status: "Pending" },
    { guest: "Amit Patel", room: "Family Room", checkIn: "Dec 18, 2024", status: "Confirmed" },
    { guest: "Sarah Johnson", room: "Premium Suite", checkIn: "Dec 20, 2024", status: "Confirmed" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1
            className={`text-3xl font-bold font-Garamond ${
              isDarkMode ? "text-white" : ""
            }`}
            style={!isDarkMode ? { color: "#1e1e1e" } : {}}
          >
            Dashboard Overview
          </h1>
          <p className={`font-Lora mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Welcome to Berlin Holidays Admin Panel
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            className="px-6 py-3 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all shadow-md"
            style={{ backgroundColor: "#006938" }}
          >
            <FaChartLine className="inline mr-2" />
            View Reports
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 border ${
              isDarkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-100"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className={`text-sm font-Lora mb-1 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}>
                  {stat.title}
                </p>
                <h3
                  className={`text-3xl font-bold font-Garamond ${
                    isDarkMode ? "text-white" : ""
                  }`}
                  style={!isDarkMode ? { color: "#1e1e1e" } : {}}
                >
                  {stat.value}
                </h3>
                <div className="flex items-center mt-2">
                  {stat.trend === "up" && (
                    <span className="flex items-center text-green-600 text-sm font-Lora">
                      <FaArrowUp className="mr-1" />
                      {stat.change}
                    </span>
                  )}
                  {stat.trend === "down" && (
                    <span className="flex items-center text-red-600 text-sm font-Lora">
                      <FaArrowDown className="mr-1" />
                      {stat.change}
                    </span>
                  )}
                  {stat.trend === "neutral" && (
                    <span className="text-gray-500 text-sm font-Lora">No change</span>
                  )}
                </div>
              </div>
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${stat.bgColor}20` }}
              >
                <stat.icon className="text-2xl" style={{ color: stat.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className={`rounded-xl shadow-md p-6 border ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
        }`}>
          <h2
            className={`text-xl font-bold font-Garamond mb-4 ${
              isDarkMode ? "text-white" : ""
            }`}
            style={!isDarkMode ? { color: "#1e1e1e" } : {}}
          >
            Recent Activities
          </h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className={`flex items-start space-x-3 pb-4 border-b last:border-0 ${
                  isDarkMode ? "border-gray-700" : "border-gray-100"
                }`}
              >
                <div
                  className="w-2 h-2 rounded-full mt-2"
                  style={{ backgroundColor: "#c49e72" }}
                ></div>
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium font-Lora ${
                      isDarkMode ? "text-gray-200" : ""
                    }`}
                    style={!isDarkMode ? { color: "#1e1e1e" } : {}}
                  >
                    {activity.action}
                  </p>
                  <p className={`text-xs font-Lora mt-1 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}>
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Bookings */}
        <div className={`rounded-xl shadow-md p-6 border ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
        }`}>
          <h2
            className={`text-xl font-bold font-Garamond mb-4 ${
              isDarkMode ? "text-white" : ""
            }`}
            style={!isDarkMode ? { color: "#1e1e1e" } : {}}
          >
            Upcoming Bookings
          </h2>
          <div className="space-y-4">
            {upcomingBookings.map((booking, index) => (
              <div
                key={index}
                className={`flex items-center justify-between pb-4 border-b last:border-0 ${
                  isDarkMode ? "border-gray-700" : "border-gray-100"
                }`}
              >
                <div className="flex-1">
                  <p
                    className={`text-sm font-semibold font-Garamond ${
                      isDarkMode ? "text-gray-200" : ""
                    }`}
                    style={!isDarkMode ? { color: "#1e1e1e" } : {}}
                  >
                    {booking.guest}
                  </p>
                  <p className={`text-xs font-Lora mt-1 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}>
                    {booking.room} • {booking.checkIn}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-Lora font-semibold ${
                    booking.status === "Confirmed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={`rounded-xl shadow-md p-6 border ${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
      }`}>
        <h2
          className={`text-xl font-bold font-Garamond mb-4 ${
            isDarkMode ? "text-white" : ""
          }`}
          style={!isDarkMode ? { color: "#1e1e1e" } : {}}
        >
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => navigate("/admin/rooms/types")}
            className={`p-4 rounded-lg border-2 hover:border-opacity-50 transition-all text-center group ${
              isDarkMode ? "border-gray-600" : "border-gray-200"
            }`}
            style={{ borderColor: "#c49e72" }}
          >
            <FaBed className="text-3xl mx-auto mb-2 group-hover:scale-110 transition-transform" style={{ color: "#c49e72" }} />
            <p
              className={`text-sm font-Lora font-semibold ${
                isDarkMode ? "text-gray-200" : ""
              }`}
              style={!isDarkMode ? { color: "#1e1e1e" } : {}}
            >
              Add Room
            </p>
          </button>
          <button
            onClick={() => navigate("/admin/blog")}
            className={`p-4 rounded-lg border-2 hover:border-opacity-50 transition-all text-center group ${
              isDarkMode ? "border-gray-600" : "border-gray-200"
            }`}
            style={{ borderColor: "#006938" }}
          >
            <FaBlog className="text-3xl mx-auto mb-2 group-hover:scale-110 transition-transform" style={{ color: "#006938" }} />
            <p
              className={`text-sm font-Lora font-semibold ${
                isDarkMode ? "text-gray-200" : ""
              }`}
              style={!isDarkMode ? { color: "#1e1e1e" } : {}}
            >
              New Post
            </p>
          </button>
          <button
            onClick={() => navigate("/admin/special-offers")}
            className={`p-4 rounded-lg border-2 hover:border-opacity-50 transition-all text-center group ${
              isDarkMode ? "border-gray-600" : "border-gray-200"
            }`}
            style={{ borderColor: "#c49e72" }}
          >
            <FaGift className="text-3xl mx-auto mb-2 group-hover:scale-110 transition-transform" style={{ color: "#c49e72" }} />
            <p
              className={`text-sm font-Lora font-semibold ${
                isDarkMode ? "text-gray-200" : ""
              }`}
              style={!isDarkMode ? { color: "#1e1e1e" } : {}}
            >
              Add Offer
            </p>
          </button>
          <button
            onClick={() => navigate("/admin/restaurant/menu-items")}
            className={`p-4 rounded-lg border-2 hover:border-opacity-50 transition-all text-center group ${
              isDarkMode ? "border-gray-600" : "border-gray-200"
            }`}
            style={{ borderColor: "#006938" }}
          >
            <FaUtensils className="text-3xl mx-auto mb-2 group-hover:scale-110 transition-transform" style={{ color: "#006938" }} />
            <p
              className={`text-sm font-Lora font-semibold ${
                isDarkMode ? "text-gray-200" : ""
              }`}
              style={!isDarkMode ? { color: "#1e1e1e" } : {}}
            >
              Add Menu
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;

