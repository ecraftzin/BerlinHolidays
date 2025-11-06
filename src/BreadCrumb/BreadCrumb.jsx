import { Link, useLocation } from "react-router-dom";

const BreadCrumb = ({ title, home }) => {
  const location = useLocation();
  const pathName = location.pathname.split("/")[1];

  return (
    <section className="relative h-[550px] flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="https://pillguzjpmnpa1q3.public.blob.vercel-storage.com/9befa2e3-fa3c-4e3b-b753-05b7d57215dd.mp4"
        autoPlay
        loop
        muted
        playsInline
      ></video>

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
