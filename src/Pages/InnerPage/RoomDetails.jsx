import { BsArrowLeft, BsArrowRight, BsCheck2 } from "react-icons/bs";
import BreadCrumb from "../../BreadCrumb/BreadCrumb";
import { useState, useEffect } from "react";
import { FiLogOut } from "react-icons/fi";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { getRoomTypeBySlug } from "../../services/roomService";

const RoomDetails = () => {
  const [imageIndex, setImageIndex] = useState(0);
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { slug } = useParams();
  const bookingsData = location.state && location.state;

  const navigate = useNavigate();

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

  // booking alert message
  const setAlert = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You booking this rooms?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#008000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, i want!",
      color: "#fff",
      background: "#c19d68",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Congratulation!",
          text: "Booking Successful!",
          icon: "success",
          background: "#c19d68",
          color: "#fff",
          confirmButtonColor: "#008000",
        });
        navigate("/");
      }
    });
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
                  <div className="bg-white dark:bg-lightBlack h-10 lg:h-[50px] 2xl:h-[56px] grid items-center justify-start px-3 sm:px-5 2xl:px-6 ">
                    <p className="text-sm md:text-[15px] leading-[26px] font-Lora font-medium text-lightBlack dark:text-white">
                      Check In -{" "}
                      <span className="text-khaki">
                        {bookingsData && bookingsData.selectedInDate
                          ? new Date(bookingsData.selectedInDate)
                              .toDateString()
                              .slice(4)
                          : new Date().toDateString().slice(4)}
                      </span>
                    </p>
                  </div>
                  <div className="bg-white dark:bg-lightBlack h-10 lg:h-[50px] 2xl:h-[56px] grid items-center justify-start px-3 sm:px-5 2xl:px-6">
                    <p className="text-sm md:text-[15px] leading-[26px] font-Lora font-medium text-lightBlack dark:text-white">
                      Check Out -{" "}
                      <span className="text-khaki">
                        {bookingsData && bookingsData.selectedOutDate
                          ? new Date(bookingsData.selectedOutDate)
                              .toDateString()
                              .slice(4)
                          : new Date(
                              new Date().setDate(new Date().getDate() + 3)
                            )
                              .toDateString()
                              .slice(4)}
                      </span>{" "}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-lightBlack h-10 lg:h-[50px] 2xl:h-[56px] grid items-center justify-start px-3 sm:px-5 2xl:px-6">
                    <p className="text-sm md:text-[15px] leading-[26px] font-Lora font-medium text-lightBlack dark:text-white">
                      Adult -{" "}
                      <span className="text-khaki">
                        0
                        {bookingsData && bookingsData.adult
                          ? bookingsData.adult
                          : "2"}
                      </span>{" "}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-lightBlack h-10 lg:h-[50px] 2xl:h-[56px] grid items-center justify-start px-3 sm:px-5 2xl:px-6">
                    <p className="text-sm md:text-[15px] leading-[26px] font-Lora font-medium text-lightBlack dark:text-white">
                      Children -{" "}
                      <span className="text-khaki">
                        0
                        {bookingsData && bookingsData.children
                          ? bookingsData.children
                          : "1"}
                      </span>{" "}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-lightBlack h-10 lg:h-[50px] 2xl:h-[56px] grid items-center justify-start px-3 sm:px-5 2xl:px-6">
                    <p className="text-sm md:text-[15px] leading-[26px] font-Lora font-medium text-lightBlack dark:text-white">
                      Rooms -{" "}
                      <span className="text-khaki">
                        0
                        {bookingsData && bookingsData.room
                          ? bookingsData.room
                          : "1"}
                      </span>{" "}
                    </p>
                  </div>
                </div>
              </div>

              <div className="py-5">
                <button
                  className="bg-khaki w-full h-10 2xl:h-[50px] text-white font-Lora font-semibold px-5 hover-animBg after:rounded-none after:bg-normalBlack"
                  onClick={() => setAlert()}
                >
                  Confirm Booking
                </button>
              </div>
            </div>

            {/* Price Display */}
            <div
              className="mt-3 sm:mt-4 md:mt-5 lg:mt-6 bg-whiteSmoke dark:bg-normalBlack px-7 py-8"
              data-aos="zoom-in-up"
              data-aos-duration="1000"
            >
              <h4 className="font-Garamond text-xl sm:text-[22px] md:text-2xl xl:text-3xl leading-7 md:leading-8 lg:leading-10 text-lightBlack dark:text-white font-semibold mb-4">
                Price
              </h4>
              <div className="flex items-center justify-between">
                <span className="text-sm lg:text-base text-gray dark:text-lightGray font-Lora">Per Night</span>
                <span className="text-2xl font-Garamond text-khaki font-semibold">₹{roomData.base_price}</span>
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
