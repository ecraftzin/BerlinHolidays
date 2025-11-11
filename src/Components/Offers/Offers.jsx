import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useKeenSlider } from "keen-slider/react";
import "../../Components4/Testimonial/testimonials.css";
import "keen-slider/keen-slider.min.css";

import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { getActiveSpecialOffers } from "../../services/specialOffersService";
import { useBookingModal } from "../../context/BookingModalContext";

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { openBookingModal } = useBookingModal();

  const [sliderRef] = useKeenSlider({
    breakpoints: {
      "(min-width: 320px)": {
        slides: { perView: 1, spacing: 20 },
      },
      "(min-width: 600px)": {
        slides: { perView: 2, spacing: 20 },
      },
      "(min-width:1024px)": {
        slides: { perView: 3, spacing: 20 },
      },
    },
    loop: true,
    initial: 0,
  });

  // Fetch active offers on component mount
  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      try {
        const { data, error } = await getActiveSpecialOffers();
        if (!error && data) {
          setOffers(data);
        }
      } catch (err) {
        console.error("Error fetching offers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);
  return (
    <section className="bg-[#f8f6f3] dark:bg-lightBlack">
      <div className="Container py-20 lg:py-[50px] ">
        <div
          className="flex items-center justify-between relative"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          <div className=" md:w-[450px] lg:w-[450px] xl:w-[500px] font-Garamond">
            <h5 className="mb-3 text-base text-khaki leading-[26px] font-medium">
              OFFERS
            </h5>
            <h1 className="text-xl sm:text-3xl 2xl:text-[38px] leading-7 sm:leading-8 md:leading-[38px] lg:leading-[44px] text-lightBlack dark:text-white font-semibold">
              BERLIN’S LIMITED PERIOD BEST OFFERS
            </h1>
          </div>
          <div className="flex items-center lg:space-x-5  space-x-3">
            <button
              className="lg:w-[50px] w-[30px] h-[30px] lg:h-[50px]  flex items-center justify-center border-[1px] border-[#cccbc8] text-[#cccbc8] hover:bg-khaki hover:border-none group"
              disabled
              title="Button disabled use swapping"
            >
              <BsChevronLeft className="w-5 h-5 text-[#cccbc8] group-hover:text-white " />
            </button>
            <button
              className="lg:w-[50px] w-[30px] h-[30px] lg:h-[50px]  flex items-center justify-center border-[1px] border-[#cccbc8] text-[#cccbc8] hover:bg-khaki
             hover:border-none group"
              disabled
              title="Button disabled use swapping"
            >
              <BsChevronRight className="w-5 h-5 text-[#cccbc8]  group-hover:text-white" />
            </button>
          </div>
        </div>

        <hr className="text-[#e8e8e8] dark:text-[#383838] my-[40px]" />

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-khaki"></div>
          </div>
        ) : offers.length === 0 ? (
          /* No Offers State */
          <div className="text-center py-20">
            <p className="text-gray-600 dark:text-lightGray font-Lora text-lg">
              No special offers available at the moment. Check back soon!
            </p>
          </div>
        ) : (
          /* offers carousel */
          <div className="relative">
            <div className="mt-14 2xl:mt-[60px] keen-slider " ref={sliderRef}>
              {offers.map((offer, index) => (
                <div key={offer.id} className="keen-slider__slide number-slide1">
                  <div
                    className="overflow-hidden group h-full"
                    data-aos="fade-up"
                    data-aos-duration="1000"
                  >
                    {/* Beautiful Card without Image */}
                    <div className="relative h-full bg-white dark:bg-lightBlack border-2 border-[#e8e8e8] dark:border-[#3f4040] hover:border-khaki dark:hover:border-khaki transition-all duration-300 rounded-lg shadow-lg hover:shadow-2xl">

                      {/* Discount Badge - Top Right */}
                      <div className="absolute top-3 right-3 z-10">
                        <div className="bg-[#006938] text-white px-4 py-2 rounded-full shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                          <span className="text-base lg:text-lg font-bold font-Garamond">
                            {offer.discount_value}% OFF
                          </span>
                        </div>
                      </div>

                      {/* Decorative Top Border */}
                      <div className="h-2 bg-gradient-to-r from-[#c49e72] via-[#006938] to-[#c49e72]"></div>

                      {/* Content */}
                      <div className="p-8 pt-12 flex flex-col h-full">

                        {/* Title */}
                        <Link to="/room" className="block mb-4">
                          <h2 className="text-2xl lg:text-3xl font-bold font-Garamond text-lightBlack dark:text-white hover:text-[#006938] dark:hover:text-[#c49e72] transition-colors duration-300 leading-tight">
                            {offer.title}
                          </h2>
                        </Link>

                        {/* Description */}
                        {offer.description && (
                          <p className="text-base text-gray-700 dark:text-lightGray font-Lora mb-6 leading-relaxed flex-grow">
                            {offer.description}
                          </p>
                        )}

                        {/* Offer Details */}
                        <div className="space-y-3 mb-6">
                          {/* Room Type */}
                          <div className="flex items-center text-sm">
                            <span className="font-semibold text-[#c49e72] font-Garamond mr-2">Room Type:</span>
                            <span className="text-gray-600 dark:text-lightGray font-Lora">{offer.room_type || 'All Rooms'}</span>
                          </div>

                          {/* Valid Period */}
                          <div className="flex items-center text-sm">
                            <span className="font-semibold text-[#c49e72] font-Garamond mr-2">Valid:</span>
                            <span className="text-gray-600 dark:text-lightGray font-Lora">
                              {new Date(offer.valid_from).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - {new Date(offer.valid_to).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                        </div>

                        {/* Book Now Button */}
                        <button
                          onClick={openBookingModal}
                          className="w-full bg-[#006938] hover:bg-[#c49e72] text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 font-Garamond text-lg shadow-md hover:shadow-xl transform hover:-translate-y-1"
                        >
                          Book Now & Save {offer.discount_value}%
                        </button>

                        {/* Decorative Bottom Element */}
                        <div className="mt-6 pt-4 border-t border-[#e8e8e8] dark:border-[#3f4040]">
                          <p className="text-xs text-center text-gray-500 dark:text-gray-400 font-Lora italic">
                            Limited time offer • Book now to secure your discount
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Offers;
