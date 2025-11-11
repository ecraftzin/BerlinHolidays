import { useState, useEffect } from "react";
import { HiArrowLongRight } from "react-icons/hi2";
import { Link } from "react-router-dom";
import { getPublishedServices } from "../../services/servicesService";

const Facilities = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    const { data, error } = await getPublishedServices();
    if (error) {
      console.error("Error fetching services:", error);
      setServices([]);
    } else {
      setServices(data || []);
    }
    setLoading(false);
  };

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
        {loading ? (
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
                            <Link to="/services">{service.heading}</Link>
                          </h1>
                          <p className="font-Lora text-sm sm:text-base text-gray dark:text-lightGray leading-[26px] my-10">
                            {service.description}
                          </p>
                          <Link to="/services">
                            <HiArrowLongRight size={30} className="text-gray hover:text-khaki" />
                          </Link>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="font-Garamond md:mr-[2px] lg:mr-[110px]">
                          <h4 className="text-base font-semibold text-khaki uppercase pb-[6px]">
                            {service.category}
                          </h4>
                          <h1 className="text-2xl md:text-3xl font-semibold text-lightBlack dark:text-white">
                            <Link to="/services">{service.heading}</Link>
                          </h1>
                          <p className="font-Lora text-sm sm:text-base text-gray dark:text-lightGray leading-[26px] my-10">
                            {service.description}
                          </p>
                          <Link to="/services">
                            <HiArrowLongRight size={30} className="text-gray hover:text-khaki" />
                          </Link>
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
        {/* ================== /SERVICES ================== */}
      </section>
    </div>
  );
};

export default Facilities;

