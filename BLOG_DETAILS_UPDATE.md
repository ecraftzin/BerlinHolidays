# Blog Details Page Update

## File: `src/Pages/InnerPage/BlogDetails.jsx`

Replace the entire file content with the following code:

```jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { BiChevronsRight } from "react-icons/bi";
import BreadCrumb from "../../BreadCrumb/BreadCrumb";
import { getBlogPostById, incrementBlogPostViews } from "../../services";

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [parsedContent, setParsedContent] = useState(null);

  useEffect(() => {
    if (id) {
      fetchBlogPost();
    }
  }, [id]);

  const fetchBlogPost = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await getBlogPostById(id);

    if (error) {
      setError(error.message);
      console.error('Error fetching blog post:', error);
    } else if (data) {
      setBlog(data);
      
      // Try to parse content as JSON for structured content
      try {
        const content = JSON.parse(data.content);
        if (content.description || content.highlights) {
          setParsedContent(content);
        }
      } catch (e) {
        // Content is plain text, not JSON
        setParsedContent(null);
      }

      // Increment view count
      incrementBlogPostViews(id);
    } else {
      setError('Blog post not found');
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div>
        <BreadCrumb title="Blog Details" />
        <div className="dark:bg-lightBlack py-20 2xl:py-[120px]">
          <div className="Container flex justify-center">
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-khaki"></div>
              <p className="mt-4 text-gray dark:text-lightGray font-Lora">Loading blog post...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div>
        <BreadCrumb title="Blog Details" />
        <div className="dark:bg-lightBlack py-20 2xl:py-[120px]">
          <div className="Container flex justify-center">
            <div className="text-center py-20">
              <h2 className="text-2xl font-semibold text-red-500 font-Garamond">
                404 - Blog not found
              </h2>
              <p className="mt-4 text-gray dark:text-lightGray font-Lora">{error || 'The blog post you are looking for does not exist.'}</p>
              <Link
                to="/blog"
                className="mt-6 inline-block px-6 py-3 bg-khaki text-white rounded-lg hover:opacity-90 transition-all font-Lora"
              >
                Back to Blogs
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <BreadCrumb title="Blog Details" />
      <div className="dark:bg-lightBlack py-20 2xl:py-[120px]">
        <div className="Container flex justify-center">
          <div className="col-span-6 md:col-span-4 w-full max-w-4xl">
            <Link
              to="/blog"
              className="text-khaki mb-6 hover:underline underline-offset-2 block font-Lora"
            >
              ← Back to Blogs
            </Link>

            <div className="flex justify-center">
              <img
                src={blog.featured_image || "/images/home-1/blog1img.png"}
                alt={blog.title}
                className="w-auto h-auto mx-auto"
                data-aos="fade-up"
                data-aos-duration="1000"
                onError={(e) => {
                  e.target.src = "/images/home-1/blog1img.png";
                }}
              />
            </div>

            <div className="pt-5 lg:pt-[35px] pr-3">
              {blog.category && (
                <p className="text-base font-Garamond text-gray dark:text-lightGray uppercase">
                  {blog.category}
                </p>
              )}
              
              <h2 className="py-4 font-Garamond text-3xl text-lightBlack dark:text-white font-semibold">
                {blog.title}
              </h2>

              {blog.author && (
                <p className="text-sm text-gray dark:text-lightGray font-Lora mb-4">
                  By {blog.author} • {new Date(blog.published_at || blog.created_at).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              )}

              {parsedContent ? (
                // Structured content with highlights
                <>
                  {parsedContent.description && (
                    <p className="text-sm lg:text-base leading-6 text-gray dark:text-lightGray font-Lora">
                      {parsedContent.description}
                    </p>
                  )}

                  {parsedContent.highlights && parsedContent.highlights.length > 0 && (
                    <div className="pt-10">
                      <h2 className="pb-4 font-Garamond text-2xl text-lightBlack dark:text-white font-semibold">
                        Highlights
                      </h2>
                      <ul className="space-y-6">
                        {parsedContent.highlights.map((item, index) => (
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
                  )}

                  {parsedContent.tip && (
                    <div className="pt-10">
                      <p className="text-sm lg:text-base text-gray dark:text-lightGray font-Lora italic">
                        {parsedContent.tip}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                // Plain text content
                <div className="text-sm lg:text-base leading-6 text-gray dark:text-lightGray font-Lora whitespace-pre-wrap">
                  {blog.content}
                </div>
              )}

              {blog.views !== undefined && (
                <div className="pt-10 border-t border-gray-200 dark:border-gray-700 mt-10">
                  <p className="text-sm text-gray dark:text-lightGray font-Lora">
                    {blog.views} {blog.views === 1 ? 'view' : 'views'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
```

## Key Features

### 1. Database Integration
- Fetches blog post from Supabase using `getBlogPostById(id)`
- Increments view count when blog is viewed
- Handles loading and error states

### 2. Content Flexibility
- Supports **plain text content**: Simple blog posts with just text
- Supports **structured content**: Blog posts with description, highlights, and tips (stored as JSON)

### 3. Loading States
- Shows loading spinner while fetching data
- Displays error message if fetch fails
- Shows 404 page if blog not found

### 4. Metadata Display
- Shows category (if available)
- Shows author and publication date
- Shows view count

### 5. Image Handling
- Displays featured image from database
- Falls back to default image if URL is invalid
- Responsive image sizing

## Content Format Examples

### Plain Text Blog
When creating a blog in the admin dashboard, just enter plain text in the content field:

```
This is my blog post content. It can have multiple paragraphs.

This is another paragraph with more information.
```

### Structured Blog with Highlights
For blogs with highlights (like the original hardcoded blogs), store the content as a JSON string:

```json
{
  "description": "Wayanad, the emerald gem of Kerala, is a perfect escape for those seeking tranquility, luxury, and a touch of nature.",
  "highlights": [
    {
      "name": "Berlin Holidays Resort",
      "details": "Set amidst coffee plantations and mist-clad hills, Berlin Holidays blends modern comfort with Kerala's warm hospitality."
    },
    {
      "name": "Vythiri Village Resort",
      "details": "A five-star property known for its breathtaking treehouses, infinity pool, and Ayurvedic center."
    }
  ],
  "tip": "Travel Tip: Visit between October and February for the most pleasant weather and scenic greenery."
}
```

## Migration from Hardcoded Data

If you want to migrate the existing hardcoded blog data to the database:

1. Go to admin dashboard `/admin/blog`
2. For each hardcoded blog, create a new blog post
3. Use the structured JSON format for the content
4. Set the category, featured image, etc.
5. Click "Save & Publish"

## Testing

1. Create a simple blog post with plain text
2. View it on the website - should display correctly
3. Create a structured blog post with highlights
4. View it on the website - should display with highlights section
5. Check that view count increments on each visit

