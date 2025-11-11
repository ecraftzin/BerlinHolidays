// src/Components/BookingForm/BookingForm.jsx
import React, { useState } from "react";
import { FaCalendarAlt, FaBed, FaUsers, FaChild, FaUserFriends } from "react-icons/fa";
import { BiChevronDown } from "react-icons/bi";
import Swal from "sweetalert2";

const BookingForm = () => {
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
        // Here you would navigate to booking page or submit to backend
        console.log("Booking Data:", formData);
        Swal.fire({
          title: "Success!",
          text: "Your booking request has been submitted. We'll contact you shortly!",
          icon: "success",
          confirmButtonColor: "#006938",
        });
      }
    });
  };

  const totalGuests = formData.adults + formData.children;

  return (
    <section className="bg-whiteSmoke dark:bg-lightBlack py-20 2xl:py-[120px]">
      <div className="Container">
        {/* Section Header */}
        <div
          className="text-center sm:px-8 md:px-[80px] lg:px-[120px] xl:px-[200px] 2xl:px-[335px] mx-auto mb-14"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          {/* Section logo */}
          <div className="flex items-center justify-center space-x-2">
            <hr className="w-[100px] h-[1px] bg-lightGray dark:bg-gray text-lightGray dark:text-gray" />
            <img
              src="/images/home-1/sectiondivider01.png"
              alt="booking_section_logo"
              className="w-[50px] h-[50px]"
            />
            <hr className="w-[100px] h-[1px] bg-lightGray dark:bg-gray text-lightGray dark:text-gray" />
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl 2xl:text-[38px] leading-[42px] 2xl:leading-[52px] text-lightBlack dark:text-white mt-[10px] mb-[14px] font-Garamond font-semibold uppercase">
            Book Your Stay Online
          </h1>
          <p className="font-Lora leading-7 lg:leading-[26px] text-lightGray font-normal text-sm sm:text-base">
            Fill in your details below and secure your perfect getaway at Berlin Holidays
          </p>
        </div>

        {/* Booking Form */}
        <div
          className="max-w-5xl mx-auto"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          <div className="bg-white dark:bg-normalBlack rounded-2xl shadow-2xl overflow-hidden border-2 border-transparent hover:border-khaki transition-all duration-300">
            {/* Gradient Top Border */}
            <div className="h-3 bg-gradient-to-r from-[#c49e72] via-[#006938] to-[#c49e72]"></div>

            <form onSubmit={handleSubmit} className="p-6 lg:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Check-in Date */}
                <div className="relative" data-aos="fade-up" data-aos-duration="1000">
                  <label className="block text-lightBlack dark:text-white font-semibold font-Garamond text-base mb-3 uppercase">
                    <FaCalendarAlt className="inline mr-2 text-[#006938]" />
                    Check-In
                  </label>
                  <input
                    type="date"
                    name="checkInDate"
                    value={formData.checkInDate}
                    onChange={handleInputChange}
                    min={today}
                    className="w-full h-14 px-4 border-2 border-[#e8e8e8] dark:border-gray-700 focus:border-[#c49e72] dark:focus:border-[#c49e72] text-lightBlack dark:text-white bg-[#f7f5f2] dark:bg-gray-800 outline-none rounded-lg font-Lora transition-all duration-300 focus:ring-2 focus:ring-[#c49e72]/20"
                    required
                  />
                </div>

                {/* Check-out Date */}
                <div className="relative" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="100">
                  <label className="block text-lightBlack dark:text-white font-semibold font-Garamond text-base mb-3 uppercase">
                    <FaCalendarAlt className="inline mr-2 text-[#006938]" />
                    Check-Out
                  </label>
                  <input
                    type="date"
                    name="checkOutDate"
                    value={formData.checkOutDate}
                    onChange={handleInputChange}
                    min={formData.checkInDate || today}
                    className="w-full h-14 px-4 border-2 border-[#e8e8e8] dark:border-gray-700 focus:border-[#c49e72] dark:focus:border-[#c49e72] text-lightBlack dark:text-white bg-[#f7f5f2] dark:bg-gray-800 outline-none rounded-lg font-Lora transition-all duration-300 focus:ring-2 focus:ring-[#c49e72]/20"
                    required
                  />
                </div>

                {/* Rooms */}
                <div className="relative" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200">
                  <label className="block text-lightBlack dark:text-white font-semibold font-Garamond text-base mb-3 uppercase">
                    <FaBed className="inline mr-2 text-[#006938]" />
                    Rooms
                  </label>
                  <div className="flex items-center h-14 border-2 border-[#e8e8e8] dark:border-gray-700 bg-[#f7f5f2] dark:bg-gray-800 rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => handleDecrement("rooms")}
                      className="w-14 h-full bg-[#c49e72] hover:bg-[#b38a5f] text-white font-bold text-xl transition-colors duration-300"
                    >
                      -
                    </button>
                    <div className="flex-1 text-center text-lightBlack dark:text-white font-bold font-Lora text-lg">
                      {formData.rooms}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleIncrement("rooms")}
                      className="w-14 h-full bg-[#c49e72] hover:bg-[#b38a5f] text-white font-bold text-xl transition-colors duration-300"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Guests Dropdown */}
                <div className="relative" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="300">
                  <label className="block text-lightBlack dark:text-white font-semibold font-Garamond text-base mb-3 uppercase">
                    <FaUsers className="inline mr-2 text-[#006938]" />
                    Guests
                  </label>
                  <div
                    className="relative h-14 border-2 border-[#e8e8e8] dark:border-gray-700 bg-[#f7f5f2] dark:bg-gray-800 rounded-lg cursor-pointer hover:border-[#c49e72] transition-all duration-300"
                    onClick={() => setShowGuestDropdown(!showGuestDropdown)}
                  >
                    <div className="flex items-center justify-between h-full px-4">
                      <span className="text-lightBlack dark:text-white font-Lora">
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
                            <FaUserFriends className="text-[#006938] mr-3 text-xl" />
                            <div>
                              <p className="text-lightBlack dark:text-white font-semibold font-Garamond">
                                Adults
                              </p>
                              <p className="text-xs text-gray dark:text-lightGray font-Lora">
                                Age 13+
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDecrement("adults");
                              }}
                              className="w-10 h-10 bg-[#c49e72] hover:bg-[#b38a5f] text-white font-bold rounded-lg transition-colors duration-300"
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-lightBlack dark:text-white font-bold font-Lora text-lg">
                              {formData.adults}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleIncrement("adults");
                              }}
                              className="w-10 h-10 bg-[#c49e72] hover:bg-[#b38a5f] text-white font-bold rounded-lg transition-colors duration-300"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Children */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <FaChild className="text-[#006938] mr-3 text-xl" />
                            <div>
                              <p className="text-lightBlack dark:text-white font-semibold font-Garamond">
                                Children
                              </p>
                              <p className="text-xs text-gray dark:text-lightGray font-Lora">
                                Age 0-12
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDecrement("children");
                              }}
                              className="w-10 h-10 bg-[#c49e72] hover:bg-[#b38a5f] text-white font-bold rounded-lg transition-colors duration-300"
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-lightBlack dark:text-white font-bold font-Lora text-lg">
                              {formData.children}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleIncrement("children");
                              }}
                              className="w-10 h-10 bg-[#c49e72] hover:bg-[#b38a5f] text-white font-bold rounded-lg transition-colors duration-300"
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
              <div
                className="bg-[#f7f5f2] dark:bg-gray-800 rounded-xl p-6 mb-8 border-l-4 border-[#006938]"
                data-aos="fade-up"
                data-aos-duration="1000"
              >
                <h3 className="text-lg font-bold font-Garamond text-lightBlack dark:text-white mb-4">
                  Booking Summary
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-Lora text-sm">
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
              <div className="text-center" data-aos="fade-up" data-aos-duration="1000">
                <button
                  type="submit"
                  className="group relative px-12 py-5 bg-[#006938] hover:bg-[#004d27] text-white font-bold font-Garamond text-lg uppercase rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    <FaBed className="mr-3 text-xl" />
                    Book Now
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#c49e72] to-[#006938] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;

