import { BiChevronDown } from "react-icons/bi";
import BreadCrumb from "../../BreadCrumb/BreadCrumb";
import { useState, useEffect } from "react";
import { FaStar, FaRegStar } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";
import { MdEmail, MdOutlineShareLocation } from "react-icons/md";
import { IoIosCall } from "react-icons/io";
import Swal from "sweetalert2";
import emailjs from "@emailjs/browser";
import { getActiveRoomTypes } from "../../services/roomService";
import { getAvailableRoomTypesForDateRange } from "../../services/availabilityService";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";



const FindRoom = () => {
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
  const [hasSearched, setHasSearched] = useState(false);
  const [searchMessage, setSearchMessage] = useState("");

  // Facilities slider breakpoints
  const [sliderRef] = useKeenSlider({
    breakpoints: {
      "(min-width: 400px)": {
        slides: { origin: "center", perView: 1 },
        spacing: 10,
      },
      "(min-width: 500px)": {
        slides: { origin: "center", perView: 1.5 },
        spacing: 10,
      },
      "(min-width: 600px)": {
        slides: { origin: "center", perView: 1 },
        spacing: 15,
      },
      "(min-width: 768px)": {
        slides: { origin: "center", perView: 1 },
        spacing: 18,
      },
      "(min-width: 992px)": {
        slides: { origin: "center", perView: 2 },
        spacing: 20,
      },
    },
    loop: true,
    initial: 0,
  });

  // Fetch all room types initially
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

  // Search for available rooms
  const handleSearch = async () => {
    if (!selectedInDate || !selectedOutDate) {
      Swal.fire({
        title: "Missing Dates",
        text: "Please select both check-in and check-out dates",
        icon: "warning",
        confirmButtonColor: "#c49e72",
      });
      return;
    }

    if (new Date(selectedInDate) >= new Date(selectedOutDate)) {
      Swal.fire({
        title: "Invalid Dates",
        text: "Check-out date must be after check-in date",
        icon: "error",
        confirmButtonColor: "#c49e72",
      });
      return;
    }

    setLoadingRooms(true);
    setHasSearched(true);

    const result = await getAvailableRoomTypesForDateRange(selectedInDate, selectedOutDate, room);

    if (!result.error && result.data) {
      setRoomTypes(result.data);
      if (result.data.length === 0) {
        setSearchMessage("No rooms available for the selected dates. Please try different dates.");
      } else if (room > 1 && !result.hasEnoughRooms) {
        // Show rooms but warn that not enough are available for requested amount
        setSearchMessage(`${result.data.length} room${result.data.length > 1 ? 's' : ''} available. You requested ${room} rooms - please select ${room} from the available options below.`);
      } else {
        setSearchMessage(`${result.data.length} room${result.data.length > 1 ? 's' : ''} available for your dates`);
      }
    } else {
      // On error, show all rooms
      const allRooms = await getActiveRoomTypes();
      if (!allRooms.error && allRooms.data) {
        setRoomTypes(allRooms.data);
      }
      setSearchMessage("Showing all rooms");
    }

    setLoadingRooms(false);
  };

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
        <div className="relative z-[1] ">
        <div
          className="Container-Hero bg-lightBlack dark:bg-normalBlack  grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-5 items-center justify-center font-Lora py-3 lg:py-4 xl:py-5 2xl:py-6 border-t-[3px] border-t-khaki mt-[-75px]  left-0 right-0 z-[1]"
          data-aos="fade-down"
          data-aos-duration="1000"
        >
          <div className="p-3">
            <p className="text-sm text-lightGray ml-3">Check In</p>
            <div className="flex items-center pt-[2px] ">
              <input
                type="date"
                value={selectedInDate}
                onChange={(e) => setSelectedInDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="border-none bg-transparent focus:outline-transparent focus:border-transparent text-white focus:border-none outline-0  text-sm lg:text-base focus:ring-transparent"
                required
              />
            </div>
          </div>
          <div className="p-3">
            <p className="text-sm text-lightGray ml-3">Check Out</p>
            <div className="flex items-center pt-[2px] ">
              <input
                type="date"
                value={selectedOutDate}
                onChange={(e) => setSelectedOutDate(e.target.value)}
                min={selectedInDate || new Date().toISOString().split('T')[0]}
                className="border-none bg-transparent focus:outline-transparent focus:border-transparent text-white focus:border-none outline-0  text-sm lg:text-base focus:ring-transparent"
                required
              />
            </div>
          </div>
          <div className="p-3">
            <div
              className={`${({ isActive, isPending }) =>
                isPending
                  ? "pending"
                  : isActive
                  ? "active"
                  : ""} text-white  px-3 py-2 w-full block transition-all duration-300 group relative `}
              to="#"
            >
              <span
                className="flex items-center justify-between text-sm text-lightGray cursor-pointer"
                onClick={() => setOpen(!open)}
                title="click hear to open and close rooms extender"
              >
                Rooms
                <BiChevronDown className="" />
              </span>
              <div className="pt-[10px] text-sm sm:text-base">{room} Room</div>
              <div className="absolute pt-5  z-20">
                <div
                  className={`shadow-2xl ${
                    open ? "" : "hidden"
                  } rounded-sm bg-white text-black w-60 text-left dark:bg-normalBlack dark:text-white transition-all duration-500 text-sm py-4 `}
                >
                  <div className="py-2 px-5 group cursor-pointer">
                    <li className="flex items-center justify-between">
                      <div className="">{room} Room</div>
                      <div className="flex items-center space-x-2">
                        <button
                          className="w-5 h-5 md:w-6 md:h-6 bg-khaki text-white"
                          onClick={() => setRoom(room + 1)}
                        >
                          +
                        </button>
                        <button
                          className="w-5 h-5 md:w-6 md:h-6 bg-khaki text-white"
                          onClick={() => setRoom(room - 1)}
                          disabled={room <= 1}
                        >
                          -
                        </button>
                      </div>
                    </li>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3">
            <div
              className={`text-white   px-3 py-2 w-full block transition-all duration-300 group relative `}
              to="#"
            >
              <span
                className="flex items-center justify-between text-sm text-lightGray cursor-pointer"
                onClick={() => setGuestOpen(!guestOpen)}
                title="click hear to open and close Adult And Children extender"
              >
                Guests
                <BiChevronDown className="" />
              </span>
              <div className="pt-[10px] text-sm sm:text-base">
                {adult} Adult, {children} Child
              </div>
              <div className="absolute pt-5  z-20 ml-[-120px] sm:ml-0">
                <div
                  className={`shadow-2xl ${
                    guestOpen ? "" : "hidden"
                  } rounded-sm bg-white text-black w-60 text-left dark:bg-normalBlack dark:text-white transition-all duration-500 text-sm py-4 left`}
                >
                  <div className="py-2 px-5 group cursor-pointer">
                    <li className="flex items-center justify-between">
                      <div className="">{adult} Adult</div>
                      <div className="flex items-center space-x-2">
                        <button
                          className="w-5 h-5 md:w-6 md:h-6 bg-khaki text-white"
                          onClick={() => setAdult(adult + 1)}
                        >
                          +
                        </button>
                        <button
                          className="w-5 h-5 md:w-6 md:h-6 bg-khaki text-white"
                          onClick={() => setAdult(adult - 1)}
                          disabled={adult <= 1}
                        >
                          -
                        </button>
                      </div>
                    </li>
                    <li className="flex items-center justify-between mt-1">
                      <div className="">{children} Child</div>
                      <div className="flex items-center space-x-2">
                        <button
                          className="w-5 h-5 md:w-6 md:h-6 bg-khaki text-white"
                          onClick={() => setChildren(children + 1)}
                        >
                          +
                        </button>
                        <button
                          className="w-5 h-5 md:w-6 md:h-6 bg-khaki text-white"
                          onClick={() => setChildren(children - 1)}
                          disabled={children < 1}
                        >
                          -
                        </button>
                      </div>
                    </li>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={handleSearch}
            className="w-[142px] h-10 lg:h-[50px] text-[15px] bg-khaki font-Garamond border border-khaki text-white mx-auto col-span-2  md:col-span-1 lg:col-span-1 relative z-10 before:absolute before:top-0 before:right-0 before:-z-10 before:w-0 before:h-full before:bg-lightBlack before:transition-all before:duration-500 hover:before:w-full hover:before:left-0">
            Search Rooms
          </button>
        </div>
      </div>
        {/* Room Details - Dynamic from Database */}
        <div className="mt-14 2xl:mt-[60px] Container">
          <h2 className="text-xl md:text-2xl lg:text-[28px] leading-7 md:leading-8 lg:leading-9 text-lightBlack dark:text-white font-Garamond font-semibold mb-6 text-center">
            {hasSearched ? "Available Rooms" : "Our Rooms"}
          </h2>
          {searchMessage && (
            <p className="text-center text-khaki font-Lora mb-6">{searchMessage}</p>
          )}
        </div>
        {loadingRooms ? (
          <div className="text-center Container">
            <p className="text-gray dark:text-lightGray font-Lora">Searching for available rooms...</p>
          </div>
        ) : roomTypes.length === 0 ? (
          <div className="text-center Container">
            <p className="text-gray dark:text-lightGray font-Lora">
              {hasSearched
                ? "No rooms available for the selected dates. Please try different dates."
                : "No rooms available at the moment."}
            </p>
          </div>
        ) : (
          <div className="grid items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 xl:gap-[30px] Container">
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
                    <Link to={`/room_details/${roomType.slug}`} state={{ roomData: roomType }}>
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
                        <Link to={`/room_details/${roomType.slug}`} state={{ roomData: roomType }}>
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

      {/* Extra Facilities Section */}
      <div className="bg-normalBlack py-20 lg:py-[50px] relative">
        <div className="Container pb-[100px]">
          {/* Section heading */}
          <div
            className="flex items-center justify-between relative"
            data-aos="fade-up"
            data-aos-duration="1000"
          >
            <div className="sapce-y-3 md:space-y-4 lg:space-y-5 md:w-[450px] xl:w-[550px] font-Garamond">
              <h5 className="text-base text-khaki leading-[26px] font-medium">
                INDULGING IN THE FINER SIDE OF NATURE-INSPIRED LUXURY
              </h5>
              <h1 className="text-xl sm:text-3xl 2xl:text-[38px] leading-[38px] lg:leading-[44px] text-white font-semibold uppercase">
                RESTORE EXTRA FECILITIES FOR A LUXURIOUS LIFE
              </h1>
            </div>
          </div>
          <hr className="w-full h-[2px] text-gray bg-gray mt-10" />

          {/* Clients Facilities */}
          <div className="mt-14 2xl:mt-[60px] grid grid-cols-6 gap-5 md:gap-[30px]">
            <div
              className="col-span-6 sm:col-span-2"
              data-aos="zoom-in-up"
              data-aos-duration="1000"
            >
              <img
                src="/images/inner/faciliies-icon.png"
                alt="facilities-icon"
                className="w-10 h-10 md:w-20 md:h-20 xl:h-[100px] xl:w-[100px]"
              />
              <div className="my-5 2xl:my-[30px]">
                <h2 className="text-white text-xl sm:text-2xl 2xl:text-3xl leading-7 md:leading-8 lg:leading-9 xl:leading-10 2xl:leading-[44px] font-semibold font-Garamond">
                  SPA & Parlor Center
                </h2>
                <p className="text-sm sm:text-base font-Lora leading-[26px] text-lightGray">
                  Rejuvenate your senses with authentic Ayurvedic therapies,
                  rejuvenating massages, and modern beauty treatments — all
                  designed to refresh your body and mind amidst Wayanad's
                  calm surroundings.
                </p>
              </div>
            </div>
            {/* facilities slider */}
            <div
              ref={sliderRef}
              className="keen-slider col-span-6 sm:col-span-4"
              data-aos="zoom-in-up"
              data-aos-duration="1000"
            >
              {/* slide 1 */}
              <div className="keen-slider__slide number-slide1">
                <div className="col-span-2 relative">
                  <img
                    src="/images/inner/facilities-1.jpg"
                    className=""
                    alt=""
                  />
                  <div className="inline-flex items-center justify-between bg-lightBlack hover:bg-whiteSmoke dark:hover:bg-white transition-all duration-300 w-[90%] float-right absolute bottom-0 right-[20px] group">
                    <p className="text-white text-lg sm:text-xl lg:text-[18px] xl:text-[22px] group-hover:text-lightBlack leading-6 font-semibold font-Garamond px-5">
                      Gym Training Ground
                    </p>
                  </div>
                </div>
              </div>
              {/* slide 2 */}
              <div className="keen-slider__slide number-slide1">
                <div className="col-span-2 relative">
                  <img
                    src="/images/inner/facilities-2.jpg"
                    className=""
                    alt=""
                  />
                  <div className="inline-flex items-center justify-between bg-lightBlack hover:bg-whiteSmoke dark:hover:bg-white transition-all duration-300 w-[90%] float-right absolute bottom-0 right-[20px] group">
                    <p className="text-white text-lg sm:text-xl lg:text-[18px] xl:text-[22px] group-hover:text-lightBlack leading-6 font-semibold font-Garamond px-5">
                      Indoor Swimming Pool
                    </p>
                  </div>
                </div>
              </div>
              {/* slide 3 */}
              <div className="keen-slider__slide number-slide1">
                <div className="col-span-2 relative">
                  <img
                    src="/images/inner/facilities-3.jpg"
                    className=""
                    alt=""
                  />
                  <div className="inline-flex items-center justify-between bg-lightBlack hover:bg-whiteSmoke dark:hover:bg-white transition-all duration-300 w-[90%] float-right absolute bottom-0 right-[20px] group">
                    <p className="text-white text-lg sm:text-xl lg:text-[18px] xl:text-[22px] group-hover:text-lightBlack leading-6 font-semibold font-Garamond px-5">
                      Dining Area
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
