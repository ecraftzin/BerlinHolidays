import { useParams, Link } from "react-router-dom";
import { BiChevronsRight } from "react-icons/bi";
import BreadCrumb from "../../BreadCrumb/BreadCrumb";

const BLOGS = [
  {
    id: 1,
    category: "LUXURY RESORTS",
    img: "/images/home-1/blog1img.png",
    title: "Top 5 Luxury Resorts in Wayanad for Your Next Getaway",
    description:
      "Wayanad, the emerald gem of Kerala, is a perfect escape for those seeking tranquility, luxury, and a touch of nature. Here are the top five luxury resorts that promise an unforgettable stay in the Western Ghats.",
    highlights: [
      {
        name: "Berlin Holidays Resort",
        details:
          "Set amidst coffee plantations and mist-clad hills, Berlin Holidays blends modern comfort with Kerala’s warm hospitality. With private pool villas, Ayurvedic spa sessions, and plantation walks, it’s the ideal choice for couples and families alike.",
      },
      {
        name: "Vythiri Village Resort",
        details:
          "A five-star property known for its breathtaking treehouses, infinity pool, and Ayurvedic center. Perfect for travelers who want a blend of nature and luxury.",
      },
      {
        name: "The Windflower Resort & Spa",
        details:
          "Tucked deep in the hills, this resort offers rejuvenating spa therapies, yoga sessions, and panoramic valley views.",
      },
      {
        name: "Mount Xanadu Resort",
        details:
          "A boutique luxury retreat surrounded by waterfalls, caves, and plantations — ideal for adventure seekers.",
      },
      {
        name: "Wayanad Silverwoods",
        details:
          "Known for its beautiful Banasura lakefront villas, this eco-luxury resort offers serenity, privacy, and spectacular sunrise views.",
      },
    ],
    tip: "Travel Tip: Visit between October and February for the most pleasant weather and scenic greenery.",
  },
  {
    id: 2,
    category: "FINE DINING",
    img: "/images/home-1/blog2img.png",
    title: "A Taste of Luxury: Fine Dining Experiences in Wayanad",
    description:
      "Luxury dining in Wayanad isn’t just about food — it’s about culture, creativity, and comfort.",
    highlights: [
      {
        name: "Berlin Holidays Restaurant",
        details:"Known for its signature fusion cuisine, Berlin Holidays offers everything from Malabar seafood platters to continental fine dining, all served with elegance and local flair."
      },
      {
name:"Farm-Fresh Ingredients",
details:"Many resorts in Wayanad grow their own herbs, spices, and vegetables, ensuring that every dish is as fresh as it is flavorful."
      },
      {
name:"Romantic & Private Dining",
details:"Experience candlelight dinners under the stars or beside a pool with personalized menus and curated wine selections.",
      }
    ],
    tip: "Taste Tip: Don’t miss Kerala’s classics — Puttu & Kadala Curry, Appam with Stew, and freshly brewed plantation coffee.",
  },
  {
    id: 3,
    category: "WELLNESS RETREATS",
    img: "/images/home-1/blog3img.png",
    title: "Wellness Retreats in Wayanad: Reconnect, Relax & Recharge",
    description:
      "Wayanad’s natural charm makes it one of India’s most sought-after wellness destinations. Nestled between mountains and forests, resorts here offer holistic experiences for both mind and body.",
    highlights: [
       {
        name: "Ayurvedic Therapies",
        details:"Traditional Kerala Ayurveda takes center stage — from full-body massages to detox programs and herbal steam baths that heal naturally."
      },
      {
name:"Yoga & Meditation",
details:"Morning yoga sessions amidst the mist and birdsong help guests find balance, while guided meditation reconnects them to inner peace."
      },
      {
name:"Organic Dining",
details:"Resorts like Berlin Holidays serve farm-to-table organic meals using locally grown produce and spices — ensuring wellness from within.",
      }
    ],
    tip: "Pro Tip: Choose a wellness package that includes Ayurvedic consultation for the best personalized experience.",
  },
  {
    id: 4,
    category: "KERALA ESCAPES",
    img: "/images/home-1/blog4img.png",
    title: "Kerala Escapes: Luxury in the Lap of Nature",
    description:
      "Kerala — “God’s Own Country” — offers a world of luxury experiences wrapped in nature’s beauty. Here’s why it’s one of the top luxury travel destinations in India.",
    highlights: [
       {
        name: "Backwater Bliss in Alleppey",
        details:"Experience private houseboats with air-conditioned suites, onboard chefs, and sunset views over calm lagoons."
      },
      {
name:"Beachfront Opulence in Kovalam",
details:"Relax at ocean-view resorts offering spa treatments, private cabanas, and candlelight dinners by the Arabian Sea."
      },
      {
name:"Adventure & Exploration",
details:"Enjoy trekking at Chembra Peak, boating in Pookode Lake, or wildlife spotting in the Wayanad Sanctuary — all within easy reach of major resorts.",
      }
    ],
    tip: "Travel Tip: Kerala’s best season for luxury stays is between October and March, when the weather is cool, green, and perfect for outdoor experiences.",
  },
];

const BlogDetails = () => {
  const { id } = useParams();
  const blog = BLOGS.find((b) => b.id === Number(id));

  if (!blog)
    return (
      <h2 className="text-center py-20 text-2xl font-semibold text-red-500">
        404 - Blog not found
      </h2>
    );

  return (
    <div>
      <BreadCrumb title="Blog Details" />
      <div className="dark:bg-lightBlack py-20 2xl:py-[120px]">
        <div className="Container flex justify-center">
          <div className="col-span-6 md:col-span-4 w-full max-w-4xl">
            <Link
              to="/blog"
              className="text-khaki mb-6 hover:underline underline-offset-2 block"
            >
              ← Back to Blogs
            </Link>

            <div className="flex justify-center">
              <img
                src={blog.img}
                alt={blog.title}
                className="w-auto h-auto mx-auto"
                data-aos="fade-up"
                data-aos-duration="1000"
              />
            </div>

            <div className="pt-5 lg:pt-[35px] pr-3">
              <p className="text-base font-Garamond text-gray dark:text-lightGray">
                {blog.category}
              </p>
              <h2 className="py-4 font-Garamond text-3xl text-lightBlack dark:text-white font-semibold">
                {blog.title}
              </h2>
              <p className="text-sm lg:text-base leading-6 text-gray dark:text-lightGray font-Lora">
                {blog.description}
              </p>

              <div className="pt-10">
                <h2 className="pb-4 font-Garamond text-2xl text-lightBlack dark:text-white font-semibold">
                  Highlights
                </h2>
                 <ul className="space-y-6">
                  {blog.highlights.map((item, index) => (
                    <li key={index}>
                      <div className="flex items-center mb-2">
                        <BiChevronsRight
                          size={18}
                          className="text-khaki mr-2"
                        />
                        <span className="text-lg font-semibold text-lightBlack dark:text-white font-Garamond">
                          {item.name}
                        </span>
                      </div>
                      <p className="text-sm lg:text-base text-gray dark:text-lightGray font-Lora ml-6">
                        {item.details}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-10">
                <p className="text-sm lg:text-base text-gray dark:text-lightGray font-Lora">
                  {blog.tip}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
