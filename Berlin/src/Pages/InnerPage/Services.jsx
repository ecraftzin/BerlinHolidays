import { useEffect, useState } from "react";
import { HiArrowLongRight } from "react-icons/hi2";
import BreadCrumb from "../../BreadCrumb/BreadCrumb";
import { Link } from "react-router-dom";

const Services = () => {
  const [menu, setMenu] = useState([]);
  const [showItem, setShowItem] = useState([]);

  useEffect(() => {
    fetch("/food.menu.json")
      .then((res) => res.json())
      .then((data) => {
        setMenu(data);
        setShowItem(data); // default show all
      });
  }, []);

  return (
    <section className="">
      <BreadCrumb title="services" />

      <div className="dark:bg-mediumBlack ">
        <section className="Container py-[120px] md:py-0 md:pb-[120px] lg:py-[60px]">
          {/* Section Title */}
          <div
            className="flex flex-col md:flex-row md:items-center justify-between mb-12 px-3 sm:px-5"
            data-aos="fade-up"
            data-aos-duration="1000"
          >
            <div className=" md:w-[450px] font-Garamond">
              <h5 className="text-base text-khaki leading-[26px] font-medium mb-[14px]">
                FACILITIES
              </h5>
              <h1 className="text-[22px] sm:text-2xl md:text-3xl 2xl:text-[38px] leading-[38px] lg:leading-[44px] text-lightBlack dark:text-white font-semibold">
                ENJOY COMPLETE & BEST QUALITY FACILITIES
              </h1>
            </div>
            <div className="mt-5 md:mt-0">
              <Link to="/contact">
                <button className="btn-items">Enquiry Now</button>
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
                  <Link to="/service_details">Gym & Wellness Center</Link>
                </h1>
                <p className="font-Lora text-sm sm:text-base text-gray dark:text-lightGray leading-[26px] my-10">
                  Stay energized during your vacation with our
                  state-of-the-art fitness studio. Equipped with
                  modern training machines and professional guidance,
                  our gym offers the perfect balance of workout and
                  relaxation.
                </p>
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
                  <Link to="/service_details">Indoor Swimming Pool</Link>
                </h1>
                <p className="font-Lora text-sm sm:text-base text-gray dark:text-lightGray leading-[26px] my-10">
                  Dive into luxury at our temperature-controlled indoor pool.
                  Designed for both relaxation and recreation, the pool area
                  provides a serene space to unwind and rejuvenate.
                </p>
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
                  alt="Restaurant"
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
                  <Link to="/service_details">The Restaurant & Lounge</Link>
                </h1>
                <p className="font-Lora text-sm sm:text-base text-gray dark:text-lightGray leading-[26px] my-10">
                  Savor world-class cuisine at our signature restaurant,
                  where international flavors meet local freshness.
                </p>
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
                  <Link to="/service_details">Adventure & Recreation Zone</Link>
                </h1>
                <p className="font-Lora text-sm sm:text-base text-gray dark:text-lightGray leading-[26px] my-10">
                  Explore more than just relaxation — discover adventure.
                  From guided nature walks to outdoor sports and cultural
                  experiences, enjoy every moment.
                </p>
              </div>
              <div className="w-full relative md:pl-[30px] mt-5 md:mt-0">
                <img
                  src="/images/home-1/adventure.png"
                  alt="Adventure"
                  className="w-full h-full"
                />
                <div className="hidden md:block absolute -top-[0px] -left-[12%]">
                  <h1 className="text-3xl md:text-4xl lg:text-[40px] text-khaki">04</h1>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RESTAURANT FOOD MENU ================= */}
          <div className="bg-whiteSmoke dark:bg-lightBlack py-20 2xl:py-[120px] mt-20">
            <div className="Container">
              {/* header */}
              <div className="text-center" data-aos="fade-up" data-aos-duration="1000">
                <div className="flex items-center justify-center space-x-2">
                  <hr className="w-[100px] h-[1px] bg-lightGray dark:bg-gray" />
                  <img
                    src="/images/home-1/sectiondivider01.png"
                    alt="section logo"
                    className="w-[50px] h-[50px]"
                  />
                  <hr className="w-[100px] h-[1px] bg-lightGray dark:bg-gray" />
                </div>
                <h1 className="text-xl sm:text-2xl md:text-3xl 2xl:text-[38px] leading-[42px] text-lightBlack dark:text-white mt-[10px] mb-[14px] font-Garamond font-semibold uppercase">
                  RESTAURANT FOOD MENU
                </h1>
              </div>

              {/* Tabs */}
              <div className="mt-14 2xl:mt-[60px]">
                <div
                  className="grid grid-cols-2 sm:grid-cols-4 sm:flex items-center justify-center gap-3"
                  data-aos="zoom-in-up"
                  data-aos-duration="1000"
                >
                  {["breakfast", "lunch", "supper", "dinner"].map((cat) => (
                    <button
                      key={cat}
                      className="px-5 lg:px-[26px] py-2 lg:py-[10px] bg-white dark:bg-normalBlack text-lightBlack dark:text-white rounded focus:bg-khaki focus:text-white hover:ring-2 ring-khaki ring-offset-2 dark:ring-offset-lightBlack text-sm sm:text-[15px] font-Garamond font-medium"
                      onClick={() => {
                        const items = menu.filter((el) => el.category === cat);
                        setShowItem(items);
                      }}
                    >
                      {cat.toUpperCase()}
                    </button>
                  ))}
                </div>

                {/* Menu List */}
                <div
                  className="grid grid-cols-1 lg:grid-cols-2 gap-5 2xl:gap-[30px] mt-10"
                  data-aos="zoom-in-up"
                  data-aos-duration="1000"
                >
                  {showItem.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row items-center bg-white dark:bg-normalBlack pl-5 py-5 hover:shadow-custom"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-[100px] h-[100px] sm:w-fit sm:h-fit rounded-2xl sm:rounded-none mb-5 sm:mb-0"
                      />
                      <div className="px-5 md:px-6 2xl:px-[30px] w-full">
                        <div className="flex items-center justify-between pb-4">
                          <h4 className="text-lg sm:text-xl text-lightBlack dark:text-white font-Garamond font-medium">
                            {item.title}
                          </h4>
                          <h4 className="text-lg sm:text-xl text-khaki font-Garamond font-medium">
                            $ {item.price}
                          </h4>
                        </div>
                        <div className="border-t border-dashed border-lightGray dark:border-gray pb-4"></div>
                        <p className="text-gray dark:text-lightGray font-Lora text-sm md:text-[15px]">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                  {showItem.length === 0 && (
                    <p className="text-center text-gray dark:text-lightGray font-Lora">
                      No items available in this category.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* ================= END FOOD MENU ================= */}
        </section>
      </div>
    </section>
  );
};

export default Services;
