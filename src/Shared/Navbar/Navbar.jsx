import { Link, NavLink, useNavigate } from "react-router-dom";
import useScrollPosition from "./useScrollPosition";
import { FaBars } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { BiChevronDown, BiSun } from "react-icons/bi";
import { IoMoonSharp } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useBookingModal } from "../../Context/BookingModalContext";
import UserProfileDropdown from "../../Components/UserProfileDropdown/UserProfileDropdown";
import { useAuth } from "../../Context/AuthContext";
import Swal from "sweetalert2";

const Navbar = () => {
  // modal openar
  const [isOpen, setIsOpen] = useState(false);
  // dark mode toggle bar
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  // scrolling tracker
  const scrollPosition = useScrollPosition();
  // background color add and remover
  const navbarBgColor =
    scrollPosition > 100 ? "lg:bg-lightBlack" : "lg:bg-transparent";

  // Booking modal
  const { openBookingModal } = useBookingModal();

  // Auth and navigation
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Handle booking button click - requires authentication
const handleBookingClick = () => {
  // Open the booking modal directly for everyone
  openBookingModal();
  setIsOpen(false); // Close mobile menu if open

  // If the user is not logged in, prompt them to log in (optional)
  if (!isAuthenticated) {
    Swal.fire({
      title: "You are not logged in",
      text: "You can proceed without logging in, or login to access additional features.",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#006938",
      cancelButtonColor: "#c49e72",
      confirmButtonText: "Login",
      cancelButtonText: "Proceed without Login",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/login");
      }
    });
  }
};


  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const handleClick = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <nav
      className={` w-full lg:fixed font-Lora z-10  lg:px-5 lg:py-2  transition-all duration-300 ${navbarBgColor} `}
    >
      <div className="lg:px-10" style={{ backgroundColor: '#c29d6d' }}>
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* website Logo */}
          <div className=" w-48 lg:w-52 lg:p-4 ">
            <Link to="/">
              <img
                src="/images/home-3/berlinlogo01.png"
                className="hidden lg:block w-full"
                alt="website_logo"
              />
            </Link>
          </div>
          {/* small screen size */}
         {/* small screen size */}
<div className="px-3 w-full lg:hidden flex justify-between items-center bg-khaki h-[70px] text-white p-3">
  {/* Logo */}
  <div className="w-28">
    <Link to="/">
      <img
        src="/images/home-3/berlinlogo01.png"
        className="block lg:hidden"
        alt="Berlin_website_logo"
      />
    </Link>
  </div>

  {/* Booking + icons */}
  <div className="flex items-center gap-2">
    {/* Booking Online FIRST */}
    <button
      onClick={handleBookingClick}
      className="text-[10px] xs:text-xs px-3 py-1 border border-white rounded-sm uppercase tracking-[0.08em] font-Garamond"
    >
      Booking Online
    </button>

    {/* Dark / Light */}
    <span onClick={handleClick} className="cursor-pointer">
      {isDarkMode ? (
        <BiSun
          className="text-white"
          title="Apply Light Mode"
          size={20}
        />
      ) : (
        <IoMoonSharp
          size={20}
          className="text-white"
          title="Apply Dark Mode"
        />
      )}
    </span>

    {/* User Profile / Login */}
    <UserProfileDropdown size={20} />

    {/* Menu (hamburger) */}
    <button
      className="lg:hidden block focus:outline-none"
      onClick={toggleNavbar}>
       {isOpen ? (
        <IoMdClose className="w-6 h-6 text-white" />
       ) : (
         <FaBars className="w-5 h-5 text-white" />
         )}
         </button>
         </div>
         </div>
          {/* All navLink are hear with active */}
          <ul
            className={`${
              isOpen ? "block" : "hidden"
            } text-left w-full lg:w-fit  ease-in-out lg:flex space-y-2 lg:space-y-0 lg:text-center space-x-0 lg:space-x-3 xl:space-x-4 2xl:space-x-5 3xl:space-x-[24px] flex flex-col lg:flex-row text-sm text-lightBlack lg:text-white dark:text-white uppercase font-normal bg-white dark:bg-normalBlack lg:bg-transparent dark:lg:bg-transparent py-3 lg:py-0 `}
          >
            <NavLink
              className={`${({ isActive, isPending }) =>
                isPending
                  ? "pending"
                  : isActive
                  ? "active"
                  : ""} text-lightBlack lg:text-white dark:text-white  lg:border-b-0 px-3 py-2 w-full block transition-all duration-300 group relative`}
              to="/"
            >
              <span className="flex items-center">
                Home
                {/* <BiChevronDown className="ml-1" /> */}
              </span>
              {/* <div className="absolute pt-5 lg:pt-8 z-20"> */}
                {/* <ul className="shadow-2xl hidden group-hover:block rounded-sm bg-white text-black w-[200px] text-left dark:bg-normalBlack dark:text-white transition-all duration-500 text-sm py-4 ">
                  <div className=" px-5 group hover:bg-khaki hover:text-white">
                    <li className="hover:ml-3 duration-300  ">
                      <NavLink to="/" className="py-2 block">
                        Hotel Booking
                      </NavLink>
                    </li>
                  </div>
                  <div className=" px-5 group hover:bg-khaki hover:text-white">
                    <li className="hover:ml-3 duration-300  ">
                      <NavLink to="/home2" className="py-2 block">
                        Resort
                      </NavLink>
                    </li>
                  </div>

                  <div className=" px-5 group hover:bg-khaki hover:text-white">
                    <li className="hover:ml-3 duration-300  ">
                      <NavLink to="/home3" className="py-2 block">
                        Hostel
                      </NavLink>
                    </li>
                  </div>

                  <div className=" px-5 group hover:bg-khaki hover:text-white">
                    <li className="hover:ml-3 duration-300  ">
                      <NavLink to="/home4" className="py-2 block">
                        City Hotel
                      </NavLink>
                    </li>
                  </div>

                  <div className=" px-5 group hover:bg-khaki hover:text-white">
                    <li className="hover:ml-3 duration-300  ">
                      <NavLink to="/home5" className="py-2 block">
                        Apartment
                      </NavLink>
                    </li>
                  </div>
                </ul> */}
              {/* </div> */}
            </NavLink>
            <NavLink
              className={`${({ isActive, isPending }) =>
                isPending
                  ? "pending"
                  : isActive
                  ? "active"
                  : ""} text-lightBlack lg:text-white dark:text-white  lg:border-b-0 px-3 py-2 w-full block transition-all duration-300`}
              to="/about"
            >
              About
            </NavLink>
           <NavLink
              className={`${({ isActive, isPending }) =>
                isPending
                  ? "pending"
                  : isActive
                  ? "active"
                  : ""} text-lightBlack lg:text-white dark:text-white  lg:border-b-0 px-3 py-2 w-full block transition-all duration-300`}
              to="/find_room"
            >
              Rooms
            </NavLink>
            <NavLink
              className={`${({ isActive, isPending }) =>
                isPending
                  ? "pending"
                  : isActive
                  ? "active"
                  : ""} text-lightBlack lg:text-white dark:text-white  lg:border-b-0 px-3 py-2 w-full block transition-all duration-300 group relative `}
              to="/services"
            >
              <span className="flex items-center">
                Services
                {/* <BiChevronDown className="ml-1" /> */}
              </span>
              {/* <div className="absolute pt-5 lg:pt-8 z-20">
                <ul className="shadow-2xl hidden group-hover:block rounded-sm bg-white text-black w-[200px] text-left dark:bg-normalBlack dark:text-white transition-all duration-500 text-sm py-4 ">
                  <div className=" px-5 group hover:bg-khaki hover:text-white">
                    <li className="hover:ml-3 duration-300  ">
                      <NavLink to="/about" className="py-2 block">
                        ABOUT US
                      </NavLink>
                    </li>
                  </div>
                  <div className=" px-5 group hover:bg-khaki hover:text-white">
                    <li className="hover:ml-3 duration-300  ">
                      <NavLink to="/services" className="py-2 block">
                        SERVICE
                      </NavLink>
                    </li>
                  </div>
                  <div className=" px-5 group hover:bg-khaki hover:text-white">
                    <li className="hover:ml-3 duration-300  ">
                      <NavLink to="/service_details" className="py-2 block">
                        SERVICE DETAILS
                      </NavLink>
                    </li>
                  </div>
                  <div className=" px-5 group hover:bg-khaki hover:text-white">
                    <li className="hover:ml-3 duration-300  ">
                      <NavLink to="/our_team" className="py-2 block">
                        OUR TEAM
                      </NavLink>
                    </li>
                  </div>
                  <div className=" px-5 group hover:bg-khaki hover:text-white">
                    <li className="hover:ml-3 duration-300  ">
                      <NavLink to="/pricing" className="py-2 block">
                        PRICING
                      </NavLink>
                    </li>
                  </div>
                </ul>
              </div> */}
            </NavLink>
            {/* blog sub menu link */}
             <NavLink
              className={`${({ isActive, isPending }) =>
                isPending
                  ? "pending"
                  : isActive
                  ? "active"
                  : ""} text-lightBlack lg:text-white dark:text-white  lg:border-b-0 px-3 py-2 w-full block transition-all duration-300`}
              to="/blog"
            >
              Blog
            </NavLink>
            <NavLink
              className={`${({ isActive, isPending }) =>
                isPending
                  ? "pending"
                  : isActive
                  ? "active"
                  : ""} text-lightBlack lg:text-white dark:text-white lg:border-b-0 px-3 py-2 w-full block transition-all duration-300`}
              to="/contact"
            >
              Contact
            </NavLink>
          </ul>

          {/* large device visible button and search icon */}
          <div className="hidden lg:flex items-center">
            <span onClick={handleClick} className="mr-3 cursor-pointer group ">
              {isDarkMode ? (
                <BiSun
                  className="text-white group-hover:rotate-90 rotate transition-all duration-300"
                  title="Apply Light Mode"
                  size={35}
                />
              ) : (
                <IoMoonSharp
                  className="text-white group-hover:rotate-[360deg] transition-all duration-300"
                  title="Apply Dark Mode"
                  size={35}
                />
              )}
            </span>
            <button onClick={handleBookingClick} className="btn-secondary">
              Booking Online
            </button>
            <div className="ml-3">
              {isAuthenticated ? (
  <UserProfileDropdown size={20} />
   ) : (
   <Link to="/login" className="text-white">
    Login
   </Link>
   )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
