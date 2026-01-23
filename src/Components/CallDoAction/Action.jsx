import { useState } from "react";

const Action = () => {
  return (
    <div className="dark:bg-mediumBlack bg-black">
      <section className="Container mt-[-90px]">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 items-center">

          {/* LEFT CONTENT */}
          <div className="bg-[#f8f6f3] dark:bg-normalBlack space-y-[14px] font-Garamond px-5 sm:px-7 md:px-9 lg:pl-[70px] py-10 md:py-[96px] lg:pr-[70px]">
            <h5 className="text-base text-khaki font-semibold">
              BERLIN HOLIDAYS
            </h5>

            <h1 className="text-[22px] sm:text-2xl md:text-[28px] xl:text-[32px] 2xl:text-[38px] text-lightBlack dark:text-white font-semibold">
              LUXURY RESORT EXPERIENCE IN BERLIN
            </h1>

            <p className="text-sm sm:text-base font-Lora text-gray dark:text-lightGray">
              Escape to a world where elegance meets tranquility.
            </p>

            <p className="italic underline text-gray dark:text-lightGray">
              “ Where every stay feels exclusive, and every moment becomes a memory. ”
            </p>
          </div>

          {/* RIGHT AUTOPLAY VIDEO */}
          <div className="relative w-full h-[75vh] lg:h-screen bg-black overflow-hidden">
            {/* Video Container with optional gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50"></div>
            
            <video
              className="w-full h-full object-cover"
              muted
              loop
              playsInline
              autoPlay
              preload="auto"
            >
              <source
                src="/bannervideo/berlin-video-1-dec-new.mp4"
                type="video/mp4"
              />
            </video>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Action;
