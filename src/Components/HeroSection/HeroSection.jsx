// HeroSection.jsx

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "./style.css";

// Swiper
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const HeroSection = () => {
  return (
    <div className="">
      <Swiper
        centeredSlides={true}
        navigation={true}
        speed={3000}
        autoplay={{
          delay: 10000,
          disableOnInteraction: true,
        }}
        pagination={{ clickable: true }}
        modules={[Navigation, Autoplay, Pagination]}
        className="mySwiper"
      >
        {/* Single video slide */}
        <SwiperSlide>
  <div className="relative w-full h-[700px] md:h-[800px] xl:h-[850px] 3xl:h-[950px] overflow-hidden">
    <video
      src="https://pqurtwq9h9glt111.public.blob.vercel-storage.com/berlinbannervideo.mov"
      autoPlay
      muted
      loop
      playsInline
      className="absolute top-0 left-0 w-full h-full object-cover"
    />
    {/* If you truly want ONLY video, remove any overlay content here */}
  </div>
</SwiperSlide>

      </Swiper>
    </div>
  );
};

export default HeroSection;
