import BreadCrumb from "../../BreadCrumb/BreadCrumb";
import {
  BsArrowRight,
  BsChevronLeft,
  BsChevronRight,
  BsPlay,
  BsTwitter,
} from "react-icons/bs";
import { FaFacebookF, FaLinkedinIn, FaPinterestP } from "react-icons/fa6";
import { useState, useRef } from "react";
import { FaStar } from "react-icons/fa";
import "../../Components4/Testimonial/testimonials.css";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { Link } from "react-router-dom";
import FsLightbox from "fslightbox-react";
import { motion, useMotionValue, useTransform } from "framer-motion";

/* ========= 3D Tilt Image (Framer Motion) ========= */
function TiltImage({ src, alt = "", className = "" }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // mouse delta -> rotation
  const rotateX = useTransform(y, [-60, 0, 60], [8, 0, -8]);
  const rotateY = useTransform(x, [-60, 0, 60], [-8, 0, 8]);

  function handleMouseMove(e) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const midX = rect.left + rect.width / 2;
    const midY = rect.top + rect.height / 2;
    x.set(e.clientX - midX);
    y.set(e.clientY - midY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <div className={`[perspective:1000px] ${className}`}>
      <motion.div
        ref={ref}
        className="relative rounded-xl overflow-hidden cursor-pointer will-change-transform"
        style={{ rotateX, rotateY }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.03, boxShadow: "0 18px 45px rgba(0,0,0,0.25)" }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover select-none"
          draggable={false}
        />
        {/* Optional soft overlay on hover */}
        <div className="pointer-events-none absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-300 hover:opacity-100" />
      </motion.div>
    </div>
  );
}

const About = () => {
  const [setCurrentSlide] = useState(0);
  const [toggler, setToggler] = useState(false);

  // Testimonials slider
  const [sliderRef] = useKeenSlider({
    breakpoints: {
      "(min-width: 320px)": { slides: { perView: 1, spacing: 20 } },
      "(min-width:768px)": { slides: { perView: 2, spacing: 20 } },
      "(min-width:992px)": { slides: { perView: 3, spacing: 20 } },
    },
    loop: true,
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {},
  });

  // Latest Blog slider
  const [blogSliderRef] = useKeenSlider({
    breakpoints: {
      "(min-width: 320px)": { slides: { perView: 1, spacing: 20 } },
      "(min-width:768px)": { slides: { perView: 2, spacing: 20 } },
      "(min-width:992px)": { slides: { perView: 3, spacing: 20 } },
    },
    loop: false,
    initial: 0,
  });

  return (
    <section className="">
      <BreadCrumb title="About Us" home={""} />

      {/* about content */}
      <section className="dark:bg-mediumBlack">
        <div className="Container py-20 2xl:py-[120px] sm:overflow-hidden lg:overflow-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            {/* image with 3D tilt */}
            <div
              className="flex-1"
              data-aos="zoom-in-up"
              data-aos-duration="1000"
            >
              <TiltImage
                src="/images/inner/about_thumb.png"
                alt="About - Berlin Holidays"
              />
            </div>

            {/* text */}
            <div
              className="mt-10 md:mt-0 md:ml-10 lg:ml-[90px] 2xl:ml-[100px] font-Garamond space-y-3 xl:space-y-4 flex-1"
              data-aos="zoom-in-down"
              data-aos-duration="1000"
            >
              <h5 className="text-base text-khaki leading-[26px] font-medium">
                LUXURY RESORT AND RETREAT
              </h5>
              <h1 className="text-[22px] sm:text-2xl md:text-[21px]  xl:text-3xl 2xl:text-[38px] leading-6 md:leading-7 lg:leading-[30px] 2xl:leading-[44px] text-lightBlack dark:text-white font-semibold my-4">
                ESCAPE. INDULGE. EXPERIENCE
              </h1>
              <p className="text-sm xl:text-base md:text-sm lg:text-base font-Lora text-gray dark:text-lightGray font-normal leading-[26px]">
                Discover the art of relaxation at Berlin Holidays,
                where every stay is designed to redefine comfort and
                luxury. Nestled amidst serene landscapes, our resort
                combines modern elegance with warm hospitality — offering
                the perfect destination for families, couples, and solo
                travelers alike.
              </p>

              <p className="text-sm sm:text-base font-Lora text-gray dark:text-lightGray font-normal leading-[26px] mt-5">
                From world-class accommodations and fine dining to
                rejuvenating spa treatments and adventure experiences,
                every moment here is curated to inspire and delight.
              </p>

              <div className="bg-whiteSmoke dark:bg-lightBlack px-[30px] py-5">
                <p className="text-sm sm:text-base leading-10 3xl:leading-[50px] text-lightBlack dark:text-white font-medium font-Lora ">
                  Berlin Holidays Resort Wayanad
                </p>
                <p className="text-sm sm:text-base leading-10  text-lightBlack dark:text-white font-medium font-Lora ">
                  Kerala India
                </p>
              </div>
              <Link to="/services">
                <button className="btn-primary mt-[30px]">MORE ABOUT</button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* best hotel manager / video */}
      <div className="bg-lightBlack -z-[1] py-20 2xl:py-[120px]">
        <div className="Container ">
          <div className=" w-full grid grid-cols-1 lg:grid-cols-2 items-center ">
            <div
              className="flex-1 h-[100%] w-full relative "
              data-aos="zoom-in-up"
              data-aos-duration="1000"
            >
              <div className="flex-1 h-[100%] w-full relative ">
                <img
                  src="/images/home-1/aboutvideothump.png"
                  className="h-full w-full md:h-[80%] lg:h-full object-cover"
                  alt=""
                />

                <div
                  className="w-[70px] h-[70px]  text-white absolute top-1/2 md:top-[35%] lg:top-1/2 left-[45%] bg-khaki rounded-full flex items-center justify-center cursor-pointer z-[1] "
                  onClick={() => setToggler(!toggler)}
                >
                  <BsPlay className="w-8 h-8" />
                </div>
                <span className=" top-[47%] md:top-[33%] lg:top-[48%] left-[42%] lg:left-[43.5%] border w-[90px] h-[90px] rounded-full absolute border-white video-animation"></span>
              </div>
              <FsLightbox
                toggler={toggler}
                sources={["https://youtu.be/fFDyoI73viQ?si=GbDzAagjoa_0Nv2x"]}
              />
            </div>
            <div
              className="bg-[#f8f6f3] dark:bg-normalBlack space-y-5 flex-1 font-Garamond px-5 sm:px-7 md:px-9 lg:pl-[70px] py-10 md:py-[96px] lg:pr-[70px]"
              data-aos="zoom-in-up"
              data-aos-duration="1000"
            >
              <h5 className="text-base text-khaki leading-[26px] font-semibold">
                BERLIN GROUP
              </h5>
              <h1 className="text-[22px] sm:text-2xl md:text-[28px] xl:text-[32px] 2xl:text-[38px] leading-[38px] lg:leading-[44px] text-lightBlack dark:text-white font-semibold">
                WHERE HOSPITALITY MEETS PERFECTION
              </h1>
              <p className="text-sm sm:text-base font-Lora text-gray dark:text-lightGray font-normal leading-[26px]">
                We believe every guest deserves a seamless blend
                of comfort, elegance, and personalized care. From
                the moment you arrive, our dedicated team ensures
                your stay is filled with warmth, tranquility, and
                memorable experiences.
              </p>
              <p className="text-sm sm:text-base font-Lora italic leading-[26px] underline  text-gray dark:text-lightGray font-normal ">
                “ Luxury is not just about comfort — it’s about feeling at home,
                even when you’re far away. ”
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== MEET THE EXPERT MEMBERS (RESTORED) ===================== */}
      <div className="dark:bg-normalBlack pt-8 pb-20 md:pt-10 lg:pt-12 2xl:pt-[60px] 2xl:pb-[120px]">
        <div className="Container">
          {/* section header */}
          <div
            className="text-center sm:px-8 md:px-[80px] lg:px-[120px] xl:px-[200px] 2xl:px-[335px] mx-auto px-5 Container"
            data-aos="fade-up"
            data-aos-duration="1000"
          >
            {/* Section logo */}
            <div className="flex items-center justify-center space-x-2">
              <hr className="w-[100px] h-[1px] bg-lightGray dark:bg-gray text-lightGray dark:text-gray" />
              <img
                src="/images/home-1/sectiondivider01.png"
                alt="room_section_logo"
                className="w-[50px] h-[50px]"
              />
              <hr className="w-[100px] h-[1px] bg-lightGray dark:bg-gray text-lightGray dark:text-gray" />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl 2xl:text-[38px] leading-[42px] 2xl:leading-[52px] text-lightBlack dark:text-white mt-[10px] mb-[14px] font-Garamond font-semibold uppercase">
              MEET THE EXPERT MEMBERS
            </h1>
            <p className="font-Lora leading-7 lg:leading-[26px] text-lightGray font-normal text-sm sm:text-base">
              Every guest is cared for by passionate professionals
              dedicated to making your stay exceptional. From expert
              chefs and wellness specialists to attentive concierge and
              event planners, each member of our team brings years of
              experience and a genuine commitment to hospitality
            </p>
          </div>

          {/* Section Content */}
          <div className="mt-[60px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px] ">
            {/* Member one */}
            <div
              className="member group"
              data-aos="fade-up"
              data-aos-duration="1000"
            >
              <img src="/images/inner/member-1.jpg" className="w-full" alt="" />
              <div className="relative">
                <div className="px-4  lg:px-[30px] pt-5 ">
                  <h3 className="text-xl sm:text-2xl lg:text-2xl xl:text-[28px] leading-7 md:leading-8 lg:leading-10 text-lightBlack dark:text-white font-semibold font-Garamond text-center hover:opacity-0">
                    Anoop Krishnan
                  </h3>
                  <p className="text-sm md:text-base leading-[26px] text-Gray dark:text-lightGray font-normal font-Lora text-center group-hover:text-white dark:hover:text-white hover:opacity-0">
                    Resort Manager
                  </p>
                </div>
                <div
                  className="p-[30px] bg-khaki grid items-center justify-center absolute bottom-[-150px] sm:bottom-[-170px] md:bottom-[-150px] group-hover:bottom-[-38px] lg:group-hover:bottom-[-30px] transition-all
                 duration-500 left-0 right-0"
                >
                  {/* Socials (optional)
                  <div className="flex items-center justify-center space-x-4 text-white">
                    <FaFacebookF />
                    <BsTwitter />
                    <FaLinkedinIn />
                    <FaPinterestP />
                  </div> */}
                  <p className="text-white font-medium leading-10 text-xl lg:text-[22px] font-Garamond">
                    anoopberlin@gmail.com
                  </p>
                </div>
              </div>
            </div>

            {/* Member two */}
            <div
              className="member group"
              data-aos="fade-down"
              data-aos-duration="1000"
            >
              <img src="/images/inner/member-2.jpg" className="w-full" alt="" />
              <div className="relative">
                <div className="px-4  lg:px-[30px] pt-5 ">
                  <h3 className="text-xl sm:text-2xl lg:text-2xl xl:text-[28px] leading-7 md:leading-8 lg:leading-10 text-lightBlack dark:text-white font-semibold font-Garamond text-center hover:opacity-0">
                    Neha Suresh
                  </h3>
                  <p className="text-sm md:text-base leading-[26px] text-Gray dark:text-lightGray font-normal font-Lora text-center group-hover:text-white dark:hover:text-white hover:opacity-0">
                    Executive Chef
                  </p>
                </div>
                <div
                  className="p-[30px] bg-khaki grid items-center justify-center absolute bottom-[-150px] sm:bottom-[-170px] md:bottom-[-150px] group-hover:bottom-[-38px] lg:group-hover:bottom-[-30px] transition-all
                 duration-500 left-0 right-0"
                >
                  <p className="text-white font-medium leading-10 text-xl lg:text-[22px] font-Garamond">
                    nexaberlin@gmail.com
                  </p>
                </div>
              </div>
            </div>

            {/* Member three */}
            <div
              className="member group"
              data-aos="fade-up"
              data-aos-duration="1000"
            >
              <img src="/images/inner/member-3.jpg" className="w-full" alt="" />
              <div className="relative">
                <div className="px-4  lg:px-[30px] pt-5 ">
                  <h3 className="text-xl sm:text-2xl lg:text-2xl xl:text-[28px] leading-7 md:leading-8 lg:leading-10 text-lightBlack dark:text-white font-semibold font-Garamond text-center hover:opacity-0">
                    Rajeev Menon
                  </h3>
                  <p className="text-sm md:text-base leading-[26px] text-Gray dark:text-lightGray font-normal font-Lora text-center group-hover:text-white dark:hover:text-white hover:opacity-0">
                    Wellness & Spa Director
                  </p>
                </div>
                <div
                  className="p-[30px] bg-khaki grid items-center justify-center absolute bottom-[-150px] sm:bottom-[-170px] md:bottom-[-150px] group-hover:bottom-[-38px] lg:group-hover:bottom-[-30px] transition-all
                 duration-500 left-0 right-0"
                >
                  <p className="text-white font-medium leading-10 text-xl lg:text-[22px] font-Garamond">
                    rajeevberlin@gmail.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clients Feedback */}
      <section className="bg-[#f8f6f3] dark:bg-lightBlack py-20 lg:py-[50px]">
        <div className="Container">
          {/* Section heading */}
          <div
            className="flex items-start justify-between relative "
            data-aos="fade-up"
            data-aos-duration="1000"
          >
            <div className="space-y-3 md:w-[450px] xl:w-[550px] font-Garamond">
              <h5 className="text-base text-khaki leading-[26px] font-medium">
                CUSTOMER'S TESTIMONIALS
              </h5>
              <h1 className="text-[22px] sm:text-3xl 2xl:text-[38px] leading-6 md:leading-[38px] lg:leading-[44px] text-lightBlack dark:text-white font-semibold uppercase">
                Feedback From Our Guests
              </h1>
            </div>
            <div className="hidden sm:flex items-center lg:space-x-5  space-x-3 ">
              <button className="lg:w-[50px] w-[30px] h-[30px] lg:h-[50px]  flex items-center justify-center border-[1px] border-[#cccbc8] text-[#cccbc8] hover:bg-khaki hover:border-none group">
                <BsChevronLeft className="w-5 h-5 text-[#cccbc8] group-hover:text-white " />
              </button>
              <button
                className="lg:w-[50px] w-[30px] h-[30px] lg:h-[50px]  flex items-center justify-center border-[1px] border-[#cccbc8] text-[#cccbc8] hover:bg-khaki
             hover:border-none group"
              >
                <BsChevronRight className="w-5 h-5 text-[#cccbc8]  group-hover:text-white" />
              </button>
            </div>
          </div>
          <hr className="w-full h-[2px] text-[#e8e8e8] dark:text-[#383838]  mt-10 " />

          {/* Clients Feedback  */}
          <div
            className="relative"
            data-aos="zoom-in-up"
            data-aos-duration="1000"
          >
            <div className="mt-[60px] keen-slider " ref={sliderRef}>
              {/* slide - 1 */}
              <div className="keen-slider__slide number-slide1 group ">
                <div className="bg-white dark:bg-normalBlack group-hover:bg-khaki dark:hover:bg-khaki transition-all ease-in-out duration-500 p-[30px] relative before:absolute before:w-6 before:h-6 before:bg-white before:group-hover:bg-khaki  dark:before:bg-normalBlack before:rotate-45 before:left-[37px] before:-bottom-[13px] ">
                  <span className="flex items-center space-x-[5px] md:space-x-2 xl:space-x-3">
                    <FaStar className="text-khaki group-hover:text-white" size={18} />
                    <FaStar className="text-khaki group-hover:text-white" size={18} />
                    <FaStar className="text-khaki group-hover:text-white" size={18} />
                    <FaStar className="text-khaki group-hover:text-white" size={18} />
                    <FaStar className="text-khaki group-hover:text-white" size={18} />
                  </span>
                  <p className="font-Lora text-sm lg:text-base leading-[26px] text-gray dark:text-lightGray group-hover:text-white  font-normal mt-7 ">
                    TOur stay at the resort was pure bliss! The staff
                    went above and beyond to make us feel at home.
                    The view from our villa, surrounded by misty
                    hills and coffee plantations, was breathtaking.
                    Truly the best escape from city life.
                  </p>
                </div>
                <div className="flex items-center mt-10 lg:mt-[51px]">
                  <div className="ml-5 md:ml-6">
                    <h4 className="text-lg sm:text-xl md:text-2xl leading-[28px] text-[#041341] dark:text-white font-medium font-Garamond ">
                      Meera R
                    </h4>
                    <p className="text-sm sm:text-base leading-7 font-Lora font-normal text-gray dark:text-lightGray ">
                      Bengaluru
                    </p>
                  </div>
                </div>
              </div>

              {/* slide - 2 */}
              <div className="keen-slider__slide number-slide1 group ">
                <div className="bg-white dark:bg-normalBlack group-hover:bg-khaki dark:hover:bg-khaki transition-all ease-in-out duration-500 p-[30px] relative before:absolute before:w-6 before:h-6 before:bg-white before:group-hover:bg-khaki  dark:before:bg-normalBlack before:rotate-45 before:left-[37px] before:-bottom-[13px] ">
                  <span className="flex items-center space-x-[5px] md:space-x-2 xl:space-x-3">
                    <FaStar className="text-khaki group-hover:text-white" size={18} />
                    <FaStar className="text-khaki group-hover:text-white" size={18} />
                    <FaStar className="text-khaki group-hover:text-white" size={18} />
                    <FaStar className="text-khaki group-hover:text-white" size={18} />
                    <FaStar className="text-khaki group-hover:text-white" size={18} />
                  </span>
                  <p className="font-Lora text-sm lg:text-base leading-[26px] text-gray dark:text-lightGray group-hover:text-white  font-normal mt-7 ">
                    A perfect romantic getaway! The candlelight dinner
                    by the pool and the soothing spa session made our
                    anniversary unforgettable. The team’s attention
                    to detail and warmth made us feel truly special
                  </p>
                </div>
                <div className="flex items-center mt-10 lg:mt-[51px]">
                  <div className="ml-5 md:ml-6">
                    <h4 className="text-lg sm:text-xl md:text-2xl leading-[28px] text-[#041341] dark:text-white font-medium font-Garamond ">
                      Arjun & Priya
                    </h4>
                    <p className="text-sm sm:text-base leading-7 font-Lora font-normal text-gray dark:text-lightGray ">
                      Kochi
                    </p>
                  </div>
                </div>
              </div>

              {/* slide - 3 */}
              <div className="keen-slider__slide number-slide1 group ">
                <div className="bg-white dark:bg-normalBlack group-hover:bg-khaki dark:hover:bg-khaki transition-all ease-in-out duration-500 p-[30px] relative before:absolute before:w-6 before:h-6 before:bg-white before:group-hover:bg-khaki  dark:before:bg-normalBlack before:rotate-45 before:left-[37px] before:-bottom-[13px] ">
                  <span className="flex items-center space-x-[5px] md:space-x-2 xl:space-x-3">
                    <FaStar className="text-khaki group-hover:text-white" size={18} />
                    <FaStar className="text-khaki group-hover:text-white" size={18} />
                    <FaStar className="text-khaki group-hover:text-white" size={18} />
                    <FaStar className="text-khaki group-hover:text-white" size={18} />
                    <FaStar className="text-khaki group-hover:text-white" size={18} />
                  </span>
                  <p className="font-Lora text-sm lg:text-base leading-[26px] text-gray dark:text-lightGray group-hover:text-white  font-normal mt-7 ">
                    One of the most peaceful resorts I’ve ever visited.
                    The rooms were luxurious yet in harmony with nature.
                    The food, especially the Kerala-style breakfast, was
                    delicious. I’ll definitely be coming back with my family.
                  </p>
                </div>
                <div className="flex items-center mt-10 lg:mt-[51px]">
                  <div className="ml-5 md:ml-6">
                    <h4 className="text-lg sm:text-xl md:text-2xl leading-[28px] text-[#041341] dark:text-white font-medium font-Garamond ">
                      Thomas George
                    </h4>
                    <p className="text-sm sm:text-base leading-7 font-Lora font-normal text-gray dark:text-lightGray ">
                      Chennai
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Blog */}
      <div className="dark:bg-normalBlack">
        <section className="Container py-20 lg:py-[120px]">
          {/* Header */}
          <div
            className="text-center mx-auto px-5 sm:px-8 md:px-[80px] lg:px-[120px] xl:px-[200px] 2xl:px-[335px]"
            data-aos="fade-up"
            data-aos-duration="1000"
          >
            <div className="flex items-center justify-center space-x-2 mb-4">
              <hr className="w-[100px] h-[1px] text-[#dedbd4] dark:text-[#3b3b3b]" />
              <img
                src="/images/home-1/sectiondivider01.png"
                alt="section divider"
                className="w-[50px] h-[50px]"
                draggable={false}
              />
              <hr className="w-[100px] h-[1px] text-[#dedbd4] dark:text-[#3b3b3b]" />
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl 2xl:text-[38px] leading-[44px] lg:leading-[52px] text-lightBlack dark:text-white font-Garamond font-semibold uppercase mb-[8px]">
              LATEST POST FROM BLOG
            </h1>
            <p className="font-Lora leading-[26px] text-gray dark:text-lightGray font-normal text-sm sm:text-base">
              Stay inspired with travel stories, destination guides, and insider tips that make every journey unforgettable.
            </p>
          </div>

          {/* Slider */}
          <div className="relative">
            <div className="mt-14 2xl:mt-[60px] keen-slider" ref={blogSliderRef}>
              {/* Slide 1 */}
              <div className="keen-slider__slide number-slide1">
                <Link
                  to="/blog"
                  className="block overflow-hidden 3xl:w-[410px] group relative z-10 pointer-events-auto"
                  onClickCapture={(e) => e.stopPropagation()}
                >
                  <div className="relative">
                    <img
                      src="/images/home-1/blog1img.png"
                      className="w-full h-full object-cover"
                      alt="Top 5 Luxury Resorts in India for Your Next Getaway"
                      draggable={false}
                    />
                  </div>
                  <div className="font-Garamond border border-[#e8e8e8] dark:border-[#424242] border-t-0 bg-white dark:bg-normalBlack">
                    <div className="py-6 px-[30px] lg:px-5 xl:px-[25px]">
                      <h2 className="text-xl sm:text-[22px] xl:text-2xl 2xl:text-[26px] leading-[34px] font-semibold text-lightBlack dark:text-white py-2 sm:py-3 md:py-4 hover:underline underline-offset-2">
                        Top 5 Luxury Resorts in India for Your Next Getaway
                      </h2>
                    </div>
                    <div className="border-t border-[#e8e8e8] dark:border-[#424242] py-2 lg:py-3">
                      <div className="px-[30px] flex items-center justify-between ">
                        <span className="text-sm sm:text-base leading-[38px] uppercase text-lightBlack dark:text-white font-medium group-hover:text-khaki hover:underline underline-offset-1">
                          Read More
                        </span>
                        <BsArrowRight className="text-gray dark:text-lightGray group-hover:text-khaki" size={24} />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Slide 2 */}
              <div className="keen-slider__slide number-slide1">
                <Link
                  to="/blog"
                  className="block overflow-hidden 3xl:w-[410px] group relative z-10 pointer-events-auto"
                  onClickCapture={(e) => e.stopPropagation()}
                >
                  <div className="relative">
                    <img
                      src="/images/home-1/blog2img.png"
                      className="w-full h-full object-cover"
                      alt="A Taste of Luxury: Fine Dining Experiences You Can’t Miss"
                      draggable={false}
                    />
                  </div>
                  <div className="font-Garamond border border-[#e8e8e8] dark:border-[#424242] border-t-0 bg-white dark:bg-normalBlack">
                    <div className="py-6 px-[30px] lg:px-5 xl:px-[25px]">
                      <h2 className="text-xl sm:text-[22px] xl:text-2xl 2xl:text-[26px] leading-[34px] font-semibold text-lightBlack dark:text-white py-2 sm:py-3 md:py-4 hover:underline underline-offset-2">
                        A Taste of Luxury: Fine Dining Experiences You Can’t Miss
                      </h2>
                    </div>
                    <div className="border-t border-[#e8e8e8] dark:border-[#424242] py-2 lg:py-3">
                      <div className="px-[30px] flex items-center justify-between ">
                        <span className="text-sm sm:text-base leading-[38px] uppercase text-lightBlack dark:text-white font-medium group-hover:text-khaki hover:underline underline-offset-1">
                          Read More
                        </span>
                        <BsArrowRight className="text-gray dark:text-lightGray group-hover:text-khaki" size={24} />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Slide 3 */}
              <div className="keen-slider__slide number-slide1">
                <Link
                  to="/blog"
                  className="block overflow-hidden 3xl:w-[410px] group relative z-10 pointer-events-auto"
                  onClickCapture={(e) => e.stopPropagation()}
                >
                  <div className="relative">
                    <img
                      src="/images/home-1/blog3img.png"
                      className="w-full h-full object-cover"
                      alt="Wellness Retreats: Reconnect, Relax, and Recharge"
                      draggable={false}
                    />
                  </div>
                  <div className="font-Garamond border border-[#e8e8e8] dark:border-[#424242] border-t-0 bg-white dark:bg-normalBlack">
                    <div className="py-6 px-[30px] lg:px-5 xl:px-[25px]">
                      <h2 className="text-xl sm:text-[22px] xl:text-2xl 2xl:text-[26px] leading-[34px] font-semibold text-lightBlack dark:text-white py-2 sm:py-3 md:py-4 hover:underline underline-offset-2">
                        Wellness Retreats: Reconnect, Relax, and Recharge
                      </h2>
                    </div>
                    <div className="border-t border-[#e8e8e8] dark:border-[#424242] py-2 lg:py-3">
                      <div className="px-[30px] flex items-center justify-between ">
                        <span className="text-sm sm:text-base leading-[38px] uppercase text-lightBlack dark:text-white font-medium group-hover:text-khaki hover:underline underline-offset-1">
                          Read More
                        </span>
                        <BsArrowRight className="text-gray dark:text-lightGray group-hover:text-khaki" size={24} />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default About;
