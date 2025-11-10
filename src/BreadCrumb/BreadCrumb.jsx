import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const BreadCrumb = ({ title, home }) => {
  const location = useLocation();
  const pathName = location.pathname.split("/")[1];
  const [videoError, setVideoError] = useState(false);

  return (
    <section className="relative h-[550px] flex items-center justify-center overflow-hidden">
      {/* Background Video with fallback to image */}
      {!videoError ? (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="https://ygaav3vv2u5jx1dw.public.blob.vercel-storage.com/bredcrumpvideo.mp4"
          autoPlay
          loop
          muted
          playsInline
          onError={() => setVideoError(true)}
        ></video>
      ) : (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: "url('/images/inner/breadcumb.jpg')" }}
        ></div>
      )}

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Text content */}
      <div className="relative z-10 text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl leading-10 lg:leading-[60px] 2xl:leading-[70px] text-white font-semibold font-Garamond uppercase">
          {title}
        </h1>
        <div className="flex items-center justify-center mt-4">
          <Link
            to={`${pathName ? `/${pathName}` : "/"}`}
            className="text-base lg:text-2xl leading-10 2xl:leading-[70px] text-khaki font-semibold font-Garamond flex items-center"
          >
            Home <span className="mx-2 text-white">/</span>
          </Link>
          <span className="text-base lg:text-2xl leading-10 2xl:leading-[70px] text-white font-semibold font-Garamond capitalize">
            {title}
          </span>
        </div>
      </div>
    </section>
  );
};

export default BreadCrumb;
