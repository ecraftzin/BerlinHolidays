import { useState, useEffect } from "react";
import { BsArrowRight } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useKeenSlider } from "keen-slider/react";
import { getPublishedBlogPosts } from "../../services";
import "../../Components4/Testimonial/testimonials.css";
import "keen-slider/keen-slider.min.css";

const LatestBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sliderRef] = useKeenSlider({
    breakpoints: {
      "(min-width: 320px)": {
        slides: { perView: 1, spacing: 20 },
      },
      "(min-width: 768px)": {
        slides: { perView: 2, spacing: 20 },
      },
      "(min-width:992px)": {
        slides: { perView: 3, spacing: 20 },
      },
    },
    loop: true,
    initial: 0,
  });

  useEffect(() => {
    fetchLatestBlogs();
  }, []);

  const fetchLatestBlogs = async () => {
    setLoading(true);
    const { data, error } = await getPublishedBlogPosts();
    
    if (!error && data) {
      setBlogs(data.slice(0, 6));
    }
    
    setLoading(false);
  };

  if (!loading && blogs.length === 0) {
    return null;
  }

  return (
    <div className="dark:bg-normalBlack">
      <div className="bg-[url('/images/home-1/section-shape2.png')] bg-no-repeat bg-top bg-opacity-[0.07]">
        <section className="Container py-20 lg:py-[120px]">
          <div
            data-aos="fade-up"
            data-aos-duration="1000"
            className=" text-center mx-auto  px-5 sm:px-8 md:px-[80px] lg:px-[120px] xl:px-[200px] 2xl:px-[335px]"
          >
            <div className="flex items-center justify-center space-x-2 mb-4  ">
              <hr className="w-[100px] h-[1px] text-[#dedbd4] dark:text-[#3b3b3b] " />
              <img
                src="/images/home-1/sectiondivider01.png"
                alt="room_section_logo"
                className="w-[50px] h-[50px]"
              />
              <hr className="w-[100px] h-[1px] text-[#dedbd4] dark:text-[#3b3b3b] " />
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl 2xl:text-[38px] leading-[44px] lg:leading-[52px] text-lightBlack dark:text-white  font-Garamond font-semibold uppercase mb-[8px]">
              LATEST POSTS FROM OUR BLOG
            </h1>
            <p className="font-Lora leading-[26px] text-gray dark:text-lightGray font-normal text-sm sm:text-base">
              Stay inspired with travel stories, destination guides,
               and insider tips that make every journey unforgettable.
            </p>
          </div>
          <div className="relative">
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-khaki"></div>
                <p className="mt-4 text-gray dark:text-lightGray font-Lora">Loading latest posts...</p>
              </div>
            ) : (
              <div className="mt-14 2xl:mt-[60px] keen-slider" ref={sliderRef}>
                {blogs.map((blog, index) => (
                  <div key={blog.id} className="keen-slider__slide number-slide1">
                    <div
                      className="overflow-hidden 3xl:w-[410px] group"
                      data-aos={index === 0 ? "fade-up-left" : index === 1 ? "fade-up" : "fade-up-right"}
                      data-aos-duration="1000"
                    >
                      <div className="relative">
                        <img
                          src={blog.featured_image || "/images/home-1/blog1img.png"}
                          className="w-full h-full object-cover"
                          alt={blog.title}
                          onError={(e) => {
                            e.target.src = "/images/home-1/blog1img.png";
                          }}
                        />
                        {blog.category_name && (
                          <div className="absolute top-4 left-4 bg-khaki text-white px-3 py-1 text-xs font-Lora font-semibold uppercase">
                            {blog.category_name}
                          </div>
                        )}
                      </div>
                      <div className="font-Garamond border border-[#e8e8e8] dark:border-[#424242] border-t-0">
                        <div className="py-6 px-[30px] lg:px-5 xl:px-[25px]">
                          <Link to={`/blog/${blog.id}`}>
                            <button className="text-xl sm:text-[22px] xl:text-2xl text-left 2xl:text-[26px] leading-[34px] font-semibold text-lightBlack dark:text-white py-2 sm:py-3 md:py-4 hover:underline underline-offset-2">
                              {blog.title}
                            </button>
                          </Link>
                          {blog.excerpt && (
                            <p className="text-sm text-gray dark:text-lightGray font-Lora mt-2 line-clamp-2">
                              {blog.excerpt}
                            </p>
                          )}
                        </div>
                        <div className="border-t-[1px] border-[#e8e8e8] dark:border-[#424242] py-2 lg:py-3">
                          <Link
                            to={`/blog/${blog.id}`}
                            className="px-[30px] flex items-center justify-between"
                          >
                            <button className="text-sm sm:text-base flex items-center">
                              <span className="ml-[10px] leading-[38px] uppercase text-lightBlack dark:text-white font-medium group-hover:text-khaki hover:underline underline-offset-1">
                                Read More
                              </span>
                            </button>
                            <div>
                              <BsArrowRight
                                className="text-gray dark:text-lightGray group-hover:text-khaki"
                                size={"24px"}
                              />
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default LatestBlog;
