import { useEffect, useState } from "react";
import { HiArrowLongRight } from "react-icons/hi2";
import BreadCrumb from "../../BreadCrumb/BreadCrumb";
import { Link } from "react-router-dom";
import { getActiveMenuItems, getActiveCategories } from "../../services/menuService";
import { getPublishedServices } from "../../services/servicesService";

const Services = () => {
  const [menu, setMenu] = useState([]);
  const [showItem, setShowItem] = useState([]);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setServicesLoading(true);
    const { data, error } = await getPublishedServices();
    if (error) {
      console.error("Error fetching services:", error);
      setServices([]);
    } else {
      setServices(data || []);
    }
    setServicesLoading(false);
  };

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
          {servicesLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-khaki"></div>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 dark:text-gray-400 font-Lora text-lg">
                No services available at the moment.
              </p>
            </div>
          ) : (
            <div>
              {services.map((service, index) => {
                const isEven = index % 2 === 0;
                return (
                  <div key={service.id}>
                    <hr className="text-[#e8e8e8] dark:text-[#383838] my-10" />
                    <div
                      className="grid grid-cols-1 md:grid-cols-2"
                      data-aos="zoom-in-up"
                      data-aos-duration="1000"
                    >
                      {isEven ? (
                        <>
                          <div className="relative w-full md:pr-[30px]">
                            {service.image && (
                              <img
                                src={service.image}
                                alt={service.heading}
                                className="w-full h-full object-cover"
                              />
                            )}
                            <div className="hidden md:block absolute -top-[0px] md:-right-[12%] -right-[7%]">
                              <h2 className="text-3xl md:text-4xl lg:text-[40px] text-khaki">
                                {String(service.number).padStart(2, '0')}
                              </h2>
                            </div>
                          </div>

                          <div className="relative font-Garamond md:ml-[60px] lg:ml-[107px] mt-3 md:mt-0">
                            <h4 className="text-base font-semibold text-khaki uppercase pb-[6px]">
                              {service.category}
                            </h4>
                            <h1 className="text-2xl md:text-3xl font-semibold text-lightBlack dark:text-white">
                              <Link to="/service_details">{service.heading}</Link>
                            </h1>
                            <p className="font-Lora text-sm sm:text-base text-gray dark:text-lightGray leading-[26px] my-10">
                              {service.description}
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="font-Garamond md:mr-[2px] lg:mr-[110px]">
                            <h4 className="text-base font-semibold text-khaki uppercase pb-[6px]">
                              {service.category}
                            </h4>
                            <h1 className="text-2xl md:text-3xl font-semibold text-lightBlack dark:text-white">
                              <Link to="/service_details">{service.heading}</Link>
                            </h1>
                            <p className="font-Lora text-sm sm:text-base text-gray dark:text-lightGray leading-[26px] my-10">
                              {service.description}
                            </p>
                          </div>

                          <div className="w-full md:pl-[30px] relative mt-5 md:mt-0">
                            {service.image && (
                              <img
                                src={service.image}
                                alt={service.heading}
                                className="w-full h-full object-cover"
                              />
                            )}
                            <div className="hidden md:block absolute -top-[0px] -left-[12%]">
                              <h1 className="text-3xl md:text-4xl lg:text-[40px] text-khaki">
                                {String(service.number).padStart(2, '0')}
                              </h1>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
