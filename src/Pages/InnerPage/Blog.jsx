import { BsArrowRight } from "react-icons/bs";
import BreadCrumb from "../../BreadCrumb/BreadCrumb";
import { Link } from "react-router-dom";

const BLOGS = [
  {
    id: 1,
    title: "Top 5 Luxury Resorts in Wayanad for Your Next Getaway",
    img: "/images/home-1/blog1img.png",
  },
  {
    id: 2,
    title: "A Taste of Luxury: Fine Dining Experiences You Can’t Miss",
    img: "/images/home-1/blog2img.png",
  },
  {
    id: 3,
    title: "Wellness Retreats: Reconnect, Relax, and Recharge",
    img: "/images/home-1/blog3img.png",
  },
  {
    id: 4,
    title: "Kerala Escapes: Luxury in the Lap of Nature",
    img: "/images/home-1/blog4img.png",
  },
];

const BlogCard = ({ id, title, img }) => (
  <div
    className="overflow-hidden 3xl:w-[410px] group"
    data-aos="fade-up"
    data-aos-duration="1000"
  >
    <div className="relative">
      <img src={img} className="w-full h-full object-cover" alt={title} />
    </div>
    <div className="font-Garamond border border-[#ddd] dark:border-gray border-t-0">
      <div className="py-6 px-[30px] ">
        <Link to={`/blog/${id}`}>
          <h2 className="text-xl md:text-[22px] xl:text-2xl 2xl:text-[26px] leading-[34px] font-semibold text-lightBlack dark:text-white py-2 hover:underline underline-offset-2">
            {title}
          </h2>
        </Link>
      </div>
      <div className="border-t border-[#ddd] dark:border-gray py-4">
        <Link
          to={`/blog/${id}`}
          className="px-[30px] flex items-center justify-between"
        >
          <span className="text-sm sm:text-base flex items-center ">
            <span className="ml-[10px] uppercase text-lightBlack dark:text-white font-medium hover:underline underline-offset-1">
              Read More
            </span>
          </span>
          <BsArrowRight
            className="text-gray dark:text-lightGray group-hover:text-khaki"
            size={"24px"}
          />
        </Link>
      </div>
    </div>
  </div>
);

const Blog = () => (
  <div>
    <BreadCrumb title="Blog" />
    <div className="dark:bg-lightBlack py-20 2xl:py-[120px]">
      <div className="Container flex justify-center">
        <div className="grid items-center gap-5 2xl:gap-y-[30px] grid-cols-1 lg:grid-cols-2">
          {BLOGS.map((b) => (
            <BlogCard key={b.id} id={b.id} title={b.title} img={b.img} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default Blog;
