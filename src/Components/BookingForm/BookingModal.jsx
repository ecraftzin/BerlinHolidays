// src/Components/BookingForm/BookingModal.jsx
import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaBed, FaUsers, FaChild, FaUserFriends, FaTimes } from "react-icons/fa";
import { BiChevronDown } from "react-icons/bi";
import Swal from "sweetalert2";

const BookingModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    checkInDate: "",
    checkOutDate: "",
    rooms: 1,
    adults: 1,
    children: 0,
  });

  const [showGuestDropdown, setShowGuestDropdown] = useState(false);

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split("T")[0];

  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleIncrement = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field] + 1,
    }));
  };

  const handleDecrement = (field) => {
    if (formData[field] > (field === "rooms" || field === "adults" ? 1 : 0)) {
      setFormData((prev) => ({
        ...prev,
        [field]: prev[field] - 1,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.checkInDate) {
      Swal.fire({
        title: "Error",
        text: "Please select check-in date",
        icon: "error",
        confirmButtonColor: "#006938",
      });
      return;
    }

    if (!formData.checkOutDate) {
      Swal.fire({
        title: "Error",
        text: "Please select check-out date",
        icon: "error",
        confirmButtonColor: "#006938",
      });
      return;
    }

    // Check if check-out is after check-in
    if (new Date(formData.checkOutDate) <= new Date(formData.checkInDate)) {
      Swal.fire({
        title: "Error",
        text: "Check-out date must be after check-in date",
        icon: "error",
        confirmButtonColor: "#006938",
      });
      return;
    }

    // Success - Show booking details
    const totalGuests = formData.adults + formData.children;
    const nights = Math.ceil(
      (new Date(formData.checkOutDate) - new Date(formData.checkInDate)) /
        (1000 * 60 * 60 * 24)
    );

    Swal.fire({
      title: "Booking Details",
      html: `
        <div style="text-align: left; font-family: Lora, serif;">
          <p style="margin: 10px 0;"><strong>Check-in:</strong> ${new Date(
            formData.checkInDate
          ).toLocaleDateString()}</p>
          <p style="margin: 10px 0;"><strong>Check-out:</strong> ${new Date(
            formData.checkOutDate
          ).toLocaleDateString()}</p>
          <p style="margin: 10px 0;"><strong>Nights:</strong> ${nights}</p>
          <p style="margin: 10px 0;"><strong>Rooms:</strong> ${formData.rooms}</p>
          <p style="margin: 10px 0;"><strong>Adults:</strong> ${formData.adults}</p>
          <p style="margin: 10px 0;"><strong>Children:</strong> ${formData.children}</p>
          <p style="margin: 10px 0;"><strong>Total Guests:</strong> ${totalGuests}</p>
        </div>
      `,
      icon: "success",
      confirmButtonText: "Proceed to Booking",
      confirmButtonColor: "#006938",
      showCancelButton: true,
      cancelButtonText: "Modify",
      cancelButtonColor: "#c49e72",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Booking Data:", formData);
        Swal.fire({
          title: "Success!",
          text: "Your booking request has been submitted. We'll contact you shortly!",
          icon: "success",
          confirmButtonColor: "#006938",
        });
        onClose();
        // Reset form
        setFormData({
          checkInDate: "",
          checkOutDate: "",
          rooms: 1,
          adults: 1,
          children: 0,
        });
      }
    });
  };

  const totalGuests = formData.adults + formData.children;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-normalBlack rounded-2xl shadow-2xl">
        {/* Gradient Top Border */}
        <div className="h-3 bg-gradient-to-r from-[#c49e72] via-[#006938] to-[#c49e72]"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
          title="Close"
        >
          <FaTimes className="text-xl text-lightBlack dark:text-white" />
        </button>

        {/* Modal Header */}
        <div className="p-6 lg:p-8 text-center border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <hr className="w-[80px] h-[1px] bg-lightGray dark:bg-gray" />
            <img
              src="/images/home-1/sectiondivider01.png"
              alt="booking_logo"
              className="w-[40px] h-[40px]"
            />
            <hr className="w-[80px] h-[1px] bg-lightGray dark:bg-gray" />
          </div>
          <h2 className="text-2xl md:text-3xl text-lightBlack dark:text-white font-Garamond font-semibold uppercase">
            Book Your Stay Online
          </h2>
          <p className="font-Lora text-gray dark:text-lightGray text-sm mt-2">
            Fill in your details below and secure your perfect getaway
          </p>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 lg:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Check-in Date */}
            <div className="relative">
              <label className="block text-lightBlack dark:text-white font-semibold font-Garamond text-sm mb-2 uppercase">
                <FaCalendarAlt className="inline mr-2 text-[#006938]" />
                Check-In
              </label>
              <input
                type="date"
                name="checkInDate"
                value={formData.checkInDate}
                onChange={handleInputChange}
                min={today}
                className="w-full h-12 px-4 border-2 border-[#e8e8e8] dark:border-gray-700 focus:border-[#c49e72] dark:focus:border-[#c49e72] text-lightBlack dark:text-white bg-[#f7f5f2] dark:bg-gray-800 outline-none rounded-lg font-Lora transition-all duration-300 focus:ring-2 focus:ring-[#c49e72]/20"
                required
              />
            </div>

            {/* Check-out Date */}
            <div className="relative">
              <label className="block text-lightBlack dark:text-white font-semibold font-Garamond text-sm mb-2 uppercase">
                <FaCalendarAlt className="inline mr-2 text-[#006938]" />
                Check-Out
              </label>
              <input
                type="date"
                name="checkOutDate"
                value={formData.checkOutDate}
                onChange={handleInputChange}
                min={formData.checkInDate || today}
                className="w-full h-12 px-4 border-2 border-[#e8e8e8] dark:border-gray-700 focus:border-[#c49e72] dark:focus:border-[#c49e72] text-lightBlack dark:text-white bg-[#f7f5f2] dark:bg-gray-800 outline-none rounded-lg font-Lora transition-all duration-300 focus:ring-2 focus:ring-[#c49e72]/20"
                required
              />
            </div>

            {/* Rooms */}
            <div className="relative">
              <label className="block text-lightBlack dark:text-white font-semibold font-Garamond text-sm mb-2 uppercase">
                <FaBed className="inline mr-2 text-[#006938]" />
                Rooms
              </label>
              <div className="flex items-center h-12 border-2 border-[#e8e8e8] dark:border-gray-700 bg-[#f7f5f2] dark:bg-gray-800 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => handleDecrement("rooms")}
                  className="w-12 h-full bg-[#c49e72] hover:bg-[#b38a5f] text-white font-bold text-xl transition-colors duration-300"
                >
                  -
                </button>
                <div className="flex-1 text-center text-lightBlack dark:text-white font-bold font-Lora">
                  {formData.rooms}
                </div>
                <button
                  type="button"
                  onClick={() => handleIncrement("rooms")}
                  className="w-12 h-full bg-[#c49e72] hover:bg-[#b38a5f] text-white font-bold text-xl transition-colors duration-300"
                >
                  +
                </button>
              </div>
            </div>

            {/* Guests Dropdown */}
            <div className="relative">
              <label className="block text-lightBlack dark:text-white font-semibold font-Garamond text-sm mb-2 uppercase">
                <FaUsers className="inline mr-2 text-[#006938]" />
                Guests
              </label>
              <div
                className="relative h-12 border-2 border-[#e8e8e8] dark:border-gray-700 bg-[#f7f5f2] dark:bg-gray-800 rounded-lg cursor-pointer hover:border-[#c49e72] transition-all duration-300"
                onClick={() => setShowGuestDropdown(!showGuestDropdown)}
              >
                <div className="flex items-center justify-between h-full px-4">
                  <span className="text-lightBlack dark:text-white font-Lora text-sm">
                    {totalGuests} Guest{totalGuests !== 1 ? "s" : ""}
                  </span>
                  <BiChevronDown
                    className={`text-[#c49e72] text-xl transition-transform duration-300 ${
                      showGuestDropdown ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {/* Dropdown */}
                {showGuestDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border-2 border-[#c49e72] rounded-lg shadow-2xl z-50 p-4">
                    {/* Adults */}
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center">
                        <FaUserFriends className="text-[#006938] mr-3 text-lg" />
                        <div>
                          <p className="text-lightBlack dark:text-white font-semibold font-Garamond text-sm">
                            Adults
                          </p>
                          <p className="text-xs text-gray dark:text-lightGray font-Lora">
                            Age 13+
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDecrement("adults");
                          }}
                          className="w-8 h-8 bg-[#c49e72] hover:bg-[#b38a5f] text-white font-bold rounded-lg transition-colors duration-300"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-lightBlack dark:text-white font-bold font-Lora">
                          {formData.adults}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleIncrement("adults");
                          }}
                          className="w-8 h-8 bg-[#c49e72] hover:bg-[#b38a5f] text-white font-bold rounded-lg transition-colors duration-300"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Children */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FaChild className="text-[#006938] mr-3 text-lg" />
                        <div>
                          <p className="text-lightBlack dark:text-white font-semibold font-Garamond text-sm">
                            Children
                          </p>
                          <p className="text-xs text-gray dark:text-lightGray font-Lora">
                            Age 0-12
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDecrement("children");
                          }}
                          className="w-8 h-8 bg-[#c49e72] hover:bg-[#b38a5f] text-white font-bold rounded-lg transition-colors duration-300"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-lightBlack dark:text-white font-bold font-Lora">
                          {formData.children}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleIncrement("children");
                          }}
                          className="w-8 h-8 bg-[#c49e72] hover:bg-[#b38a5f] text-white font-bold rounded-lg transition-colors duration-300"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="bg-[#f7f5f2] dark:bg-gray-800 rounded-xl p-4 lg:p-6 mb-6 border-l-4 border-[#006938]">
            <h3 className="text-base lg:text-lg font-bold font-Garamond text-lightBlack dark:text-white mb-3">
              Booking Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-Lora text-xs lg:text-sm">
              <div>
                <p className="text-gray dark:text-lightGray mb-1">Check-in</p>
                <p className="text-lightBlack dark:text-white font-semibold">
                  {formData.checkInDate
                    ? new Date(formData.checkInDate).toLocaleDateString()
                    : "Not selected"}
                </p>
              </div>
              <div>
                <p className="text-gray dark:text-lightGray mb-1">Check-out</p>
                <p className="text-lightBlack dark:text-white font-semibold">
                  {formData.checkOutDate
                    ? new Date(formData.checkOutDate).toLocaleDateString()
                    : "Not selected"}
                </p>
              </div>
              <div>
                <p className="text-gray dark:text-lightGray mb-1">Rooms</p>
                <p className="text-lightBlack dark:text-white font-semibold">
                  {formData.rooms} Room{formData.rooms !== 1 ? "s" : ""}
                </p>
              </div>
              <div>
                <p className="text-gray dark:text-lightGray mb-1">Guests</p>
                <p className="text-lightBlack dark:text-white font-semibold">
                  {formData.adults} Adult{formData.adults !== 1 ? "s" : ""}, {formData.children} Child
                  {formData.children !== 1 ? "ren" : ""}
                </p>
              </div>
            </div>
          </div>

          {/* Book Now Button */}
          <div className="text-center">
            <button
              type="submit"
              className="group relative px-8 lg:px-12 py-4 bg-[#006938] hover:bg-[#004d27] text-white font-bold font-Garamond text-base lg:text-lg uppercase rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center">
                <FaBed className="mr-3 text-lg" />
                Book Now
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#c49e72] to-[#006938] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;

