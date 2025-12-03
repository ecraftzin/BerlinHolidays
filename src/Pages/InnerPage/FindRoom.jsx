import { BiChevronDown } from "react-icons/bi";
import BreadCrumb from "../../BreadCrumb/BreadCrumb";
import { useState, useEffect } from "react";
import { FaStar, FaRegStar } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";
import { MdEmail, MdOutlineShareLocation } from "react-icons/md";
import { IoIosCall } from "react-icons/io";
import Swal from "sweetalert2";
import emailjs from "@emailjs/browser";
import { getActiveRoomTypes } from "../../services/roomService";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";



const FindRoom = () => {
  //  room info
  const location = useLocation();
  const roomsData = location.state && location.state;
  const [open, setOpen] = useState(false);
  const [guestOpen, setGuestOpen] = useState(false);
  const [room, setRoom] = useState(1);
  const [adult, setAdult] = useState(1);
  const [children, setChildren] = useState(0);
  const [selectedInDate, setSelectedInDate] = useState("");
  const [selectedOutDate, setSelectedOutDate] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Room types from database
  const [roomTypes, setRoomTypes] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);

  // Fetch room types from database
  useEffect(() => {
    const fetchRoomTypes = async () => {
      setLoadingRooms(true);
      const result = await getActiveRoomTypes();
      if (!result.error && result.data) {
        setRoomTypes(result.data);
      }
      setLoadingRooms(false);
    };
    fetchRoomTypes();
  }, []);

  // Helper function to render star rating
  const renderStars = (rating) => {
    const stars = [];
    const starCount = rating || 5;
    for (let i = 0; i < 5; i++) {
      if (i < starCount) {
        stars.push(<FaStar key={i} />);
      } else {
        stars.push(<FaRegStar key={i} />);
      }
    }
    return stars;
  };

  const handleCheckInDate = (e) => {
    let newDate = e.target.value;
    setSelectedInDate(newDate);
  };
  const handleCheckOutDate = (e) => {
    let newDate = e.target.value;
    setSelectedOutDate(newDate);
  };
  const bookingInfo = {
    ...roomsData,
    selectedInDate,
    selectedOutDate,
    room,
    adult,
    children,
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      Swal.fire("Error", "Please enter your name", "error");
      return;
    }
    if (!formData.email.trim()) {
      Swal.fire("Error", "Please enter your email", "error");
      return;
    }
    if (!formData.subject) {
      Swal.fire("Error", "Please select a subject", "error");
      return;
    }
    if (!formData.message.trim()) {
      Swal.fire("Error", "Please enter your message", "error");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Swal.fire("Error", "Please enter a valid email address", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      // Get EmailJS configuration from environment variables
      const emailJsServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const emailJsTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const emailJsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
      const contactEmail = import.meta.env.VITE_CONTACT_EMAIL;

      // Check if EmailJS is configured
      if (!emailJsServiceId || !emailJsTemplateId || !emailJsPublicKey || !contactEmail) {
        Swal.fire({
          title: "Setup Required",
          html: `
            <p>The contact form needs to be configured with EmailJS credentials.</p>
            <p style="margin-top: 10px;">Please see <strong>SETUP_NOW.md</strong> for quick setup instructions.</p>
            <p style="margin-top: 10px;">Or contact us directly at:</p>
            <p style="margin-top: 5px;"><strong>berlinvayanad@gmail.com</strong></p>
          `,
          icon: "info",
          confirmButtonColor: "#c49e72",
        });
        setIsSubmitting(false);
        return;
      }

      // Prepare email parameters
      const emailParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_email: contactEmail,
        submission_date: new Date().toLocaleString(),
      };

      // Send email via EmailJS
      await emailjs.send(
        emailJsServiceId,
        emailJsTemplateId,
        emailParams,
        emailJsPublicKey
      );

      // Success
      Swal.fire({
        title: "Success!",
        text: "Your message has been sent successfully. We'll get back to you soon!",
        icon: "success",
        confirmButtonColor: "#c49e72",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending email:", error);

      // Check if it's an EmailJS configuration error
      if (error.text && error.text.includes('Public Key is invalid')) {
        Swal.fire({
          title: "Setup Required",
          html: `
            <p>EmailJS credentials need to be configured.</p>
            <p style="margin-top: 10px;">📖 See <strong>SETUP_NOW.md</strong> for 5-minute setup guide.</p>
            <p style="margin-top: 10px;">Or contact us directly at:</p>
            <p style="margin-top: 5px;"><strong>berlinvayanad@gmail.com</strong></p>
            <p style="margin-top: 5px;"><strong>+91 956 2312 019</strong></p>
          `,
          icon: "info",
          confirmButtonColor: "#c49e72",
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to send your message. Please try again later or contact us directly at berlinvayanad@gmail.com",
          icon: "error",
          confirmButtonColor: "#c49e72",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section>
      <BreadCrumb title="Find Room" />
      {/* Check Availability */}
      <div className="bg-whiteSmoke dark:bg-normalBlack py-20 2xl:py-[120px]">
        <h1 className="text-[22px] sm:text-2xl md:text-3xl 2xl:text-[34px] leading-7 sm:leading-8 md:leading-9 lg:leading-10 2xl:leading-[44px] text-lightBlack dark:text-white  mb-5  md:mb-8 lg:mb-10 font-Garamond font-semibold uppercase text-center">
          CHECK Availability
        </h1>
        {/* Date and room info - Responsive Form */}
        <div
          className="Container bg-white dark:bg-lightBlack grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 items-center justify-center font-Lora py-4 lg:py-5 xl:py-6 border-t-[3px] border-t-khaki px-4 sm:px-5 md:px-7 2xl:px-10 gap-2 sm:gap-3"
          data-aos="zoom-in-up"
          data-aos-duration="1000"
        >
          {/* Check In Date */}
          <div className="p-2 sm:p-3 w-full">
            <p className="text-xs sm:text-sm text-gray dark:text-lightGray mb-1">Check In</p>
            <div className="relative">
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full h-10 sm:h-11 px-3 border border-gray/30 dark:border-gray/50 rounded-md bg-transparent focus:outline-none focus:border-khaki text-lightBlack dark:text-white text-sm sm:text-base cursor-pointer appearance-none"
                value={selectedInDate}
                onChange={handleCheckInDate}
                style={{
                  colorScheme: 'light dark'
                }}
              />
            </div>
          </div>

          {/* Check Out Date */}
          <div className="p-2 sm:p-3 w-full">
            <p className="text-xs sm:text-sm text-gray dark:text-lightGray mb-1">Check Out</p>
            <div className="relative">
              <input
                type="date"
                required
                min={selectedInDate || new Date().toISOString().split('T')[0]}
                className="w-full h-10 sm:h-11 px-3 border border-gray/30 dark:border-gray/50 rounded-md bg-transparent focus:outline-none focus:border-khaki text-lightBlack dark:text-white text-sm sm:text-base cursor-pointer appearance-none"
                value={selectedOutDate}
                onChange={handleCheckOutDate}
                style={{
                  colorScheme: 'light dark'
                }}
              />
            </div>
          </div>

          {/* Rooms Selector */}
          <div className="p-2 sm:p-3 w-full">
            <div className="relative">
              <p className="text-xs sm:text-sm text-gray dark:text-lightGray mb-1">Rooms</p>
              <div
                className="h-10 sm:h-11 px-3 border border-gray/30 dark:border-gray/50 rounded-md flex items-center justify-between cursor-pointer hover:border-khaki transition-colors"
                onClick={() => setOpen(!open)}
                title="Click to select rooms"
              >
                <span className="text-sm sm:text-base text-lightBlack dark:text-white">
                  {room} Room{room > 1 ? 's' : ''}
                </span>
                <BiChevronDown className={`text-gray transition-transform ${open ? 'rotate-180' : ''}`} />
              </div>
              {open && (
                <div className="absolute top-full left-0 right-0 mt-2 z-20 shadow-2xl rounded-md bg-white dark:bg-normalBlack border border-gray/20 py-3 px-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-lightBlack dark:text-white">{room} Room{room > 1 ? 's' : ''}</span>
                    <div className="flex items-center space-x-2">
                      <button
                        className="w-7 h-7 bg-khaki text-white rounded hover:bg-opacity-80 transition-colors"
                        onClick={(e) => { e.stopPropagation(); setRoom(room + 1); }}
                      >
                        +
                      </button>
                      <button
                        className="w-7 h-7 bg-khaki text-white rounded hover:bg-opacity-80 transition-colors disabled:opacity-50"
                        onClick={(e) => { e.stopPropagation(); setRoom(room - 1); }}
                        disabled={room <= 1}
                      >
                        -
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Guests Selector */}
          <div className="p-2 sm:p-3 w-full">
            <div className="relative">
              <p className="text-xs sm:text-sm text-gray dark:text-lightGray mb-1">Guests</p>
              <div
                className="h-10 sm:h-11 px-3 border border-gray/30 dark:border-gray/50 rounded-md flex items-center justify-between cursor-pointer hover:border-khaki transition-colors"
                onClick={() => setGuestOpen(!guestOpen)}
                title="Click to select guests"
              >
                <span className="text-sm sm:text-base text-lightBlack dark:text-white">
                  {adult} Adult{adult > 1 ? 's' : ''}, {children} Child{children !== 1 ? 'ren' : ''}
                </span>
                <BiChevronDown className={`text-gray transition-transform ${guestOpen ? 'rotate-180' : ''}`} />
              </div>
              {guestOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 z-20 shadow-2xl rounded-md bg-white dark:bg-normalBlack border border-gray/20 py-3 px-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-lightBlack dark:text-white">{adult} Adult{adult > 1 ? 's' : ''}</span>
                    <div className="flex items-center space-x-2">
                      <button
                        className="w-7 h-7 bg-khaki text-white rounded hover:bg-opacity-80 transition-colors"
                        onClick={(e) => { e.stopPropagation(); setAdult(adult + 1); }}
                      >
                        +
                      </button>
                      <button
                        className="w-7 h-7 bg-khaki text-white rounded hover:bg-opacity-80 transition-colors disabled:opacity-50"
                        onClick={(e) => { e.stopPropagation(); setAdult(adult - 1); }}
                        disabled={adult <= 1}
                      >
                        -
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-lightBlack dark:text-white">{children} Child{children !== 1 ? 'ren' : ''}</span>
                    <div className="flex items-center space-x-2">
                      <button
                        className="w-7 h-7 bg-khaki text-white rounded hover:bg-opacity-80 transition-colors"
                        onClick={(e) => { e.stopPropagation(); setChildren(children + 1); }}
                      >
                        +
                      </button>
                      <button
                        className="w-7 h-7 bg-khaki text-white rounded hover:bg-opacity-80 transition-colors disabled:opacity-50"
                        onClick={(e) => { e.stopPropagation(); setChildren(children - 1); }}
                        disabled={children < 1}
                      >
                        -
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Search Button */}
          <div className="p-2 sm:p-3 w-full sm:col-span-2 lg:col-span-1">
            <Link to="/room" state={bookingInfo ? bookingInfo : ""} className="block">
              <button className="w-full h-10 sm:h-11 text-sm sm:text-[15px] bg-khaki font-Garamond text-white rounded-md hover:bg-opacity-90 transition-colors">
                Search Rooms
              </button>
            </Link>
          </div>
        </div>
        {/* Room Details - Dynamic from Database */}
        {loadingRooms ? (
          <div className="mt-14 2xl:mt-[60px] text-center Container">
            <p className="text-gray dark:text-lightGray font-Lora">Loading rooms...</p>
          </div>
        ) : roomTypes.length === 0 ? (
          <div className="mt-14 2xl:mt-[60px] text-center Container">
            <p className="text-gray dark:text-lightGray font-Lora">No rooms available at the moment.</p>
          </div>
        ) : (
          <div className="mt-14 2xl:mt-[60px] grid items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 xl:gap-[30px] Container">
            {roomTypes.map((roomType) => (
              <div key={roomType.id} data-aos="zoom-in-up" data-aos-duration="1000">
                <div className="overflow-x-hidden 3xl:w-[410px] group relative">
                  <div className="relative">
                    <div className="overflow-hidden">
                      <img
                        src={roomType.images && roomType.images.length > 0 ? roomType.images[0] : "/images/inner/room-2.jpg"}
                        className="w-full h-[250px] object-cover group-hover:scale-110 transition-all duration-300"
                        alt={roomType.name}
                        onError={(e) => {
                          e.target.src = "/images/inner/room-2.jpg";
                        }}
                      />
                    </div>
                    <Link to={`/room/${roomType.slug}`} state={{ roomData: roomType }}>
                      <button className="flex items-center justify-center text-[15px] leading-[38px] bg-lightBlack absolute bottom-0 -left-40 px-5 text-white group-hover:left-0 transition-all duration-300 hover:bg-khaki">
                        View Details{" "}
                        <BsArrowRight className="w-4 h-4 ml-2 text-white" />
                      </button>
                    </Link>
                  </div>
                  <div className="font-Garamond">
                    <div className="px-5 3xl:px-6 py-2 inline-flex bg-khaki text-sm items-center justify-center text-white absolute top-[10px] right-[10px] font-Lora font-normal leading-[26px]">
                      <span>₹{roomType.base_price}</span>
                      <span className="mx-2">|</span>
                      <span>Night</span>
                    </div>

                    <div className="border-[1px] border-[#e8e8e8] dark:border-[#424242] border-t-0">
                      <div className="py-6 px-[30px]">
                        <h4 className="text-sm leading-[26px] text-khaki uppercase font-semibold">
                          {roomType.category_label || "Premium Room"}
                        </h4>
                        <Link to={`/room/${roomType.slug}`} state={{ roomData: roomType }}>
                          <h2 className="text-2xl lg:text-[28px] leading-[26px] font-semibold text-lightBlack dark:text-white py-4">
                            {roomType.name}
                          </h2>
                        </Link>
                        <p className="text-sm font-normal text-gray dark:text-lightGray font-Lora">
                          {roomType.size || `${roomType.capacity} Guests`}
                        </p>
                      </div>
                      <div className="border-t-[1px] border-[#e8e8e8] dark:border-[#424242] py-5">
                        <div className="px-[30px] flex items-center justify-between">
                          <div>
                            <span className="font-Lora text-base flex items-center">
                              <img
                                src="/images/home-1/room-bottom-icon.png"
                                alt=""
                              />
                              <span className="ml-[10px] text-gray dark:text-lightGray">
                                {roomType.bed_type || "Comfortable Bed"}
                              </span>
                            </span>
                          </div>
                          <span className="w-[1px] h-[25px] bg-[#ddd] dark:bg-gray"></span>
                          <ul className="flex items-center text-khaki space-x-[5px]">
                            {renderStars(roomType.star_rating)}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Contact form */}
      <div className="py-20 2xl:py-[120px] dark:bg-lightBlack">
        <div className="Container border border-lightGray dark:border-gray px-2 sm:px-7 md:px-10 lg:px-14 2xl:px-20 py-10 md:py-14 lg:py-18 xl:py-20 2xl:py-[100px]">
          <div className="flex items-center flex-col md:flex-row">
            <div
              className="p-5 flex-1"
              data-aos="zoom-in-up"
              data-aos-duration="1000"
            >
              <p className="font-Garamond text-base leading-[26px] text-khaki font-medium">
                CONTACT US
              </p>
              <h2 className="font-Garamond text-[22px] sm:text-2xl md:text-3xl lg:text-4xl 2xl:text-[38px] leading-7 md:leading-8 lg:leading-9 xl:leading-10 2xl:leading-[44px] text-uppercase text-lightBlack dark:text-white font-semibold my-3 md:my-5">
                CONTACT WITH US
              </h2>
              <p className="font-Lora text-sm sm:text-base leading-[26px]  text-gray dark:text-lightGray  font-normal">
                We’re here to make your stay seamless and memorable.
                Whether you’re planning a vacation, a romantic getaway, 
                or a family retreat, our team is always ready to assist 
                you with bookings, inquiries, and special requests. Get 
                in touch — we’d love to hear from you.
              </p>

              {/* call */}
              <div className="flex items-center my-4 md:my-5 lg:my-[26px] group">
                <div className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] lg:w-[50px] lg:h-[50px] 2xl:w-[60px] 2xl:h-[60px] bg-white dark:bg-normalBlack group-hover:bg-khaki dark:group-hover:bg-khaki grid items-center justify-center rounded-full">
                  <IoIosCall
                    size={20}
                    className="text-khaki group-hover:text-whiteSmoke"
                  />
                </div>
                <div className="ml-3 md:ml-4">
                  <p className="font-Lora text-sm leading-[26px] text-gray  font-normal dark:text-lightGray">
                    Call Us Now
                  </p>
                  <p className="font-Garamond text-lg sm:text-xl md:text-[22px] leading-[26px] text-lightBlack dark:text-white font-medium">
                    +980 123 (4567) 890
                  </p>
                </div>
              </div>
              <hr className="dark:text-gray dark:bg-gray text-lightGray bg-lightGray h-[1px]" />
              {/* email */}
              <div className="flex items-center my-4 md:my-5 lg:my-[26px] group">
                <div className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] lg:w-[50px] lg:h-[50px] 2xl:w-[60px] 2xl:h-[60px] bg-whiteSmoke dark:bg-normalBlack group-hover:bg-khaki dark:group-hover:bg-khaki grid items-center justify-center rounded-full">
                  <MdEmail
                    size={20}
                    className="text-khaki group-hover:text-whiteSmoke"
                  />
                </div>
                <div className="ml-3 md:ml-4">
                  <p className="font-Lora text-sm leading-[26px] text-gray dark:text-lightGray font-normal">
                    Send Email
                  </p>
                  <p className="font-Garamond text-lg sm:text-xl md:text-[22px] leading-[26px] text-lightBlack dark:text-white font-medium ">
                    berlinholidays@gmail.com
                  </p>
                </div>
              </div>
              <hr className="dark:text-gray dark:bg-gray text-lightGray bg-lightGray h-[1px]" />
              {/* location */}
              <div className="flex items-center my-4 md:my-5 lg:my-[26px] group">
                <div className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] lg:w-[50px] lg:h-[50px] 2xl:w-[60px] 2xl:h-[60px] bg-whiteSmoke dark:bg-normalBlack group-hover:bg-khaki dark:group-hover:bg-khaki grid items-center justify-center rounded-full">
                  <MdOutlineShareLocation
                    size={20}
                    className="text-khaki group-hover:text-whiteSmoke"
                  />
                </div>
                <div className="ml-3 md:ml-4">
                  <p className="font-Lora text-sm leading-[26px] text-gray dark:text-lightGray font-normal">
                    Our Locations
                  </p>
                  <p className="font-Garamond text-lg sm:text-xl md:text-[22px] leading-[26px] text-lightBlack dark:text-white font-medium ">
                    Wayanad Kerala <br />
                    India
                  </p>
                </div>
              </div>
            </div>
            <div
              className="flex-1 py-5 sm:p-5"
              data-aos="zoom-in-up"
              data-aos-duration="1000"
            >
              <div className="bg-lightBlack dark:bg-normalBlack  p-[30px] lg:p-[45px] 2xl:p-[61px]">
                <h2 className="font-Garamond text-[22px] sm:text-2xl md:text-[28px] leading-7 md:leading-8 lg:leading-9 xl:leading-10 2xl:leading-[44px] text-white font-semibold text-center">
                  GET IN TOUCH
                </h2>
                <form className="grid items-center grid-cols-1 gap-2 mt-8" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full h-12 md:h-13 lg:h-[59px] px-4 border border-gray dark:border-lightGray  outline-none  bg-transparent mt-4 focus:ring-0 placeholder:text-gray focus:outline-none focus:border-lightGray text-lightGray"
                    placeholder="Your Name"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full h-12 md:h-13 lg:h-[59px] px-4 border  border-gray dark:border-lightGray  outline-none  bg-transparent mt-4 focus:ring-0 placeholder:text-gray focus:outline-none focus:border-lightGray text-lightGray"
                    placeholder="Enter E-mail"
                    required
                  />
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full h-12 md:h-13 lg:h-[59px] px-4 border border-gray dark:border-lightGray text-white dark:text-lightGray outline-none bg-lightBlack mt-4 focus:ring-0 focus:border-khaki dark:focus:border-khaki focus:outline-none appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23c49e72' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                      backgroundPosition: 'right 0.5rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.5em 1.5em',
                    }}
                    required
                  >
                    <option value="" disabled>
                      Select Subject
                    </option>
                    <option value="Adventure">
                      Adventure
                    </option>
                    <option value="Honeymoon">
                      Honeymoon
                    </option>
                    <option value="Family Trip">
                      Family Trip
                    </option>
                    <option value="General Inquiry">
                      General Inquiry
                    </option>
                    <option value="Booking Inquiry">
                      Booking Inquiry
                    </option>
                  </select>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    cols="30"
                    rows="10"
                    className="w-full h-[121px] px-4 py-3 border border-gray dark:border-lightGray text-white dark:text-lightGray outline-none bg-transparent mt-4 focus:ring-0 placeholder:text-gray resize-none focus:border-khaki dark:focus:border-khaki focus:outline-none"
                    placeholder="Write Message:"
                    required
                  ></textarea>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-khaki text-white text-center h-10 2xl:h-[55px] mt-5 font-Garamond font-semibold transition-all duration-300 ${
                      isSubmitting
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-opacity-90'
                    }`}
                  >
                    {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FindRoom;
