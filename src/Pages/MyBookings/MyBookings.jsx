// src/Pages/MyBookings/MyBookings.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaCalendarAlt, FaSignOutAlt, FaArrowLeft, FaEye, FaBed } from "react-icons/fa";
import { useAuth } from "../../Context/AuthContext";
import { getCustomerBookings } from "../../services/customerService";
import BreadCrumb from "../../BreadCrumb/BreadCrumb";

const MyBookings = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading, signOut } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      if (user?.id) {
        try {
          const { data, error } = await getCustomerBookings(user.id);
          if (error) throw error;
          setBookings(data || []);
        } catch (err) {
          console.error("Error fetching bookings:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    if (isAuthenticated && user) {
      fetchBookings();
    }
  }, [isAuthenticated, user]);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      confirmed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      completed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      "checked-in": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      "checked-out": "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    };
    return statusStyles[status?.toLowerCase()] || statusStyles.pending;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-whiteSmoke dark:bg-normalBlack">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-khaki"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <BreadCrumb title="My Bookings" pageName="My Bookings" />
      
      <section className="py-20 2xl:py-[120px] bg-whiteSmoke dark:bg-normalBlack">
        <div className="Container">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-lightBlack dark:text-white font-Garamond">
                  My Bookings
                </h1>
                <p className="text-gray dark:text-lightGray font-Lora mt-1">
                  View and manage your room reservations
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="mt-4 md:mt-0 flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-Garamond uppercase tracking-wider py-3 px-6 rounded-lg transition-all duration-300"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>

            {/* Bookings Table/List */}
            {bookings.length === 0 ? (
              <div className="bg-white dark:bg-mediumBlack rounded-2xl shadow-xl p-12 text-center">
                <FaBed className="text-6xl text-khaki/30 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-lightBlack dark:text-white font-Garamond mb-2">
                  No Bookings Found
                </h2>
                <p className="text-gray dark:text-lightGray font-Lora mb-6">
                  You haven't made any reservations yet.
                </p>
                <Link
                  to="/room"
                  className="inline-flex items-center gap-2 bg-khaki hover:bg-khaki/90 text-white font-Garamond uppercase tracking-wider py-3 px-6 rounded-lg transition-all duration-300"
                >
                  Browse Rooms
                </Link>
              </div>
            ) : (
              <div className="bg-white dark:bg-mediumBlack rounded-2xl shadow-xl overflow-hidden">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-khaki/10 dark:bg-khaki/5">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-lightBlack dark:text-white font-Garamond uppercase">
                          Booking Date
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-lightBlack dark:text-white font-Garamond uppercase">
                          Room Type
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-lightBlack dark:text-white font-Garamond uppercase">
                          Check-In
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-lightBlack dark:text-white font-Garamond uppercase">
                          Check-Out
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-lightBlack dark:text-white font-Garamond uppercase">
                          Status
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-lightBlack dark:text-white font-Garamond uppercase">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                          <td className="px-6 py-4 text-sm text-lightBlack dark:text-white font-Lora">
                            {formatDate(booking.created_at)}
                          </td>
                          <td className="px-6 py-4 text-sm text-lightBlack dark:text-white font-Lora">
                            {booking.room_name || "Standard Room"}
                          </td>
                          <td className="px-6 py-4 text-sm text-lightBlack dark:text-white font-Lora">
                            {formatDate(booking.check_in_date)}
                          </td>
                          <td className="px-6 py-4 text-sm text-lightBlack dark:text-white font-Lora">
                            {formatDate(booking.check_out_date)}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${getStatusBadge(booking.status)}`}>
                              {booking.status || "Pending"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => setSelectedBooking(booking)}
                              className="inline-flex items-center gap-1 text-khaki hover:text-khaki/80 font-Lora text-sm transition-colors"
                            >
                              <FaEye />
                              <span>View Details</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-700">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-sm font-semibold text-lightBlack dark:text-white font-Garamond">
                            {booking.room_name || "Standard Room"}
                          </p>
                          <p className="text-xs text-gray dark:text-lightGray font-Lora">
                            Booked on {formatDate(booking.created_at)}
                          </p>
                        </div>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${getStatusBadge(booking.status)}`}>
                          {booking.status || "Pending"}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray dark:text-lightGray font-Lora mb-3">
                        <span>Check-in: {formatDate(booking.check_in_date)}</span>
                        <span>Check-out: {formatDate(booking.check_out_date)}</span>
                      </div>
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="w-full flex items-center justify-center gap-2 bg-khaki/10 hover:bg-khaki/20 text-khaki py-2 rounded-lg font-Lora text-sm transition-colors"
                      >
                        <FaEye />
                        <span>View Details</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Back Link */}
            <div className="mt-8 text-center">
              <Link
                to="/my-account"
                className="inline-flex items-center gap-2 text-gray dark:text-lightGray hover:text-khaki transition-colors duration-300 font-Lora"
              >
                <FaArrowLeft size={14} />
                <span>Back to My Account</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-mediumBlack rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-lightBlack dark:text-white font-Garamond">
                Booking Details
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray dark:text-lightGray font-Lora">Room Type</p>
                  <p className="text-lightBlack dark:text-white font-Garamond">
                    {selectedBooking.room_name || "Standard Room"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray dark:text-lightGray font-Lora">Status</p>
                  <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full capitalize ${getStatusBadge(selectedBooking.status)}`}>
                    {selectedBooking.status || "Pending"}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray dark:text-lightGray font-Lora">Check-In</p>
                  <p className="text-lightBlack dark:text-white font-Garamond">
                    {formatDate(selectedBooking.check_in_date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray dark:text-lightGray font-Lora">Check-Out</p>
                  <p className="text-lightBlack dark:text-white font-Garamond">
                    {formatDate(selectedBooking.check_out_date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray dark:text-lightGray font-Lora">Guests</p>
                  <p className="text-lightBlack dark:text-white font-Garamond">
                    {selectedBooking.number_of_adults || 1} Adults
                    {selectedBooking.number_of_children > 0 && `, ${selectedBooking.number_of_children} Children`}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray dark:text-lightGray font-Lora">Rooms</p>
                  <p className="text-lightBlack dark:text-white font-Garamond">
                    {selectedBooking.number_of_rooms || 1}
                  </p>
                </div>
              </div>
              {selectedBooking.total_amount && (
                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-sm text-gray dark:text-lightGray font-Lora">Total Amount</p>
                  <p className="text-2xl font-bold text-khaki font-Garamond">
                    ₹{selectedBooking.total_amount.toLocaleString("en-IN")}
                  </p>
                </div>
              )}
              {selectedBooking.special_requests && (
                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-sm text-gray dark:text-lightGray font-Lora">Special Requests</p>
                  <p className="text-lightBlack dark:text-white font-Lora">
                    {selectedBooking.special_requests}
                  </p>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={() => setSelectedBooking(null)}
                className="w-full bg-khaki hover:bg-khaki/90 text-white font-Garamond uppercase tracking-wider py-3 rounded-lg transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyBookings;

