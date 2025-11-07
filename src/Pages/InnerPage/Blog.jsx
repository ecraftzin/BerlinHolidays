import { useState, useEffect } from "react";
import { BsArrowRight } from "react-icons/bs";
import BreadCrumb from "../../BreadCrumb/BreadCrumb";
import { Link } from "react-router-dom";
import { getPublishedBlogPosts } from "../../services";

const BlogCard = ({ id, title, img, excerpt, category }) => (
  <div
    className="overflow-hidden 3xl:w-[410px] group"
    data-aos="fade-up"
    data-aos-duration="1000"
  >
    <div className="relative">
      <img 
        src={img || "/images/home-1/blog1img.png"} 
        className="w-full h-full object-cover" 
        alt={title}
        onError={(e) => {
          e.target.src = "/images/home-1/blog1img.png";
        }}
      />
      {category && (
        <div className="absolute top-4 left-4 bg-khaki text-white px-3 py-1 text-xs font-Lora font-semibold uppercase">
          {category}
        </div>
      )}
    </div>
    <div className="font-Garamond border border-[#ddd] dark:border-gray border-t-0">
      <div className="py-6 px-[30px] ">
        <Link to={`/blog/${id}`}>
          <h2 className="text-xl md:text-[22px] xl:text-2xl 2xl:text-[26px] leading-[34px] font-semibold text-lightBlack dark:text-white py-2 hover:underline underline-offset-2">
            {title}
          </h2>
        </Link>
        {excerpt && (
          <p className="text-sm text-gray dark:text-lightGray font-Lora mt-2 line-clamp-2">
            {excerpt}
          </p>
        )}
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

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    
    const { data, error } = await getPublishedBlogPosts();
    
    if (error) {
      setError(error.message);
      console.error('Error fetching blog posts:', error);
    } else {
      setBlogs(data || []);
    }
    
    setLoading(false);
  };

  return (
    <div>
      <BreadCrumb title="Blog" />
      <div className="dark:bg-lightBlack py-20 2xl:py-[120px]">
        <div className="Container flex justify-center">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-khaki"></div>
              <p className="mt-4 text-gray dark:text-lightGray font-Lora">Loading blog posts...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 font-Lora text-lg">{error}</p>
              <button 
                onClick={fetchBlogs}
                className="mt-4 px-6 py-2 bg-khaki text-white rounded-lg hover:opacity-90 transition-all"
              >
                Try Again
              </button>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray dark:text-lightGray font-Lora text-lg">No blog posts available yet.</p>
            </div>
          ) : (
            <div className="grid items-center gap-5 2xl:gap-y-[30px] grid-cols-1 lg:grid-cols-2">
              {blogs.map((blog) => (
                <BlogCard 
                  key={blog.id} 
                  id={blog.id} 
                  title={blog.title} 
                  img={blog.featured_image}
                  excerpt={blog.excerpt}
                  category={blog.category}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;
