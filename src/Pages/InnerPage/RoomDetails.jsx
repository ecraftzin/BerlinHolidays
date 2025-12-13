import { BsArrowLeft, BsArrowRight, BsCheck2 } from "react-icons/bs";
import BreadCrumb from "../../BreadCrumb/BreadCrumb";
import { useState, useEffect, useCallback } from "react";
import { FiLogOut } from "react-icons/fi";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { getRoomTypeBySlug } from "../../services/roomService";
import { createBooking } from "../../services/bookingService";
import { checkAvailabilityForBooking } from "../../services/availabilityService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../../Context/AuthContext";

// Helper function to format date in local timezone (YYYY-MM-DD)
const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const RoomDetails = () => {
  const [imageIndex, setImageIndex] = useState(0);
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { slug } = useParams();
  const bookingsData = location.state && location.state;

  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  // Booking form state - interactive fields
  const [bookingFormData, setBookingFormData] = useState({
    checkInDate: bookingsData?.selectedInDate || formatLocalDate(new Date()),
    checkOutDate: bookingsData?.selectedOutDate || "",
    adults: bookingsData?.adult || 1,
    children: bookingsData?.children || 0,
    rooms: bookingsData?.room ?? 1,
  });

  // Availability state
  const [availableRooms, setAvailableRooms] = useState(8); // Default to total rooms
  const [isRoomAvailable, setIsRoomAvailable] = useState(true);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  // Fetch room data by slug
  useEffect(() => {
    const fetchRoomData = async () => {
      setLoading(true);

      // First check if room data was passed via navigation state
      if (location.state?.roomData) {
        setRoomData(location.state.roomData);
        setLoading(false);
        return;
      }

      // Otherwise fetch from database using slug
      if (slug) {
        const result = await getRoomTypeBySlug(slug);
        if (!result.error && result.data) {
          setRoomData(result.data);
        }
      }
      setLoading(false);
    };

    fetchRoomData();
  }, [slug, location.state]);

  // Check availability when dates or room data changes
  const checkRoomAvailability = useCallback(async () => {
    if (!roomData?.id || !bookingFormData.checkInDate || !bookingFormData.checkOutDate) {
      return;
    }

    setCheckingAvailability(true);
    try {
      const result = await checkAvailabilityForBooking(
        roomData.id,
        bookingFormData.checkInDate,
        bookingFormData.checkOutDate,
        1 // Check for at least 1 room
      );

      if (!result.error && result.data) {
        const { isAvailable, availability } = result.data;

        // Calculate minimum available rooms across all dates
        // Each room type represents a single physical room
        let minAvailable = roomData.total_rooms || 1;
        if (availability && availability.length > 0) {
          minAvailable = Math.min(...availability.map(a => a.available_rooms || 0));
        }

        setAvailableRooms(minAvailable);
        setIsRoomAvailable(isAvailable && minAvailable > 0);

        // If current rooms selection exceeds available, adjust it
        if (bookingFormData.rooms > minAvailable && minAvailable > 0) {
          setBookingFormData(prev => ({ ...prev, rooms: minAvailable }));
        }
      }
    } catch (error) {
      console.error('Error checking availability:', error);
    } finally {
      setCheckingAvailability(false);
    }
  }, [roomData, bookingFormData.checkInDate, bookingFormData.checkOutDate]);

  useEffect(() => {
    checkRoomAvailability();
  }, [checkRoomAvailability]);

  const images = roomData?.images && roomData.images.length > 0
    ? roomData.images
    : ["/images/inner/room-details-1.jpg", "/images/inner/room-details-2.jpg"];

  const prevBtn = () => {
    setImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };
  const nextBtn = () => {
    setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Handle booking form input changes
  const handleBookingInputChange = (e) => {
    const { name, value } = e.target;
    setBookingFormData(prev => ({
      ...prev,
      [name]: name === 'adults' || name === 'children' || name === 'rooms'
        ? parseInt(value) || 0
        : value
    }));
  };

  // booking alert message - now saves to database
  const setAlert = async () => {
    // Check if room is available
    if (!isRoomAvailable) {
      Swal.fire({
        title: "Room Not Available",
        text: "This room is not available for the selected dates. Please choose different dates.",
        icon: "error",
        confirmButtonColor: "#006938",
      });
      return;
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      const result = await Swal.fire({
        title: "Login Required",
        text: "Please log in to book a room",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#006938",
        cancelButtonColor: "#c49e72",
        confirmButtonText: "Login",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        navigate("/login");
      }
      return;
    }

    // First, collect contact information
     const { value: formValues } = await Swal.fire({
    title: "Your Contact Details",
    html: `
      <div class="space-y-4 text-left font-Lora text-sm">
        <!-- Name -->
        <div>
          <label class="block mb-1 text-xs font-semibold text-gray-500">
            Full Name <span class="text-red-500">*</span>
          </label>
          <input
            id="swal-name"
            type="text"
            placeholder="Enter your full name"
            class="w-full px-4 py-3 border-2 border-[#e8e8e8] rounded-lg
                   bg-[#f7f5f2] text-[13px] text-[#1f2933]
                   focus:outline-none focus:border-[#c49e72]
                   focus:ring-1 focus:ring-[#c49e72]/50"
          />
        </div>

        <!-- Email -->
        <div>
          <label class="block mb-1 text-xs font-semibold text-gray-500">
            Email Address <span class="text-red-500">*</span>
          </label>
          <input
            id="swal-email"
            type="email"
            placeholder="you@example.com"
            class="w-full px-4 py-3 border-2 border-[#e8e8e8] rounded-lg
                   bg-[#f7f5f2] text-[13px] text-[#1f2933]
                   focus:outline-none focus:border-[#c49e72]
                   focus:ring-1 focus:ring-[#c49e72]/50"
          />
        </div>

        <!-- Phone -->
        <div>
          <label class="block mb-1 text-xs font-semibold text-gray-500">
            Phone Number <span class="text-red-400 text-[11px]">*</span>
          </label>
          <input
            id="swal-phone"
            type="tel"
            placeholder="Enter your phone number"
            class="w-full px-4 py-3 border-2 border-[#e8e8e8] rounded-lg
                   bg-[#f7f5f2] text-[13px] text-[#1f2933]
                   focus:outline-none focus:border-[#c49e72]
                   focus:ring-1 focus:ring-[#c49e72]/50"
          />
        </div>

        <!-- Special Requests -->
        <div>
          <label class="block mb-1 text-xs font-semibold text-gray-500">
            Special Requests <span class="text-gray-400 text-[11px]">(optional)</span>
          </label>
          <textarea
            id="swal-requests"
            rows="3"
            placeholder="Any special requests or requirements?"
            class="w-full px-4 py-3 border-2 border-[#e8e8e8] rounded-lg
                   bg-[#f7f5f2] text-[13px] text-[#1f2933]
                   focus:outline-none focus:border-[#c49e72]
                   focus:ring-1 focus:ring-[#c49e72]/50 resize-none"
          ></textarea>
        </div>
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Continue to Booking",
    cancelButtonText: "Cancel",
    background: "#f7f5f2",
    color: "#1f2933",
    confirmButtonColor: "#006938", // still needed for accessibility
    cancelButtonColor: "#c49e72",
    buttonsStyling: false, // use our own Tailwind classes
    customClass: {
      popup:
        "rounded-2xl shadow-2xl border border-[#e8e2d8] max-w-lg w-full",
      title:
        "font-Garamond text-2xl text-[#1f2933] mb-2 uppercase tracking-[0.08em]",
      confirmButton:
        "px-6 py-2.5 bg-[#006938] hover:bg-[#004d27] text-white text-sm " +
        "font-Garamond font-semibold rounded-full shadow-md " +
        "transition-all duration-200 ml-2",
      cancelButton:
        "px-6 py-2.5 bg-white hover:bg-[#f3ede4] text-[#4b5563] text-sm " +
        "font-Garamond font-semibold rounded-full border border-[#d1c3ad] " +
        "transition-all duration-200",
    },
    preConfirm: () => {
      const name = document.getElementById("swal-name").value.trim();
      const email = document.getElementById("swal-email").value.trim();
      const phone = document.getElementById("swal-phone").value.trim();
      const requests = document.getElementById("swal-requests").value.trim();

      if (!name || !email) {
        Swal.showValidationMessage("Please enter your name and email");
        return false;
      }

      const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
      if (!emailRegex.test(email)) {
        Swal.showValidationMessage("Please enter a valid email address");
        return false;
      }

      return { name, email, phone, requests };
    },
  });

  if (!formValues) return; // user cancelled

    if (!formValues) return; // User cancelled

    // Validate dates
    if (new Date(bookingFormData.checkInDate) >= new Date(bookingFormData.checkOutDate)) {
      Swal.fire({
        title: "Invalid Dates",
        text: "Check-out date must be after check-in date",
        icon: "error",
        confirmButtonColor: "#006938",
      });
      return;
    }

    // Use the interactive booking form data
    const checkInDate = bookingFormData.checkInDate;
    const checkOutDate = bookingFormData.checkOutDate;
    const adults = bookingFormData.adults;
    const children = bookingFormData.children;
    const rooms = bookingFormData.rooms;

    const result = await Swal.fire({
      title: "Confirm Your Booking",
      html: `
        <div style="text-align: left; font-family: Lora, serif;">
          <h3 style="color: #006938; margin-bottom: 10px;">Guest Details</h3>
          <p style="margin: 5px 0;"><strong>Name:</strong> ${formValues.name}</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> ${formValues.email}</p>
          ${formValues.phone ? `<p style="margin: 5px 0;"><strong>Phone:</strong> ${formValues.phone}</p>` : ''}

          <h3 style="color: #006938; margin-top: 15px; margin-bottom: 10px;">Room Details</h3>
          <p style="margin: 5px 0;"><strong>Room:</strong> ${roomData?.name || 'Room'}</p>
          <p style="margin: 5px 0;"><strong>Check-in:</strong> ${new Date(checkInDate).toLocaleDateString()}</p>
          <p style="margin: 5px 0;"><strong>Check-out:</strong> ${new Date(checkOutDate).toLocaleDateString()}</p>
          <p style="margin: 5px 0;"><strong>Rooms:</strong> ${rooms}</p>
          <p style="margin: 5px 0;"><strong>Adults:</strong> ${adults}</p>
          <p style="margin: 5px 0;"><strong>Children:</strong> ${children}</p>
          ${formValues.requests ? `<p style="margin: 5px 0;"><strong>Special Requests:</strong> ${formValues.requests}</p>` : ''}
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#006938",
      cancelButtonColor: "#c49e72",
      confirmButtonText: "Confirm Booking",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      // Save booking to database
      const bookingData = {
        user_id: user?.id || null, // Link booking to logged-in user
        customer_name: formValues.name,
        customer_email: formValues.email,
        customer_phone: formValues.phone || null,
        room_id: roomData?.id || null,
        room_name: roomData?.name || "Room",
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        number_of_rooms: rooms,
        number_of_adults: adults,
        number_of_children: children,
        special_requests: formValues.requests || null,
        status: "pending",
      };

      const saveResult = await createBooking(bookingData);

      if (saveResult.data) {
        Swal.fire({
          title: "Congratulation!",
          text: "Your booking has been confirmed! We'll contact you shortly to finalize your reservation.",
          icon: "success",
          background: "#c19d68",
          color: "#fff",
          confirmButtonColor: "#006938",
        });
        navigate("/");
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to submit booking. Please try again or contact us directly.",
          icon: "error",
          confirmButtonColor: "#006938",
        });
      }
    }
  };
  if (loading) {
    return (
      <section className="">
        <BreadCrumb title="room details" />
        <div className="py-20 2xl:py-[120px] dark:bg-lightBlack">
          <div className="Container text-center">
            <p className="text-gray dark:text-lightGray font-Lora">Loading room details...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!roomData) {
    return (
      <section className="">
        <BreadCrumb title="room details" />
        <div className="py-20 2xl:py-[120px] dark:bg-lightBlack">
          <div className="Container text-center">
            <p className="text-gray dark:text-lightGray font-Lora">Room not found.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="">
      <BreadCrumb title="room details" />

      {/* Room Details */}
      <div className="py-20 2xl:py-[120px] dark:bg-lightBlack">
        <div className="Container grid grid-cols-6 md:grid-cols-7 lg:grid-cols-6 gap-5 ">
          <div className="col-span-6 md:col-span-4">
            {/* Image custom slider */}
            <div
              className="overflow-hidden relative group "
              data-aos="zoom-in-up"
              data-aos-duration="1000"
            >
              <img
                src={images[imageIndex]}
                alt={roomData.name}
                className="transition-all duration-500 delay-300"
              />
              <div className="flex ">
                <span
                  className="w-[40px] h-[40px] lg:w-[50px] lg:h-[50px] bg-white dark:bg-lightBlack hover:bg-khaki dark:hover:bg-khaki grid items-center justify-center absolute bottom-[45%] left-[-50px] group-hover:left-4 lg:group-hover:left-6 transition-all duration-300 cursor-pointer"
                  onClick={() => prevBtn()}
                >
                  <BsArrowLeft
                    size={20}
                    className="text-lightBlack dark:text-white hover:text-white"
                  />
                </span>
                <span
                  className="w-[40px] h-[40px] lg:w-[50px] lg:h-[50px] bg-white dark:bg-lightBlack hover:bg-khaki dark:hover:bg-khaki grid items-center justify-center absolute bottom-[45%] right-[-50px] group-hover:right-4 lg:group-hover:right-6 transition-all duration-300 cursor-pointer"
                  onClick={() => nextBtn()}
                >
                  <BsArrowRight
                    size={20}
                    className="text-lightBlack dark:text-white hover:text-white"
                  />
                </span>
              </div>
            </div>
            {/* Room content */}
            <div className="pt-5 lg:pt-[35px]  pr-3">
              <p className="text-base font-Lora text-khaki uppercase">{roomData.category_label || "LUXURY ROOM"}</p>
              <h2
                className="py-2 sm:py-3 md:py-4 lg:py-[19px] 2xl:py-[25px] font-Garamond text-[22px] sm:text-2xl md:text-3xl lg:text-4xl 2xl:text-[38px] 3xl:text-[40px] leading-6 lg:leading-[26px]  text-lightBlack dark:text-white font-semibold"
                data-aos="zoom-in-up"
                data-aos-duration="1000"
              >
                {roomData.name}
              </h2>
              <p
                className="text-sm lg:text-base leading-6 text-gray dark:text-lightGray font-normal font-Lora"
                data-aos="zoom-in-up"
                data-aos-duration="1000"
              >
                {roomData.description || "Experience luxury and comfort in our beautifully designed rooms."}
              </p>
              {roomData.long_description && (
                <p
                  className="mt-5 2xl:mt-7 text-sm lg:text-base leading-6 text-gray dark:text-lightGray font-normal font-Lora"
                  data-aos="zoom-in-up"
                  data-aos-duration="1000"
                >
                  {roomData.long_description}
                </p>
              )}
              {/* Check-In and check-Out */}
              <div
                className="md:flex items-center flex-col md:flex-row md:justify-between py-10 lg:py-[60px]"
                data-aos="zoom-in-up"
                data-aos-duration="1000"
              >
                {/* check-in */}
                <div>
                  <div className="flex items-center space-x-2">
                    <FiLogOut className="text-khaki rotate-180" size={24} />
                    <h4 className="text-xl md:text-2xl lg:text-[26px] leading-[26px] font-Garamond text-lightBlack dark:text-white font-semibold ">
                      Check In
                    </h4>
                  </div>
                  <ul className="space-y-2 lg:space-y-3 mt-5 lg:mt-[30px]">
                    <li className="flex items-center">
                      <BsCheck2 size={16} className="text-khaki mr-2" />
                      <span className="text-sm lg:text-base leading-[26px] text-gray dark:text-lightGray font-normal font-Lora">
                        Check-in from 9:00 AM - anytime
                      </span>
                    </li>
                    <li className="flex items-center">
                      <BsCheck2 size={16} className="text-khaki mr-2" />
                      <span className="text-sm lg:text-base leading-[26px] text-gray dark:text-lightGray font-normal font-Lora">
                        Early check-in subject to availability
                      </span>
                    </li>
                  </ul>
                </div>
                {/* check-out */}
                <div className="mt-5 md:mt-0">
                  <div className="flex items-center space-x-2">
                    <FiLogOut className="text-khaki" size={24} />
                    <h4 className="text-xl md:text-2xl lg:text-[26px] leading-[26px] font-Garamond text-lightBlack dark:text-white font-semibold ">
                      Check Out
                    </h4>
                  </div>
                  <ul className="space-y-2 lg:space-y-3 mt-5 lg:mt-[30px]">
                    <li className="flex items-center">
                      <BsCheck2 size={16} className="text-khaki mr-2" />
                      <span className="text-sm lg:text-base leading-[26px] text-gray dark:text-lightGray font-normal font-Lora">
                        Check-out before noon
                      </span>
                    </li>
                    <li className="flex items-center">
                      <BsCheck2 size={16} className="text-khaki mr-2" />
                      <span className="text-sm lg:text-base leading-[26px] text-gray dark:text-lightGray font-normal font-Lora">
                        Check-out from 9:00 AM - anytime
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              {/* House Roles */}
              <div data-aos="zoom-in-up" data-aos-duration="1000">
                <h2
                  className="pb-2 sm:pb-3 md:pb-4 lg:pb-[19px] 2xl:pb-6
                font-Garamond text-[22px] sm:text-2xl md:text-3xl 2xl:text-[32px] leading-7 lg:leading-[26px] text-lightBlack dark:text-white font-semibold"
                >
                  House Rules
                </h2>
                <p className="text-sm lg:text-base leading-6 text-gray dark:text-lightGray font-normal font-Lora">
                  Professionally deliver fully researched scenarios with turnkey
                  communities. Competently unleash empowered applications
                  without seamless data. Uniquely underwhelm quality outsourcing
                  before transparent relationships. Efficiently enhance diverse
                  relationships whereas leveraged
                </p>
              </div>
              {/* Childreen & Extra Beds */}
              <div
                className="pt-10 2xl:pt-[60px]"
                data-aos="zoom-in-up"
                data-aos-duration="1000"
              >
                <h2
                  className="pb-2 sm:pb-3 md:pb-4 lg:pb-[19px] 2xl:pb-6
                font-Garamond text-[22px] sm:text-2xl md:text-3xl 2xl:text-[32px] leading-7 lg:leading-[26px] text-lightBlack dark:text-white font-semibold"
                >
                  Childreen & Extra Beds
                </h2>
                <p className="text-sm lg:text-base leading-6 text-gray dark:text-lightGray font-normal font-Lora mb-5 2xl:mb-[30px]">
                  Applications without seamless data. Uniquely underwhelm
                  quality outsourcing before transparent relationships.
                  Efficiently enhance diverse relationships whereas leveraged
                  new house cafe.
                </p>
                <ul className="space-y-2 lg:space-y-3 ">
                  <li className="flex items-center">
                    <BsCheck2 size={16} className="text-khaki mr-2" />
                    <span className="text-sm lg:text-base leading-[26px] text-gray dark:text-lightGray font-normal font-Lora">
                      Quickly generate bricks-and-clicks
                    </span>
                  </li>
                  <li className="flex items-center">
                    <BsCheck2 size={16} className="text-khaki mr-2" />
                    <span className="text-sm lg:text-base leading-[26px] text-gray dark:text-lightGray font-normal font-Lora">
                      Interactively cultivate visionary platforms
                    </span>
                  </li>
                  <li className="flex items-center">
                    <BsCheck2 size={16} className="text-khaki mr-2" />
                    <span className="text-sm lg:text-base leading-[26px] text-gray dark:text-lightGray font-normal font-Lora">
                      Energistically envisioneer resource
                    </span>
                  </li>
                  <li className="flex items-center">
                    <BsCheck2 size={16} className="text-khaki mr-2" />
                    <span className="text-sm lg:text-base leading-[26px] text-gray dark:text-lightGray font-normal font-Lora">
                      Uniquely restore turnkey paradigms
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/*  */}
          <div className="col-span-6 md:col-span-3 lg:col-span-2">
            {/* booking details sidebar */}
            <div>
              <div className=" bg-whiteSmoke dark:bg-normalBlack px-7 py-8 md:px-8 md:py-10 lg:px-9 lg:py-11 2xl:px-10 2xl:pt-[45px] 2xl:pb-[30px] grid-flow-row-dense">
                <h4 className="font-Garamond text-xl sm:text-[22px] md:text-2xl xl:text-3xl leading-7 md:leading-8 lg:leading-10 xl:leading-[50px] 2xl:leading-[60px] 3xl:leading-[70px] text-lightBlack dark:text-white font-semibold mb-4">
                  Booking
                </h4>
                <div
                  className="grid items-center gap-[18px] "
                  data-aos="zoom-in-up"
                  data-aos-duration="1000"
                >
            {/* Check-in Date Picker */}
             <div className="bg-white dark:bg-lightBlack px-3 sm:px-5 2xl:px-6 py-3  border border-[#006938] rounded-md">
            <label className="block text-xs font-Lora font-semibold text-gray dark:text-lightGray mb-2">
              Check In
                </label>
              <DatePicker
                selected={
               bookingFormData.checkInDate
            ? new Date(bookingFormData.checkInDate + 'T00:00:00')
             : null
             }
           onChange={(date) =>
           setBookingFormData((prev) => ({
           ...prev,
           checkInDate: formatLocalDate(date),
         // optional: if checkout is before new check-in, reset it
          checkOutDate:
          prev.checkOutDate &&
          new Date(prev.checkOutDate + 'T00:00:00') <= date
            ? ""
            : prev.checkOutDate,
      }))
       }
     minDate={new Date()}
     dateFormat="dd-MM-yyyy"
     placeholderText="Select check-in date"
     className="w-full text-sm md:text-[15px] leading-[26px] font-Lora font-medium
               text-khaki bg-transparent border-none outline-none cursor-pointer"
      wrapperClassName="w-full"/>
      </div>

{/* Check-out Date Picker */}
        <div className="bg-white dark:bg-lightBlack px-3 sm:px-5 2xl:px-6 py-3  border border-[#006938] rounded-md">
         <label className="block text-xs font-Lora font-semibold text-gray dark:text-lightGray mb-2">
        Check Out
         </label>
     <DatePicker
       selected={
      bookingFormData.checkOutDate
        ? new Date(bookingFormData.checkOutDate + 'T00:00:00')
        : null
    }
    onChange={(date) =>
      setBookingFormData((prev) => ({
        ...prev,
        checkOutDate: formatLocalDate(date),
      }))
    }
    minDate={
      bookingFormData.checkInDate
        ? new Date(bookingFormData.checkInDate + 'T00:00:00')
        : new Date()
    }
    dateFormat="dd-MM-yyyy"
    placeholderText="Select check-out date"
    className="w-full text-sm md:text-[15px] leading-[26px] font-Lora font-medium
               text-khaki bg-transparent border-none outline-none cursor-pointer"
    wrapperClassName="w-full"/>
        </div>


                  {/* Adults Selector */}
                  <div className="bg-white dark:bg-lightBlack px-3 sm:px-5 2xl:px-6 py-3  border border-[#006938] rounded-md">
                    <label className="block text-xs font-Lora font-semibold text-gray dark:text-lightGray mb-2">
                      Adults
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setBookingFormData(prev => ({ ...prev, adults: Math.max(1, prev.adults - 1) }))}
                        className="w-8 h-8 flex items-center justify-center bg-khaki text-white rounded-full hover:bg-opacity-80 transition-all"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        name="adults"
                        value={bookingFormData.adults}
                        onChange={handleBookingInputChange}
                        min="1"
                        max="10"
                        className="w-16 text-center text-sm md:text-[15px] leading-[26px] font-Lora font-medium text-khaki bg-transparent border border-gray-300 dark:border-gray-600 rounded outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setBookingFormData(prev => ({ ...prev, adults: Math.min(10, prev.adults + 1) }))}
                        className="w-8 h-8 flex items-center justify-center bg-khaki text-white rounded-full hover:bg-opacity-80 transition-all"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Children Selector */}
                  <div className="bg-white dark:bg-lightBlack px-3 sm:px-5 2xl:px-6 py-3  border border-[#006938] rounded-md">
                    <label className="block text-xs font-Lora font-semibold text-gray dark:text-lightGray mb-2">
                      Children
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setBookingFormData(prev => ({ ...prev, children: Math.max(0, prev.children - 1) }))}
                        className="w-8 h-8 flex items-center justify-center bg-khaki text-white rounded-full hover:bg-opacity-80 transition-all"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        name="children"
                        value={bookingFormData.children}
                        onChange={handleBookingInputChange}
                        min="0"
                        max="10"
                        className="w-16 text-center text-sm md:text-[15px] leading-[26px] font-Lora font-medium text-khaki bg-transparent border border-gray-300 dark:border-gray-600 rounded outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setBookingFormData(prev => ({ ...prev, children: Math.min(10, prev.children + 1) }))}
                        className="w-8 h-8 flex items-center justify-center bg-khaki text-white rounded-full hover:bg-opacity-80 transition-all"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Rooms Selector */}
                  <div className="bg-white dark:bg-lightBlack px-3 sm:px-5 2xl:px-6 py-3  border border-[#006938] rounded-md">
                    <label className="block text-xs font-Lora font-semibold text-gray dark:text-lightGray mb-2">
                      Rooms {availableRooms > 0 && <span className="text-[#006938]">({availableRooms} available)</span>}
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setBookingFormData(prev => ({ ...prev, rooms: Math.max(1, prev.rooms - 1) }))}
                        className="w-8 h-8 flex items-center justify-center bg-khaki text-white rounded-full hover:bg-opacity-80 transition-all"
                        disabled={!isRoomAvailable || checkingAvailability}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        name="rooms"
                        value={bookingFormData.rooms}
                        onChange={handleBookingInputChange}
                        min="1"
                        max={availableRooms}
                        className="w-16 text-center text-sm md:text-[15px] leading-[26px] font-Lora font-medium text-khaki bg-transparent border border-gray-300 dark:border-gray-600 rounded outline-none"
                        disabled={!isRoomAvailable || checkingAvailability}
                      />
                      <button
                        type="button"
                        onClick={() => setBookingFormData(prev => ({ ...prev, rooms: Math.min(availableRooms, prev.rooms + 1) }))}
                        className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${
                          bookingFormData.rooms >= availableRooms || !isRoomAvailable
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-khaki text-white hover:bg-opacity-80'
                        }`}
                        disabled={bookingFormData.rooms >= availableRooms || !isRoomAvailable || checkingAvailability}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Room Not Available Message */}
              {!isRoomAvailable && bookingFormData.checkInDate && bookingFormData.checkOutDate && (
                <div className="py-3 px-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md mb-4">
                  <p className="text-red-600 dark:text-red-400 font-Lora text-sm text-center">
                    This room is not available.
                  </p>
                </div>
              )}

              {/* Checking Availability Indicator */}
              {checkingAvailability && (
                <div className="py-2 text-center">
                  <span className="text-gray dark:text-lightGray text-sm font-Lora">
                    Checking availability...
                  </span>
                </div>
              )}

              <div className="py-5">
                <button
                  className={`w-full h-10 2xl:h-[50px] font-Lora font-semibold px-5 ${
                    isRoomAvailable && !checkingAvailability
                      ? 'bg-khaki text-white hover-animBg after:rounded-none after:bg-normalBlack'
                      : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  }`}
                  onClick={() => setAlert()}
                  disabled={!isRoomAvailable || checkingAvailability}
                >
                  {checkingAvailability ? 'Checking...' : 'Confirm Booking'}
                </button>
              </div>
            </div>

            {/* Price Display */}
            <div
              className="mt-3 sm:mt-4 md:mt-5 lg:mt-6 bg-whiteSmoke dark:bg-normalBlack px-7 py-8  border border-[#006938] rounded-md"
              data-aos="zoom-in-up"
              data-aos-duration="1000"
            >
              <h4 className="font-Garamond text-xl sm:text-[22px] md:text-2xl xl:text-3xl leading-7 md:leading-8 lg:leading-10 text-lightBlack dark:text-white font-semibold mb-4">
                Price
              </h4>
              <div className="flex items-center justify-between">
                <span className="text-sm lg:text-base text-gray dark:text-lightGray font-Lora">Per Night</span>
                <span className="text-2xl font-Garamond text-[#006938] font-semibold">₹{roomData.base_price}</span>
              </div>
            </div>
            {/* Amenities */}
            <div
              className="mt-3 sm:mt-4 md:mt-5 lg:mt-6"
              data-aos="zoom-in-up"
              data-aos-duration="1000"
            >
              <h4 className="font-Garamond text-xl sm:text-[22px] md:text-2xl xl:text-3xl leading-7 md:leading-8 lg:leading-10 xl:leading-[50px] 2xl:leading-[60px] 3xl:leading-[70px] text-lightBlack dark:text-white font-semibold mb-6">
                Room Details
              </h4>
              <div className="grid items-center ">
                {roomData.max_occupancy && (
                  <div className="flex items-center py-5 border-b-[1px] border-lightGray dark:border-gray">
                    <img
                      src="/images/inner/room-amenities-1.png"
                      className="text-khaki mr-2 md:mr-3 xl:mr-[15px]"
                    />
                    <span className="text-sm lg:text-[15px] leading-[26px] text-gray dark:text-lightGray font-normal font-Lora">
                      Max {roomData.max_occupancy} Persons
                    </span>
                  </div>
                )}
                {roomData.bed_type && (
                  <div className="flex items-center py-5 border-b-[1px] border-lightGray dark:border-gray">
                    <img
                      src="/images/home-1/room-bottom-icon.png"
                      className="text-khaki mr-2 md:mr-3 xl:mr-[15px]"
                    />
                    <span className="text-sm lg:text-[15px] leading-[26px] text-gray dark:text-lightGray font-normal font-Lora">
                      {roomData.bed_type}
                    </span>
                  </div>
                )}
                {roomData.size && (
                  <div className="flex items-center py-5 border-b-[1px] border-lightGray dark:border-gray">
                    <img
                      src="/images/inner/room-amenities-5.png"
                      className="text-khaki mr-2 md:mr-3 xl:mr-[15px]"
                    />
                    <span className="text-sm lg:text-[15px] leading-[26px] text-gray dark:text-lightGray font-normal font-Lora">
                      {roomData.size}
                    </span>
                  </div>
                )}
                {roomData.amenities && roomData.amenities.length > 0 && roomData.amenities.map((amenity, index) => (
                  <div key={index} className={`flex items-center py-5 ${index < roomData.amenities.length - 1 ? 'border-b-[1px] border-lightGray dark:border-gray' : ''}`}>
                    <BsCheck2 size={16} className="text-khaki mr-2 md:mr-3 xl:mr-[15px]" />
                    <span className="text-sm lg:text-[15px] leading-[26px] text-gray dark:text-lightGray font-normal font-Lora">
                      {amenity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoomDetails;
