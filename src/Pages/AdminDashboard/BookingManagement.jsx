// src/Pages/AdminDashboard/BookingManagement.jsx
import React, { useState, useEffect } from "react";
import {
  FaCalendar,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBed,
  FaUsers,
  FaFilter,
  FaEye,
  FaTrash,
  FaCheck,
  FaTimes,
  FaClock,
} from "react-icons/fa";
import Swal from "sweetalert2";
import {
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
  getBookingStats,
} from "../../services/bookingService";

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchBookings();
    fetchStats();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, filterStatus, searchTerm]);

  const fetchBookings = async () => {
    setLoading(true);
    const result = await getAllBookings();
    if (result.data) {
      setBookings(result.data);
    } else {
      Swal.fire("Error", "Failed to fetch bookings", "error");
    }
    setLoading(false);
  };

  const fetchStats = async () => {
    const result = await getBookingStats();
    if (result.data) {
      setStats(result.data);
    }
  };

  const filterBookings = () => {
    let filtered = [...bookings];

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter((b) => b.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (b) =>
          b.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.customer_phone?.includes(searchTerm) ||
          b.room_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBookings(filtered);
  };

  const handleStatusChange = async (id, newStatus) => {
    const result = await Swal.fire({
      title: "Update Status?",
      text: `Change booking status to ${newStatus}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#006938",
      cancelButtonColor: "#c49e72",
      confirmButtonText: "Yes, update it!",
    });

    if (result.isConfirmed) {
      const updateResult = await updateBookingStatus(id, newStatus);
      if (updateResult.data) {
        Swal.fire("Updated!", "Booking status has been updated.", "success");
        fetchBookings();
        fetchStats();
      } else {
        Swal.fire("Error", "Failed to update booking status", "error");
      }
    }
  };

  const handleDeleteBooking = async (id) => {
    const result = await Swal.fire({
      title: "Delete Booking?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#c49e72",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      const deleteResult = await deleteBooking(id);
      if (deleteResult.data) {
        Swal.fire("Deleted!", "Booking has been deleted.", "success");
        fetchBookings();
        fetchStats();
      } else {
        Swal.fire("Error", "Failed to delete booking", "error");
      }
    }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending" },
      confirmed: { bg: "bg-green-100", text: "text-green-800", label: "Confirmed" },
      cancelled: { bg: "bg-red-100", text: "text-red-800", label: "Cancelled" },
      completed: { bg: "bg-blue-100", text: "text-blue-800", label: "Completed" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const calculateNights = (checkIn, checkOut) => {
    const nights = Math.ceil(
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
    );
    return nights;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006938] mx-auto"></div>
          <p className="mt-4 text-gray-600 font-Lora">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-Garamond" style={{ color: "#1e1e1e" }}>
            Booking Management
          </h1>
          <p className="text-gray-600 font-Lora mt-1">
            Manage all customer bookings
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-Lora">Total Bookings</p>
                <p className="text-2xl font-bold font-Garamond" style={{ color: "#1e1e1e" }}>
                  {stats.total}
                </p>
              </div>
              <FaBed className="text-3xl text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-Lora">Pending</p>
                <p className="text-2xl font-bold font-Garamond" style={{ color: "#1e1e1e" }}>
                  {stats.pending}
                </p>
              </div>
              <FaClock className="text-3xl text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-Lora">Confirmed</p>
                <p className="text-2xl font-bold font-Garamond" style={{ color: "#1e1e1e" }}>
                  {stats.confirmed}
                </p>
              </div>
              <FaCheck className="text-3xl text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-Lora">Completed</p>
                <p className="text-2xl font-bold font-Garamond" style={{ color: "#1e1e1e" }}>
                  {stats.completed}
                </p>
              </div>
              <FaCheck className="text-3xl text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-Lora">Cancelled</p>
                <p className="text-2xl font-bold font-Garamond" style={{ color: "#1e1e1e" }}>
                  {stats.cancelled}
                </p>
              </div>
              <FaTimes className="text-3xl text-red-500" />
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
              <FaFilter className="inline mr-2" />
              Filter by Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006938] font-Lora"
            >
              <option value="all">All Bookings</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
              Search
            </label>
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006938] font-Lora"
            />
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#006938] text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold font-Garamond">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-semibold font-Garamond">Contact</th>
                <th className="px-4 py-3 text-left text-sm font-semibold font-Garamond">Check-in</th>
                <th className="px-4 py-3 text-left text-sm font-semibold font-Garamond">Check-out</th>
                <th className="px-4 py-3 text-left text-sm font-semibold font-Garamond">Guests</th>
                <th className="px-4 py-3 text-left text-sm font-semibold font-Garamond">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold font-Garamond">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-500 font-Lora">
                    No bookings found
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <FaUser className="text-[#c49e72] mr-2" />
                        <span className="font-semibold font-Lora text-sm">{booking.customer_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-Lora">
                        <div className="flex items-center mb-1">
                          <FaEnvelope className="text-gray-400 mr-2 text-xs" />
                          <span className="text-xs">{booking.customer_email}</span>
                        </div>
                        {booking.customer_phone && (
                          <div className="flex items-center">
                            <FaPhone className="text-gray-400 mr-2 text-xs" />
                            <span className="text-xs">{booking.customer_phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center text-sm font-Lora">
                        <FaCalendar className="text-[#006938] mr-2 text-xs" />
                        {new Date(booking.check_in_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-Lora">
                        {new Date(booking.check_out_date).toLocaleDateString()}
                        <div className="text-xs text-gray-500">
                          ({calculateNights(booking.check_in_date, booking.check_out_date)} nights)
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-Lora">
                        <div>{booking.number_of_rooms} room(s)</div>
                        <div className="text-xs text-gray-500">
                          {booking.number_of_adults} adults, {booking.number_of_children} children
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(booking.status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDetails(booking)}
                          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                          title="View Details"
                        >
                          <FaEye />
                        </button>

                        {booking.status === "pending" && (
                          <button
                            onClick={() => handleStatusChange(booking.id, "confirmed")}
                            className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                            title="Confirm Booking"
                          >
                            <FaCheck />
                          </button>
                        )}

                        {booking.status === "confirmed" && (
                          <button
                            onClick={() => handleStatusChange(booking.id, "completed")}
                            className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            title="Mark as Completed"
                          >
                            <FaCheck />
                          </button>
                        )}

                        {(booking.status === "pending" || booking.status === "confirmed") && (
                          <button
                            onClick={() => handleStatusChange(booking.id, "cancelled")}
                            className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                            title="Cancel Booking"
                          >
                            <FaTimes />
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteBooking(booking.id)}
                          className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                          title="Delete Booking"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold font-Garamond" style={{ color: "#1e1e1e" }}>
                Booking Details
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Customer Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-bold font-Garamond mb-3" style={{ color: "#1e1e1e" }}>
                  Customer Information
                </h3>
                <div className="space-y-2 font-Lora text-sm">
                  <div className="flex items-center">
                    <FaUser className="text-[#c49e72] mr-3" />
                    <span className="font-semibold mr-2">Name:</span>
                    <span>{selectedBooking.customer_name}</span>
                  </div>
                  <div className="flex items-center">
                    <FaEnvelope className="text-[#c49e72] mr-3" />
                    <span className="font-semibold mr-2">Email:</span>
                    <span>{selectedBooking.customer_email}</span>
                  </div>
                  {selectedBooking.customer_phone && (
                    <div className="flex items-center">
                      <FaPhone className="text-[#c49e72] mr-3" />
                      <span className="font-semibold mr-2">Phone:</span>
                      <span>{selectedBooking.customer_phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Booking Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-bold font-Garamond mb-3" style={{ color: "#1e1e1e" }}>
                  Booking Information
                </h3>
                <div className="space-y-2 font-Lora text-sm">
                  <div className="flex items-center">
                    <FaCalendar className="text-[#006938] mr-3" />
                    <span className="font-semibold mr-2">Check-in:</span>
                    <span>{new Date(selectedBooking.check_in_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <FaCalendar className="text-[#006938] mr-3" />
                    <span className="font-semibold mr-2">Check-out:</span>
                    <span>{new Date(selectedBooking.check_out_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <FaBed className="text-[#006938] mr-3" />
                    <span className="font-semibold mr-2">Nights:</span>
                    <span>
                      {calculateNights(selectedBooking.check_in_date, selectedBooking.check_out_date)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FaBed className="text-[#006938] mr-3" />
                    <span className="font-semibold mr-2">Rooms:</span>
                    <span>{selectedBooking.number_of_rooms}</span>
                  </div>
                  <div className="flex items-center">
                    <FaUsers className="text-[#006938] mr-3" />
                    <span className="font-semibold mr-2">Guests:</span>
                    <span>
                      {selectedBooking.number_of_adults} Adults, {selectedBooking.number_of_children} Children
                    </span>
                  </div>
                  {selectedBooking.room_name && (
                    <div className="flex items-center">
                      <FaBed className="text-[#006938] mr-3" />
                      <span className="font-semibold mr-2">Room Type:</span>
                      <span>{selectedBooking.room_name}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <span className="font-semibold mr-2">Status:</span>
                    {getStatusBadge(selectedBooking.status)}
                  </div>
                  {selectedBooking.total_amount && (
                    <div className="flex items-center">
                      <span className="font-semibold mr-2">Total Amount:</span>
                      <span className="text-lg font-bold" style={{ color: "#006938" }}>
                        ₹{parseFloat(selectedBooking.total_amount).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Special Requests */}
              {selectedBooking.special_requests && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-bold font-Garamond mb-3" style={{ color: "#1e1e1e" }}>
                    Special Requests
                  </h3>
                  <p className="font-Lora text-sm text-gray-700">{selectedBooking.special_requests}</p>
                </div>
              )}

              {/* Booking Metadata */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-bold font-Garamond mb-3" style={{ color: "#1e1e1e" }}>
                  Booking Details
                </h3>
                <div className="space-y-2 font-Lora text-xs text-gray-600">
                  <div>
                    <span className="font-semibold">Booking ID:</span> {selectedBooking.id}
                  </div>
                  <div>
                    <span className="font-semibold">Created:</span>{" "}
                    {new Date(selectedBooking.created_at).toLocaleString()}
                  </div>
                  <div>
                    <span className="font-semibold">Last Updated:</span>{" "}
                    {new Date(selectedBooking.updated_at).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-6 py-2 bg-[#006938] text-white rounded-lg hover:bg-[#004d27] transition-colors font-Lora font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;

