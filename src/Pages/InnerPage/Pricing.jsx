import { useState, useEffect } from "react";
import BreadCrumb from "../../BreadCrumb/BreadCrumb";
import { GoDotFill } from "react-icons/go";
import AnimatedAccordionPage from "./Accordion/AnimatedAccordionPage";
import { getActivePricingPlans } from "../../services/pricingService";
import { getActiveRatePlans } from "../../services/ratePlansService";
import { useBookingModal } from "../../context/BookingModalContext";

const Pricing = () => {
  const [pricingPlans, setPricingPlans] = useState([]);
  const [ratePlans, setRatePlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratesLoading, setRatesLoading] = useState(true);
  const { openBookingModal } = useBookingModal();

  useEffect(() => {
    fetchPricingPlans();
    fetchRatePlans();
  }, []);

  const fetchPricingPlans = async () => {
    setLoading(true);
    const { data, error } = await getActivePricingPlans();
    if (error) {
      console.error("Error fetching pricing plans:", error);
    } else {
      setPricingPlans(data || []);
    }
    setLoading(false);
  };

  const fetchRatePlans = async () => {
    setRatesLoading(true);
    const { data, error } = await getActiveRatePlans();
    if (error) {
      console.error("Error fetching rate plans:", error);
    } else {
      setRatePlans(data || []);
    }
    setRatesLoading(false);
  };

  return (
    <div>
      <BreadCrumb title="Pricing" />
      {/* Pricing  */}
      <div className="dark:bg-normalBlack py-20 2xl:py-[120px]">
        <div className="Container">
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
              Holiday Packages & Pricing
            </h1>
            <p className="font-Lora leading-7 lg:leading-[26px] text-lightGray font-normal text-sm sm:text-base">
              Explore our curated holiday packages designed to give you the best experience in Berlin
            </p>
          </div>
          {/* Pricing Plan */}
          <div className="mt-14 2xl:mt-[60px]">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-khaki"></div>
              </div>
            ) : pricingPlans.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray dark:text-lightGray font-Lora text-lg">
                  No pricing plans available at the moment. Please check back later.
                </p>
              </div>
            ) : (
              <div className="grid items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-[30px]">
                {pricingPlans.map((plan, index) => (
                  <div
                    key={plan.id}
                    className="border-[1px] border-lightGray dark:border-gray group hover:border-khaki dark:hover:border-khaki"
                    data-aos="zoom-in-up"
                    data-aos-duration="1000"
                  >
                    <img
                      src={plan.image_url || `/images/inner/pricing-${(index % 3) + 1}.jpg`}
                      alt={plan.name}
                      className="relative w-full"
                    />

                    <div className="px-5 pb-5 2xl:px-[30px] 2xl:pb-[30px]">
                      <div className="bg-lightBlack px-5 2xl:px-[30px] py-3 lg:py-4 relative bottom-[30px] z-[1] gallery-effect before:bg-khaki before:z-[-1] before:group-hover:w-full before:group-hover:left-0">
                        <h4 className="text-lg sm:text-xl md:text-2xl xl:text-[26px] text-white font-Garamond font-semibold ">
                          {plan.name}
                        </h4>
                      </div>
                      <div className="flex items-center pb-5 ">
                        <span className="text-2xl md:text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-[50px] leading-7 md:leading-8 lg:leading-9 xl:leading-10 2xl:leading-[55px]  text-khaki font-bold font-Garamond">
                          {plan.price}
                        </span>
                      </div>
                      <div className="flex items-center pb-3">
                        <span className="text-sm sm:text-base lg:text-lg leading-[26px] text-gray dark:text-lightGray font-Lora font-semibold">
                          Duration: {plan.duration}
                        </span>
                      </div>
                      <hr className="text-lightGray dark:text-gray " />
                      <div className="py-5 2xl:pb-[30px]">
                        <h5 className="text-base font-semibold font-Garamond mb-3 text-lightBlack dark:text-white">
                          Package Includes:
                        </h5>
                        <div className="text-sm sm:text-base lg:text-lg leading-[26px] text-gray dark:text-lightGray font-Lora font-normal whitespace-pre-line">
                          {plan.includes}
                        </div>
                      </div>
                      <button
                        onClick={openBookingModal}
                        className="btn-items dark:btn-secondary"
                      >
                        BOOK NOW
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Base Rates Section */}
      <div className="bg-whiteSmoke dark:bg-lightBlack py-20 2xl:py-[120px]">
        <div className="Container">
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
             Rate of All Rooms
            </h1>
            <p className="font-Lora leading-7 lg:leading-[26px] text-lightGray font-normal text-sm sm:text-base">
              Transparent pricing for all our room types - Choose the perfect accommodation for your stay
            </p>
          </div>

          {/* Base Rates Grid */}
          <div className="mt-14 2xl:mt-[60px]">
            {ratesLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-khaki"></div>
              </div>
            ) : ratePlans.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray dark:text-lightGray font-Lora text-lg">
                  No rate plans available at the moment. Please check back later.
                </p>
              </div>
            ) : (
              <div className="grid items-stretch grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {ratePlans.map((plan, index) => (
                  <div
                    key={plan.id}
                    className="group relative bg-white dark:bg-normalBlack rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-khaki"
                    data-aos="fade-up"
                    data-aos-duration="1000"
                    data-aos-delay={index * 100}
                  >
                    {/* Gradient Top Border */}
                    <div className="h-2 bg-gradient-to-r from-[#c49e72] via-[#006938] to-[#c49e72]"></div>

                    <div className="p-6 lg:p-8">
                      {/* Room Type Badge */}
                      <div className="inline-block mb-4">
                        <span className="px-4 py-2 bg-[#f7f5f2] dark:bg-gray-800 text-[#006938] dark:text-khaki text-sm font-semibold font-Lora rounded-full">
                          {plan.room_types?.name || "Room Type"}
                        </span>
                      </div>

                      {/* Plan Name */}
                      <h3 className="text-2xl lg:text-3xl font-bold font-Garamond text-lightBlack dark:text-white mb-4">
                        {plan.name}
                      </h3>

                      {/* Description */}
                      {plan.description && (
                        <p className="text-gray dark:text-lightGray font-Lora text-sm lg:text-base leading-relaxed mb-6">
                          {plan.description}
                        </p>
                      )}

                      {/* Rates Grid */}
                      <div className="space-y-4 mb-6">
                        {/* Base Rate */}
                        <div className="flex items-center justify-between p-4 bg-[#f7f5f2] dark:bg-gray-800 rounded-lg">
                          <div>
                            <p className="text-xs lg:text-sm text-gray dark:text-lightGray font-Lora uppercase tracking-wide">
                              Base Rate
                            </p>
                            <p className="text-2xl lg:text-3xl font-bold font-Garamond text-[#006938] dark:text-khaki mt-1">
                              ₹{plan.base_rate}
                            </p>
                          </div>
                          <div className="text-xs text-gray dark:text-lightGray font-Lora">
                            per night
                          </div>
                        </div>

                        {/* Weekend Rate */}
                        {plan.weekend_rate && (
                          <div className="flex items-center justify-between p-4 bg-[#f7f5f2] dark:bg-gray-800 rounded-lg">
                            <div>
                              <p className="text-xs lg:text-sm text-gray dark:text-lightGray font-Lora uppercase tracking-wide">
                                Weekend Rate
                              </p>
                              <p className="text-xl lg:text-2xl font-bold font-Garamond text-[#c49e72] dark:text-khaki mt-1">
                                ₹{plan.weekend_rate}
                              </p>
                            </div>
                            <div className="text-xs text-gray dark:text-lightGray font-Lora">
                              per night
                            </div>
                          </div>
                        )}

                        {/* Seasonal Rate */}
                        {plan.seasonal_rate && (
                          <div className="flex items-center justify-between p-4 bg-[#f7f5f2] dark:bg-gray-800 rounded-lg">
                            <div>
                              <p className="text-xs lg:text-sm text-gray dark:text-lightGray font-Lora uppercase tracking-wide">
                                Seasonal Rate
                              </p>
                              <p className="text-xl lg:text-2xl font-bold font-Garamond text-[#c49e72] dark:text-khaki mt-1">
                                ₹{plan.seasonal_rate}
                              </p>
                            </div>
                            <div className="text-xs text-gray dark:text-lightGray font-Lora">
                              per night
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Book Now Button */}
                      <button
                        onClick={openBookingModal}
                        className="w-full px-6 py-4 bg-[#006938] hover:bg-[#004d27] text-white font-Lora font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-1"
                      >
                        Book This Room
                      </button>
                    </div>

                    {/* Decorative Corner Element */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-khaki/10 to-transparent rounded-bl-full"></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="dark:bg-normalBlack py-20 2xl:py-[120px]">
        <div className="Container">
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
              FREEQUENTLY ASKED QESTION
            </h1>
          </div>
          {/* accordion Plan */}
          <div className="mt-14 2xl:mt-[60px]">
            <div className="">
              <AnimatedAccordionPage />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
