import { HiArrowLongRight } from "react-icons/hi2";
import { Link } from "react-router-dom";

const Facilities = () => {
  return (
    <div className="dark:bg-mediumBlack ">
      <section className="Container py-[120px] md:py-0 md:pb-[120px] lg:py-[60px]">
        {/* section title and button */}
        <div
          className="flex flex-col md:flex-row md:items-center justify-between mb-12 px-3 sm:px-5"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          <div className="md:w-[450px] font-Garamond">
            <h5 className="text-base text-khaki leading-[26px] font-medium mb-[14px]">
              FACILITIES
            </h5>
            <h1 className="text-[22px] sm:text-2xl md:text-3xl 2xl:text-[38px] leading-[38px] lg:leading-[44px] text-lightBlack dark:text-white font-semibold">
              ENJOY COMPLETE & BEST QUALITY FACILITIES
            </h1>
          </div>
          <div className="mt-5 md:mt-0">
            <Link to="/services">
              <button className="btn-items">view more item</button>
            </Link>
          </div>
        </div>

        {/* ================== SERVICES ================== */}
        <div>
          {/* 01 */}
          <hr className="text-[#e8e8e8] dark:text-[#383838] my-10" />
          <div
            className="grid grid-cols-1 md:grid-cols-2"
            data-aos="zoom-in-up"
            data-aos-duration="1000"
          >
            <div className="relative w-full md:pr-[30px]">
              <img
                src="/images/home-1/gymwellness.png"
                alt="Gym & Wellness"
                className="w-full h-full"
              />
              <div className="hidden md:block absolute -top-[0px] md:-right-[12%] -right-[7%]">
                <h2 className="text-3xl md:text-4xl lg:text-[40px] text-khaki">01</h2>
              </div>
            </div>

            <div className="relative font-Garamond md:ml-[60px] lg:ml-[107px] mt-3 md:mt-0">
              <h4 className="text-base font-semibold text-khaki uppercase pb-[6px]">
                Fitness
              </h4>
              <h1 className="text-2xl md:text-3xl font-semibold text-lightBlack dark:text-white">
                <Link to="/services">Gym & Wellness Center</Link>
              </h1>
              <p className="font-Lora text-sm sm:text-base text-gray dark:text-lightGray leading-[26px] my-10">
                Stay energized during your vacation with our
                state-of-the-art fitness studio. Equipped with
                modern training machines and professional guidance,
                our gym offers the perfect balance of workout and
                relaxation. Whether it’s yoga, cardio, or weights — we
                help you keep your wellness goals on track.
              </p>
              <Link to="/services">
                <HiArrowLongRight size={30} className="text-gray hover:text-khaki" />
              </Link>
            </div>
          </div>

          {/* 02 */}
          <hr className="text-[#e8e8e8] dark:text-[#383838] my-10" />
          <div
            className="grid grid-cols-1 md:grid-cols-2"
            data-aos="zoom-in-up"
            data-aos-duration="1000"
          >
            <div className="font-Garamond md:mr-[2px] lg:mr-[110px]">
              <h4 className="text-base font-semibold text-khaki uppercase pb-[6px]">
                LEISURE
              </h4>
              <h1 className="text-2xl md:text-3xl font-semibold text-lightBlack dark:text-white">
                <Link to="/services">Indoor Swimming Pool</Link>
              </h1>
              <p className="font-Lora text-sm sm:text-base text-gray dark:text-lightGray leading-[26px] my-10">
                Dive into luxury at our temperature-controlled indoor pool.
                Designed for both relaxation and recreation, the pool area
                provides a serene space to unwind, swim a few laps, or simply
                float away your stress amidst calming ambiance and soft lighting.
              </p>
              <Link to="/services">
                <HiArrowLongRight size={30} className="text-gray hover:text-khaki" />
              </Link>
            </div>

            <div className="w-full md:pl-[30px] relative mt-5 md:mt-0">
              <img
                src="/images/home-1/indoorpool.png"
                alt="Indoor Pool"
                className="w-full h-full"
              />
              <div className="hidden md:block absolute -top-[0px] -left-[12%]">
                <h1 className="text-3xl md:text-4xl lg:text-[40px] text-khaki">02</h1>
              </div>
            </div>
          </div>

          {/* 03 */}
          <hr className="text-[#e8e8e8] dark:text-[#383838] my-10" />
          <div
            className="grid grid-cols-1 md:grid-cols-2"
            data-aos="zoom-in-up"
            data-aos-duration="1000"
          >
            <div className="relative md:pr-[30px]">
              <img
                src="/images/home-1/restaurantlounge.png"
                alt="Restaurant & Lounge"
                className="w-full h-full"
              />
              <div className="hidden md:block absolute -top-[0px] md:-right-[12%] -right-[7%]">
                <h2 className="text-3xl md:text-4xl lg:text-[40px] text-khaki">03</h2>
              </div>
            </div>

            <div className="font-Garamond md:ml-[60px] lg:ml-[107px] mt-3 md:mt-0 relative">
              <h4 className="text-base font-semibold text-khaki uppercase pb-[6px]">
                DINING
              </h4>
              <h1 className="text-2xl md:text-3xl font-semibold text-lightBlack dark:text-white">
                <Link to="/services">The Restaurant & Lounge</Link>
              </h1>
              <p className="font-Lora text-sm sm:text-base text-gray dark:text-lightGray leading-[26px] my-10">
                Savor world-class cuisine at our signature restaurant,
                where international flavors meet local freshness. From
                lavish breakfast spreads to candlelight dinners, every
                meal is crafted by expert chefs to create a memorable
                dining experience.
              </p>
              <Link to="/services">
                <HiArrowLongRight size={30} className="text-gray hover:text-khaki" />
              </Link>
            </div>
          </div>

          {/* 04 */}
          <hr className="text-[#e8e8e8] dark:text-[#383838] my-10" />
          <div
            className="grid grid-cols-1 md:grid-cols-2"
            data-aos="zoom-in-up"
            data-aos-duration="1000"
          >
            <div className="font-Garamond md:mr-[2px] lg:mr-[110px]">
              <h4 className="text-base font-semibold text-khaki uppercase pb-[6px]">
                EXPERIENCE
              </h4>
              <h1 className="text-2xl md:text-3xl font-semibold text-lightBlack dark:text-white">
                <Link to="/services">Adventure & Recreation Zone</Link>
              </h1>
              <p className="font-Lora text-sm sm:text-base text-gray dark:text-lightGray leading-[26px] my-10">
                Explore more than just relaxation — discover adventure.
                From guided nature walks to outdoor sports and local cultural
                experiences, our resort ensures every guest finds their perfect
                blend of thrill and tranquility.
              </p>
              <Link to="/services">
                <HiArrowLongRight size={30} className="text-gray hover:text-khaki" />
              </Link>
            </div>

            <div className="w-full relative md:pl-[30px] mt-5 md:mt-0">
              <img
                src="/images/home-1/adventure.png"
                alt="Adventure"
                className="w-full h-full "
              />
              <div className="hidden md:block absolute -top-[0px] -left-[12%]">
                <h1 className="text-3xl md:text-4xl lg:text-[40px] text-khaki">04</h1>
              </div>
            </div>
          </div>
        </div>
        {/* ================== /SERVICES ================== */}
      </section>
    </div>
  );
};

export default Facilities;
