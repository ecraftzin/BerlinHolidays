// src/Components/BookingForm/BookingModal.jsx
import { useState, useEffect, useCallback } from "react";
import { FaCalendarAlt, FaBed, FaUsers, FaChild, FaUserFriends, FaTimes, FaUser, FaEnvelope, FaPhone, FaIdCard, FaUpload } from "react-icons/fa";
import { BiChevronDown } from "react-icons/bi";
import Swal from "sweetalert2";
import { createBooking } from "../../services/bookingService";
import { getAvailableRoomsForBooking } from "../../services/availabilityService";
import { uploadIdProof } from "../../services/storageService";
import { useAuth } from "../../Context/AuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


// Helper function to format date in local timezone (YYYY-MM-DD)
const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const BookingModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    checkInDate: "",
    checkOutDate: "",
    selectedRooms: [], // Array of selected room IDs
    adults: 1,
    children: 0,
  });

  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    phone: "",
    specialRequests: "",
  });

  // Available rooms for selected dates
  const [availableRooms, setAvailableRooms] = useState([]);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  // ID Proof upload state
  const [idProofFile, setIdProofFile] = useState(null);
  const [idProofPreview, setIdProofPreview] = useState(null);
  const [uploadingIdProof, setUploadingIdProof] = useState(false);

  // Fetch available rooms when dates change
  const fetchAvailableRooms = useCallback(async () => {
    if (!formData.checkInDate || !formData.checkOutDate) {
      setAvailableRooms([]);
      setFormData(prev => ({ ...prev, selectedRooms: [] }));
      return;
    }

    // Validate dates
    if (new Date(formData.checkOutDate) <= new Date(formData.checkInDate)) {
      setAvailableRooms([]);
      return;
    }

    setCheckingAvailability(true);
    try {
      const result = await getAvailableRoomsForBooking(
        formData.checkInDate,
        formData.checkOutDate
      );

      if (!result.error && result.data) {
        setAvailableRooms(result.data);
        // Clear selected rooms that are no longer available
        setFormData(prev => ({
          ...prev,
          selectedRooms: prev.selectedRooms.filter(id =>
            result.data.some(room => room.id === id)
          )
        }));
      } else {
        setAvailableRooms([]);
      }
    } catch (error) {
      console.error('Error fetching available rooms:', error);
      setAvailableRooms([]);
    } finally {
      setCheckingAvailability(false);
    }
  }, [formData.checkInDate, formData.checkOutDate]);

  useEffect(() => {
    fetchAvailableRooms();
  }, [fetchAvailableRooms]);

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

  // Toggle room selection
  const handleRoomToggle = (roomId) => {
    setFormData((prev) => {
      const isSelected = prev.selectedRooms.includes(roomId);
      if (isSelected) {
        return {
          ...prev,
          selectedRooms: prev.selectedRooms.filter(id => id !== roomId)
        };
      } else {
        return {
          ...prev,
          selectedRooms: [...prev.selectedRooms, roomId]
        };
      }
    });
  };

  const handleIncrement = (field) => {
    // Limit adults to 2 per selected room
    const roomCount = formData.selectedRooms.length || 1;
    if (field === "adults" && formData.adults >= roomCount * 2) {
      return;
    }
    // Limit children to 2 per selected room
    if (field === "children" && formData.children >= roomCount * 2) {
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field] + 1,
    }));
  };

  const handleDecrement = (field) => {
    if (formData[field] > (field === "adults" ? 1 : 0)) {
      setFormData((prev) => ({
        ...prev,
        [field]: prev[field] - 1,
      }));
    }
  };

  const handleContactInputChange = (e) => {
    const { name, value } = e.target;
    setContactData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle ID Proof file selection
  const handleIdProofChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        Swal.fire({
          title: "Invalid File Type",
          text: "Please upload a JPEG, PNG, WebP image or PDF document.",
          icon: "error",
          confirmButtonColor: "#006938",
        });
        return;
      }
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          title: "File Too Large",
          text: "Maximum file size is 5MB.",
          icon: "error",
          confirmButtonColor: "#006938",
        });
        return;
      }
      setIdProofFile(file);
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setIdProofPreview(e.target.result);
        reader.readAsDataURL(file);
      } else {
        setIdProofPreview(null); // PDF files don't have preview
      }
    }
  };

  // Remove selected ID proof
  const handleRemoveIdProof = () => {
    setIdProofFile(null);
    setIdProofPreview(null);
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

    if (formData.selectedRooms.length === 0) {
      Swal.fire({
        title: "Error",
        text: "Please select at least one room",
        icon: "error",
        confirmButtonColor: "#006938",
      });
      return;
    }

    // Show contact form
    setShowContactForm(true);
  };

  const handleFinalSubmit = async () => {
    // Validate contact information
    if (!contactData.name || !contactData.email) {
      Swal.fire({
        title: "Error",
        text: "Please provide your name and email",
        icon: "error",
        confirmButtonColor: "#006938",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactData.email)) {
      Swal.fire({
        title: "Error",
        text: "Please provide a valid email address",
        icon: "error",
        confirmButtonColor: "#006938",
      });
      return;
    }

    // Validate ID proof is uploaded
    if (!idProofFile) {
      Swal.fire({
        title: "ID Proof Required",
        text: "Please upload your ID proof to continue with the booking.",
        icon: "error",
        confirmButtonColor: "#006938",
      });
      return;
    }

    const totalGuests = formData.adults + formData.children;

    // Get all selected room details
    const selectedRoomDetails = formData.selectedRooms.map(roomId => {
      const room = availableRooms.find(r => r.id === roomId);
      return room;
    }).filter(Boolean);

    // Create room_ids as JSON array and room_names as comma-separated string
    const roomIds = JSON.stringify(formData.selectedRooms);
    const roomNames = selectedRoomDetails.map(r => r.name).join(', ');

    // Upload ID proof first
    setUploadingIdProof(true);
    let idProofUrl = null;

    try {
      const uploadResult = await uploadIdProof(idProofFile);
      if (uploadResult.error) {
        throw uploadResult.error;
      }
      idProofUrl = uploadResult.data.publicUrl;
    } catch (error) {
      setUploadingIdProof(false);
      Swal.fire({
        title: "Upload Failed",
        text: "Failed to upload ID proof. Please try again.",
        icon: "error",
        confirmButtonColor: "#006938",
      });
      return;
    }
    setUploadingIdProof(false);

    // Create ONE booking with all selected rooms
    const bookingData = {
      user_id: user?.id || null,
      customer_name: contactData.name,
      customer_email: contactData.email,
      customer_phone: contactData.phone || null,
      room_id: formData.selectedRooms[0], // Primary room ID for compatibility
      room_ids: roomIds, // JSON array of all room IDs
      room_name: roomNames, // Comma-separated room names
      check_in_date: formData.checkInDate,
      check_out_date: formData.checkOutDate,
      number_of_rooms: formData.selectedRooms.length,
      number_of_adults: formData.adults,
      number_of_children: formData.children,
      total_guests: totalGuests,
      special_requests: contactData.specialRequests || null,
      status: "pending",
      id_proof_url: idProofUrl, // ID proof document URL
    };

    const saveResult = await createBooking(bookingData);

    if (saveResult.data) {
      setShowContactForm(false);
      Swal.fire({
        title: "Success!",
        text: "Your booking request has been submitted successfully! We'll contact you shortly to confirm your reservation.",
        icon: "success",
        confirmButtonColor: "#006938",
      });

      // Reset forms
      setFormData({
        checkInDate: "",
        checkOutDate: "",
        selectedRooms: [],
        adults: 1,
        children: 0,
      });
      setContactData({
        name: "",
        email: "",
        phone: "",
        specialRequests: "",
      });
      setIdProofFile(null);
      setIdProofPreview(null);
      setAvailableRooms([]);
      onClose();
    } else {
      const errorMessage = saveResult.error?.code === 'INSUFFICIENT_ROOMS'
        ? saveResult.error.message
        : "Failed to submit booking. Please try again or contact us directly.";

      Swal.fire({
        title: "Room Not Available",
        text: errorMessage,
        icon: "error",
        confirmButtonColor: "#006938",
      });
      // Refresh available rooms
      fetchAvailableRooms();
    }
  };

  const totalGuests = formData.adults + formData.children;

  // Check if rooms are available and at least one room is selected
  const isRoomAvailable = availableRooms.length > 0 && formData.selectedRooms.length > 0;

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

  <DatePicker
    selected={formData.checkInDate ? new Date(formData.checkInDate + 'T00:00:00') : null}
    onChange={(date) =>
      setFormData((prev) => ({
        ...prev,
        checkInDate: formatLocalDate(date),
        checkOutDate: prev.checkOutDate && new Date(prev.checkOutDate + 'T00:00:00') <= date
          ? "" // reset checkout if it's before check-in
          : prev.checkOutDate,
      }))
    }
    minDate={new Date()}
    dateFormat="dd-MM-yyyy"
    placeholderText="Select check-in date"
    className="
      w-full h-12 px-4 border-2 border-[#e8e8e8]
      dark:border-gray-700 focus:border-[#c49e72] dark:focus:border-[#c49e72]
      text-lightBlack dark:text-white bg-[#f7f5f2] dark:bg-gray-800
      outline-none rounded-lg font-Lora transition-all duration-300"/>
           </div>

            {/* Check-out Date */}
            <div className="relative">
           <label className="block text-lightBlack dark:text-white font-semibold font-Garamond text-sm mb-2 uppercase">
          <FaCalendarAlt className="inline mr-2 text-[#006938]" />
           Check-Out
          </label>

          <DatePicker
          selected={formData.checkOutDate ? new Date(formData.checkOutDate + 'T00:00:00') : null}
        onChange={(date) =>
         setFormData((prev) => ({
          ...prev,
          checkOutDate: formatLocalDate(date),
         }))
         }
          minDate={formData.checkInDate ? new Date(formData.checkInDate + 'T00:00:00') : new Date()}
          dateFormat="dd-MM-yyyy"
           placeholderText="Select check-out date"
           className="
          w-full h-12 px-4 border-2 border-[#e8e8e8]
          dark:border-gray-700 focus:border-[#c49e72] dark:focus:border-[#c49e72]
         text-lightBlack dark:text-white bg-[#f7f5f2] dark:bg-gray-800
            outline-none rounded-lg font-Lora transition-all duration-300"/></div>

            {/* Room Available - Multi-select */}
            <div className="relative md:col-span-2">
              <label className="block text-lightBlack dark:text-white font-semibold font-Garamond text-sm mb-2 uppercase">
                <FaBed className="inline mr-2 text-[#006938]" />
                Room Available
                {checkingAvailability && (
                  <span className="ml-2 text-xs text-gray-500 font-normal">(Checking...)</span>
                )}
              </label>
              {!formData.checkInDate || !formData.checkOutDate ? (
                <div className="w-full h-12 px-4 border-2 border-[#e8e8e8] dark:border-gray-700 bg-[#f7f5f2] dark:bg-gray-800 rounded-lg font-Lora flex items-center text-gray-500 text-sm">
                  Please select check-in and check-out dates first
                </div>
              ) : availableRooms.length === 0 && !checkingAvailability ? (
                <div className="w-full h-12 px-4 border-2 border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 rounded-lg font-Lora flex items-center text-red-600 dark:text-red-400 text-sm">
                  No rooms available for selected dates
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border-2 border-[#e8e8e8] dark:border-gray-700 bg-[#f7f5f2] dark:bg-gray-800 rounded-lg">
                  {availableRooms.map((room) => (
                    <label
                      key={room.id}
                      className={`flex items-center p-2 rounded-lg cursor-pointer transition-all duration-300 ${
                        formData.selectedRooms.includes(room.id)
                          ? 'bg-[#006938] text-white'
                          : 'bg-white dark:bg-gray-700 hover:bg-[#c49e72]/20'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.selectedRooms.includes(room.id)}
                        onChange={() => handleRoomToggle(room.id)}
                        className="sr-only"
                      />
                      <div className="flex-1">
                        <span className={`font-Lora text-xs ${formData.selectedRooms.includes(room.id) ? 'text-white' : 'text-lightBlack dark:text-white'}`}>
                          {room.name}
                        </span>
                        <span className={`block text-xs ${formData.selectedRooms.includes(room.id) ? 'text-white/80' : 'text-gray-500'}`}>
                          ₹{room.base_price}/night
                        </span>
                      </div>
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                        formData.selectedRooms.includes(room.id)
                          ? 'bg-white border-white'
                          : 'border-gray-400'
                      }`}>
                        {formData.selectedRooms.includes(room.id) && (
                          <svg className="w-2 h-2 text-[#006938]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              )}
              {formData.selectedRooms.length > 0 && (
                <p className="mt-1 text-xs text-[#006938] font-Lora">
                  {formData.selectedRooms.length} room{formData.selectedRooms.length !== 1 ? 's' : ''} selected
                </p>
              )}
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
                  <div className="absolute top-full left-0 right--15 mt-2 bg-white dark:bg-gray-800 border-2 border-[#c49e72] rounded-lg shadow-2xl z-50 p-4">
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
          {/* Guest / Contact Details */}
         <div
        className="bg-[#f7f5f2] dark:bg-gray-800 rounded-xl p-6 mb-8 border-l-4 border-[#c49e72]">
        <h3 className="text-lg font-bold font-Garamond text-lightBlack dark:text-white mb-4">
        Guest Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-Lora text-sm">
    {/* Full Name */}
        <div>
        <label className="block text-lightBlack dark:text-white font-semibold font-Garamond text-sm mb-2">
        <FaUser className="inline mr-2 text-[#006938]" />
        Full Name <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        name="name"
        value={contactData.name}
        onChange={handleContactInputChange}
        className="w-full px-4 py-3 border-2 border-[#e8e8e8] dark:border-gray-700 focus:border-[#c49e72] dark:focus:border-[#c49e72] text-lightBlack dark:text-white bg-[#f7f5f2] dark:bg-gray-800 outline-none rounded-lg font-Lora transition-all duration-300"
        placeholder="Enter your full name"
        required
      />
    </div>

    {/* Mobile Number */}
    <div>
      <label className="block text-lightBlack dark:text-white font-semibold font-Garamond text-sm mb-2">
        <FaPhone className="inline mr-2 text-[#006938]" />
        Mobile Number <span className="text-red-500">*</span>
      </label>
      <input
        type="tel"
        name="phone"
        value={contactData.phone}
        onChange={handleContactInputChange}
        className="w-full px-4 py-3 border-2 border-[#e8e8e8] dark:border-gray-700 focus:border-[#c49e72] dark:focus:border-[#c49e72] text-lightBlack dark:text-white bg-[#f7f5f2] dark:bg-gray-800 outline-none rounded-lg font-Lora transition-all duration-300"
        placeholder="Enter your mobile number"
        required
      />
    </div>

    {/* Email Address */}
    <div>
      <label className="block text-lightBlack dark:text-white font-semibold font-Garamond text-sm mb-2">
        <FaEnvelope className="inline mr-2 text-[#006938]" />
        Email Address <span className="text-red-500">*</span>
      </label>
      <input
        type="email"
        name="email"
        value={contactData.email}
        onChange={handleContactInputChange}
        className="w-full px-4 py-3 border-2 border-[#e8e8e8] dark:border-gray-700 focus:border-[#c49e72] dark:focus:border-[#c49e72] text-lightBlack dark:text-white bg-[#f7f5f2] dark:bg-gray-800 outline-none rounded-lg font-Lora transition-all duration-300"
        placeholder="Enter your email address"
        required
      />
    </div>

    {/* Special Requests */}
    <div className="md:col-span-2">
      <label className="block text-lightBlack dark:text-white font-semibold font-Garamond text-sm mb-2">
        Special Requests
      </label>
      <textarea
        name="specialRequests"
        value={contactData.specialRequests}
        onChange={handleContactInputChange}
        rows="3"
        className="w-full px-4 py-3 border-2 border-[#e8e8e8] dark:border-gray-700 focus:border-[#c49e72] dark:focus:border-[#c49e72] text-lightBlack dark:text-white bg-[#f7f5f2] dark:bg-gray-800 outline-none rounded-lg font-Lora transition-all duration-300"
        placeholder="Any special requests or requirements?"
      ></textarea>
    </div>

    {/* ID Proof Upload */}
    <div className="md:col-span-2">
      <label className="block text-lightBlack dark:text-white font-semibold font-Garamond text-sm mb-2">
        <FaIdCard className="inline mr-2 text-[#006938]" />
        ID Proof (Booked User) <span className="text-red-500">*</span>
      </label>

      {/* ID Proof Message */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-3 mb-3">
        <p className="text-xs text-amber-800 dark:text-amber-200 font-Lora">
          <strong>Note:</strong> Only the booked user's ID proof is required during online booking.
          ID proofs of other adults and children must be shown directly to resort management at check-in.
        </p>
      </div>

      {!idProofFile ? (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#c49e72] dark:border-gray-600 rounded-lg cursor-pointer bg-[#f7f5f2] dark:bg-gray-800 hover:bg-[#f0ebe4] dark:hover:bg-gray-700 transition-all duration-300">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <FaUpload className="w-8 h-8 mb-2 text-[#c49e72]" />
            <p className="mb-1 text-sm text-gray-500 dark:text-gray-400 font-Lora">
              <span className="font-semibold">Click to upload</span> your ID proof
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-Lora">
              JPEG, PNG, WebP or PDF (Max 5MB)
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
            onChange={handleIdProofChange}
          />
        </label>
      ) : (
        <div className="flex items-center justify-between p-3 border-2 border-[#006938] dark:border-[#006938] rounded-lg bg-green-50 dark:bg-green-900/20">
          <div className="flex items-center">
            {idProofPreview ? (
              <img src={idProofPreview} alt="ID Preview" className="w-12 h-12 object-cover rounded mr-3" />
            ) : (
              <div className="w-12 h-12 bg-[#006938] rounded flex items-center justify-center mr-3">
                <FaIdCard className="text-white text-xl" />
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-lightBlack dark:text-white font-Lora">{idProofFile.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-Lora">
                {(idProofFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemoveIdProof}
            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all"
          >
            <FaTimes />
          </button>
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
                <p className="text-gray dark:text-lightGray mb-1">Rooms Selected</p>
                <p className="text-lightBlack dark:text-white font-semibold">
                  {formData.selectedRooms.length > 0
                    ? availableRooms
                        .filter(r => formData.selectedRooms.includes(r.id))
                        .map(r => r.name)
                        .join(', ')
                    : "None selected"}
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

          {/* Checking Availability Indicator */}
          {checkingAvailability && (
            <div className="py-2 text-center mb-4">
              <span className="text-gray dark:text-lightGray text-sm font-Lora">
                Checking availability...
              </span>
            </div>
          )}

          {/* Book Now Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={!isRoomAvailable || checkingAvailability}
              className={`group relative px-8 lg:px-12 py-4 font-bold font-Garamond text-base lg:text-lg uppercase rounded-lg shadow-xl transition-all duration-300 overflow-hidden ${
                isRoomAvailable && !checkingAvailability
                  ? 'bg-[#006938] hover:bg-[#004d27] text-white hover:shadow-2xl transform hover:-translate-y-1'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
            >
              <span className="relative z-10 flex items-center justify-center">
                <FaBed className="mr-3 text-lg" />
                {checkingAvailability ? 'Checking...' : 'Book Now'}
              </span>
              {isRoomAvailable && !checkingAvailability && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#c49e72] to-[#006938] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Contact Information Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/70 z-[10000] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-normalBlack rounded-xl shadow-2xl max-w-md w-full">
            <div className="h-3 bg-gradient-to-r from-[#c49e72] via-[#006938] to-[#c49e72]"></div>

            <div className="p-6">
              <h2 className="text-2xl font-bold font-Garamond text-lightBlack dark:text-white mb-4">
                Your Contact Information
              </h2>
              <p className="text-sm text-gray dark:text-lightGray font-Lora mb-6">
                Please provide your details to complete the booking
              </p>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-lightBlack dark:text-white font-semibold font-Garamond text-sm mb-2">
                    <FaUser className="inline mr-2 text-[#006938]" />
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={contactData.name}
                    onChange={handleContactInputChange}
                    className="w-full px-4 py-3 border-2 border-[#e8e8e8] dark:border-gray-700 focus:border-[#c49e72] dark:focus:border-[#c49e72] text-lightBlack dark:text-white bg-[#f7f5f2] dark:bg-gray-800 outline-none rounded-lg font-Lora transition-all duration-300"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-lightBlack dark:text-white font-semibold font-Garamond text-sm mb-2">
                    <FaEnvelope className="inline mr-2 text-[#006938]" />
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={contactData.email}
                    onChange={handleContactInputChange}
                    className="w-full px-4 py-3 border-2 border-[#e8e8e8] dark:border-gray-700 focus:border-[#c49e72] dark:focus:border-[#c49e72] text-lightBlack dark:text-white bg-[#f7f5f2] dark:bg-gray-800 outline-none rounded-lg font-Lora transition-all duration-300"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-lightBlack dark:text-white font-semibold font-Garamond text-sm mb-2">
                    <FaPhone className="inline mr-2 text-[#006938]" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={contactData.phone}
                    onChange={handleContactInputChange}
                    className="w-full px-4 py-3 border-2 border-[#e8e8e8] dark:border-gray-700 focus:border-[#c49e72] dark:focus:border-[#c49e72] text-lightBlack dark:text-white bg-[#f7f5f2] dark:bg-gray-800 outline-none rounded-lg font-Lora transition-all duration-300"
                    placeholder="Enter your phone number"
                  />
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-lightBlack dark:text-white font-semibold font-Garamond text-sm mb-2">
                    Special Requests
                  </label>
                  <textarea
                    name="specialRequests"
                    value={contactData.specialRequests}
                    onChange={handleContactInputChange}
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-[#e8e8e8] dark:border-gray-700 focus:border-[#c49e72] dark:focus:border-[#c49e72] text-lightBlack dark:text-white bg-[#f7f5f2] dark:bg-gray-800 outline-none rounded-lg font-Lora transition-all duration-300"
                    placeholder="Any special requests or requirements?"
                  ></textarea>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowContactForm(false)}
                  disabled={uploadingIdProof}
                  className="flex-1 px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold font-Garamond rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFinalSubmit}
                  disabled={uploadingIdProof}
                  className="flex-1 px-6 py-3 bg-[#006938] hover:bg-[#004d27] text-white font-bold font-Garamond rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadingIdProof ? 'Uploading ID...' : 'Submit Booking'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingModal;

