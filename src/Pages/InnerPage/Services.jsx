import { useEffect, useState } from "react";
import { HiArrowLongRight } from "react-icons/hi2";
import BreadCrumb from "../../BreadCrumb/BreadCrumb";
import { Link } from "react-router-dom";
import { getActiveMenuItems, getActiveCategories } from "../../services/menuService";

const Services = () => {
  const [menu, setMenu] = useState([]);
  const [showItem, setShowItem] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await getActiveMenuItems();

      if (error) {
        console.error("Error fetching menu items:", error);
        setMenu([]);
        setShowItem([]);
      } else if (data && data.length > 0) {
        // Transform database data to match the expected format
        const transformedData = data.map((item) => ({
          category: item.category_name?.toLowerCase() || "uncategorized",
          title: item.name || "Untitled",
          image: item.image_url || "/images/inner/food-1.jpg",
          description: item.description || "No description available",
          price: item.price ? item.price.toString() : "0",
        }));
        setMenu(transformedData);
        setShowItem(transformedData);
      } else {
        setMenu([]);
        setShowItem([]);
      }
    } catch (err) {
      console.error("Exception in fetchMenuItems:", err);
      setMenu([]);
      setShowItem([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    const { data, error } = await getActiveCategories();
    if (error) {
      console.error("Error fetching categories:", error);
    } else {
      setCategories(data || []);
    }
  };

  const handleCategoryFilter = (categoryName) => {
    setSelectedCategory(categoryName);
    if (categoryName === "all") {
      setShowItem(menu);
    } else {
      const items = menu.filter((el) => el.category === categoryName.toLowerCase());
      setShowItem(items);
    }
  };

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
        </section>

        {/* ================= RESTAURANT FOOD MENU ================= */}
        <div className="bg-whiteSmoke dark:bg-lightBlack py-20 2xl:py-[120px]">
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
                className="flex flex-wrap items-center justify-center gap-3"
                data-aos="zoom-in-up"
                data-aos-duration="1000"
              >
                {/* All Items Button */}
                <button
                  className={`px-5 lg:px-[26px] py-2 lg:py-[10px] rounded text-sm sm:text-[15px] font-Garamond font-medium transition-all ${
                    selectedCategory === "all"
                      ? "bg-khaki text-white"
                      : "bg-white dark:bg-normalBlack text-lightBlack dark:text-white hover:ring-2 ring-khaki ring-offset-2 dark:ring-offset-lightBlack"
                  }`}
                  onClick={() => handleCategoryFilter("all")}
                >
                  ALL ITEMS
                </button>

                {/* Dynamic Category Buttons */}
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    className={`px-5 lg:px-[26px] py-2 lg:py-[10px] rounded text-sm sm:text-[15px] font-Garamond font-medium transition-all ${
                      selectedCategory === cat.name.toLowerCase()
                        ? "bg-khaki text-white"
                        : "bg-white dark:bg-normalBlack text-lightBlack dark:text-white hover:ring-2 ring-khaki ring-offset-2 dark:ring-offset-lightBlack"
                    }`}
                    onClick={() => handleCategoryFilter(cat.name)}
                  >
                    {cat.name.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Menu List */}
              <div className="mt-10">
                {loading ? (
                  <div className="flex flex-col justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-khaki mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400 font-Lora">Loading menu items...</p>
                  </div>
                ) : showItem.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-gray-600 dark:text-gray-400 font-Lora text-lg">
                      No menu items available in this category.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 2xl:gap-8">
                    {showItem.map((item, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '20px',
                          backgroundColor: '#f7f5f2',
                          padding: '24px',
                          borderRadius: '8px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          minHeight: '180px'
                        }}
                      >
                        {/* Food Image - Circular */}
                        <div style={{ flexShrink: 0 }}>
                          <img
                            src={item.image}
                            alt={item.title}
                            style={{
                              width: '130px',
                              height: '130px',
                              borderRadius: '50%',
                              objectFit: 'cover',
                              border: '3px solid #e0e0e0'
                            }}
                            onError={(e) => {
                              e.target.src = "/images/inner/food-1.jpg";
                            }}
                          />
                        </div>

                        {/* Food Details */}
                        <div style={{ flex: 1 }}>
                          {/* Title and Price */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                            <h4 style={{ fontSize: '24px', fontWeight: '600', color: '#1e1e1e', fontFamily: 'Cormorant Garamond, serif' }}>
                              {item.title}
                            </h4>
                            <span style={{ fontSize: '24px', fontWeight: '600', color: '#c49e72', whiteSpace: 'nowrap', marginLeft: '12px', fontFamily: 'Cormorant Garamond, serif' }}>
                              $ {item.price}
                            </span>
                          </div>

                          {/* Divider */}
                          <div style={{ borderTop: '1px dashed #d4d4d4', marginBottom: '12px' }}></div>

                          {/* Description */}
                          <p style={{ fontSize: '14px', color: '#666666', lineHeight: '1.6', fontFamily: 'Lora, serif' }}>
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* ================= END FOOD MENU ================= */}
      </div>
    </section>
  );
};

export default Services;
