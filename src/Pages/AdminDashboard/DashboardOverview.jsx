// src/Pages/AdminDashboard/DashboardOverview.jsx
import React, { useState, useEffect } from "react";
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
import { getAllBookings, getBookingStats } from "../../services/bookingService";
import { getAllRoomTypes } from "../../services/roomService";

const DashboardOverview = () => {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [bookingStats, setBookingStats] = useState(null);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch bookings
      const bookingsResult = await getAllBookings();
      if (bookingsResult.data) {
        setBookings(bookingsResult.data);
      }

      // Fetch booking stats
      const statsResult = await getBookingStats();
      if (statsResult.data) {
        setBookingStats(statsResult.data);
      }

      // Fetch room types
      const roomsResult = await getAllRoomTypes();
      if (roomsResult.data) {
        setRoomTypes(roomsResult.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get reserved room names (rooms with pending or confirmed bookings)
  const getReservedRooms = () => {
    const today = new Date().toISOString().split('T')[0];
    return bookings
      .filter(booking =>
        (booking.status === 'pending' || booking.status === 'confirmed') &&
        booking.check_in_date >= today
      )
      .map(booking => booking.room_name);
  };

  const reservedRoomNames = getReservedRooms();

  const stats = [
    {
      title: "Total Rooms",
      value: roomTypes.reduce((sum, room) => sum + (room.total_rooms || 0), 0).toString(),
      change: `${roomTypes.length} types`,
      trend: "neutral",
      icon: FaBed,
      color: "#c49e72",
      bgColor: "#c49e72",
    },
    {
      title: "Active Bookings",
      value: bookingStats?.confirmed || "0",
      change: `${bookingStats?.pending || 0} pending`,
      trend: "up",
      icon: FaCalendarCheck,
      color: "#006938",
      bgColor: "#006938",
    },
    {
      title: "Total Bookings",
      value: bookingStats?.total || "0",
      change: `${bookingStats?.completed || 0} completed`,
      trend: "up",
      icon: FaBlog,
      color: "#c49e72",
      bgColor: "#c49e72",
    },
    {
      title: "Cancelled",
      value: bookingStats?.cancelled || "0",
      change: "This month",
      trend: "neutral",
      icon: FaDollarSign,
      color: "#006938",
      bgColor: "#006938",
    },
  ];

  const recentActivities = bookings.slice(0, 5).map(booking => ({
    action: `New booking for ${booking.room_name} by ${booking.customer_name}`,
    time: new Date(booking.created_at).toLocaleDateString(),
    type: "booking"
  }));

  const upcomingBookings = bookings
    .filter(b => b.status === 'confirmed' || b.status === 'pending')
    .slice(0, 4)
    .map(booking => ({
      guest: booking.customer_name,
      room: booking.room_name,
      checkIn: new Date(booking.check_in_date).toLocaleDateString(),
      status: booking.status.charAt(0).toUpperCase() + booking.status.slice(1)
    }));

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

      {/* Room Status Overview */}
      <div className={`rounded-xl shadow-md p-6 border ${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h2
            className={`text-xl font-bold font-Garamond ${
              isDarkMode ? "text-white" : ""
            }`}
            style={!isDarkMode ? { color: "#1e1e1e" } : {}}
          >
            Room Status Overview
          </h2>
          <div className="flex items-center gap-4 text-xs font-Lora">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#ff8c00" }}></div>
              <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>Reserved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>Available</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4" style={{ borderColor: "#c49e72" }}></div>
          </div>
        ) : roomTypes.length === 0 ? (
          <p className={`text-center py-8 font-Lora ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            No rooms available
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roomTypes.map((room) => {
              const isReserved = reservedRoomNames.includes(room.name);
              return (
                <div
                  key={room.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isDarkMode ? "border-gray-600" : "border-gray-200"
                  }`}
                  style={{
                    borderColor: isReserved ? "#ff8c00" : isDarkMode ? "#4b5563" : "#e5e7eb",
                    backgroundColor: isReserved ? "#ff8c0010" : "transparent"
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3
                        className={`font-bold font-Garamond text-lg mb-1 ${
                          isDarkMode ? "text-white" : ""
                        }`}
                        style={{
                          color: isReserved ? "#ff8c00" : !isDarkMode ? "#1e1e1e" : undefined
                        }}
                      >
                        {room.name}
                      </h3>
                      <p className={`text-sm font-Lora ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                        {room.category_label || "Standard Room"}
                      </p>
                      <p className={`text-sm font-Lora font-semibold mt-1`} style={{ color: "#006938" }}>
                        ₹{room.base_price ? parseFloat(room.base_price).toLocaleString('en-IN') : '0'} / night
                      </p>
                    </div>
                    <div
                      className="w-3 h-3 rounded-full mt-1"
                      style={{ backgroundColor: isReserved ? "#ff8c00" : "#10b981" }}
                    ></div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm font-Lora">
                    <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                      Total: {room.total_rooms || 0}
                    </span>
                    <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                      Available: {room.available_rooms || 0}
                    </span>
                  </div>
                  {isReserved && (
                    <div className="mt-2 text-xs font-Lora font-semibold" style={{ color: "#ff8c00" }}>
                      ⚠ Currently Reserved
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
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

