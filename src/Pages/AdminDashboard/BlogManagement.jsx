// src/Pages/AdminDashboard/BlogManagement.jsx
import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSearch,
  FaFilter,
  FaCalendar,
  FaUser,
  FaTimes,
  FaImage,
  FaUpload,
  FaCog,
} from "react-icons/fa";
import Swal from "sweetalert2";
import {
  getAllBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getAllBlogCategories,
  createBlogCategory,
  deleteBlogCategory,
  uploadImage,
} from "../../services";

const BlogManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [blogPosts, setBlogPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    category_id: "",
    featured_image: "",
    content: "",
    excerpt: "",
    author: "Admin",
  });

  // Fetch blog posts and categories on mount
  useEffect(() => {
    fetchBlogPosts();
    fetchCategories();
  }, []);

  const fetchBlogPosts = async () => {
    setLoading(true);
    const { data, error } = await getAllBlogPosts();
    if (error) {
      console.error("Error fetching blog posts:", error);
      Swal.fire("Error", "Failed to fetch blog posts", "error");
    } else {
      setBlogPosts(data || []);
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    const { data, error } = await getAllBlogCategories();
    if (error) {
      console.error("Error fetching categories:", error);
    } else {
      setCategories(data || []);
    }
  };

  // Handler functions
  const handleViewPost = (post) => {
    setSelectedPost(post);
    setShowViewModal(true);
  };

  const handleEditPost = (post) => {
    setSelectedPost(post);
    setFormData({
      title: post.title || "",
      category_id: post.category_id || "",
      featured_image: post.featured_image || "",
      content: post.content || "",
      excerpt: post.excerpt || "",
      author: post.author || "Admin",
    });
    // Set image preview if featured image exists
    if (post.featured_image) {
      setImagePreview(post.featured_image);
    }
    setShowCreateModal(true);
  };

  const handleDeletePost = async (postId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#006938",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      const { error } = await deleteBlogPost(postId);
      if (error) {
        Swal.fire("Error", "Failed to delete blog post", "error");
      } else {
        Swal.fire("Deleted!", "Blog post has been deleted.", "success");
        fetchBlogPosts();
      }
    }
  };

  const handleCloseModals = () => {
    setShowCreateModal(false);
    setShowViewModal(false);
    setShowCategoryModal(false);
    setSelectedPost(null);
    setImagePreview(null);
    setFormData({
      title: "",
      category_id: "",
      featured_image: "",
      content: "",
      excerpt: "",
      author: "Admin",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      Swal.fire("Error", "Please upload a valid image file (JPEG, PNG, WebP, or GIF)", "error");
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      Swal.fire("Error", "Image size must be less than 5MB", "error");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);

    // Upload to Supabase
    setUploadingImage(true);
    try {
      const { data, error } = await uploadImage(file, 'blog-images', 'featured');

      if (error) {
        throw error;
      }

      // Update form data with uploaded image URL
      setFormData((prev) => ({
        ...prev,
        featured_image: data.publicUrl,
      }));

      Swal.fire("Success", "Image uploaded successfully!", "success");
    } catch (error) {
      console.error("Error uploading image:", error);
      Swal.fire(
        "Error",
        error.message || "Failed to upload image. Please make sure the 'blog-images' storage bucket exists in Supabase.",
        "error"
      );
      setImagePreview(null);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSavePost = async (isDraft = false) => {
    // Validation
    if (!formData.title || !formData.category_id || !formData.content) {
      Swal.fire("Error", "Please fill in all required fields", "error");
      return;
    }

    const postData = {
      ...formData,
      slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    };

    let result;
    if (selectedPost) {
      result = await updateBlogPost(selectedPost.id, postData, isDraft);
    } else {
      result = await createBlogPost(postData, isDraft);
    }

    if (result.error) {
      Swal.fire("Error", "Failed to save blog post", "error");
    } else {
      Swal.fire(
        "Success",
        `Blog post ${isDraft ? "saved as draft" : "published"} successfully!`,
        "success"
      );
      handleCloseModals();
      fetchBlogPosts();
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      Swal.fire("Error", "Please enter a category name", "error");
      return;
    }

    const categoryData = {
      name: newCategory.trim(),
      slug: newCategory.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      is_active: true,
    };

    const { error } = await createBlogCategory(categoryData);
    if (error) {
      Swal.fire("Error", "Failed to create category", "error");
    } else {
      Swal.fire("Success", "Category created successfully!", "success");
      setNewCategory("");
      fetchCategories();
    }
  };

  const handleDeleteCategory = async (categoryId, categoryName) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Delete category "${categoryName}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#006938",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      const { error } = await deleteBlogCategory(categoryId);
      if (error) {
        Swal.fire("Error", "Failed to delete category", "error");
      } else {
        Swal.fire("Deleted!", "Category has been deleted.", "success");
        fetchCategories();
      }
    }
  };

  // Filter posts
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || post.status?.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-Garamond" style={{ color: "#1e1e1e" }}>
            Blog Management
          </h1>
          <p className="text-gray-600 font-Lora mt-1">
            Manage your blog posts and content
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <button
            onClick={() => setShowCategoryModal(true)}
            className="px-6 py-3 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all shadow-md flex items-center space-x-2"
            style={{ backgroundColor: "#c49e72" }}
          >
            <FaCog />
            <span>Manage Categories</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all shadow-md flex items-center space-x-2"
            style={{ backgroundColor: "#006938" }}
          >
            <FaPlus />
            <span>Create New Post</span>
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search blog posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                style={{ borderColor: "#c49e72" }}
              />
            </div>
          </div>

          {/* Filter */}
          <div className="relative">
            <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora appearance-none"
              style={{ borderColor: "#c49e72" }}
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Blog Posts Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 font-Lora">Loading blog posts...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 font-Lora">No blog posts found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: "#f7f5f2" }}>
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold font-Garamond" style={{ color: "#1e1e1e" }}>
                    Post
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold font-Garamond" style={{ color: "#1e1e1e" }}>
                    Author
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold font-Garamond" style={{ color: "#1e1e1e" }}>
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold font-Garamond" style={{ color: "#1e1e1e" }}>
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold font-Garamond" style={{ color: "#1e1e1e" }}>
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold font-Garamond" style={{ color: "#1e1e1e" }}>
                    Views
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold font-Garamond" style={{ color: "#1e1e1e" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-16 h-16 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden">
                          {post.featured_image && (
                            <img
                              src={post.featured_image}
                              alt={post.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold font-Garamond" style={{ color: "#1e1e1e" }}>
                            {post.title}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <FaUser className="text-gray-400" />
                        <span className="text-sm font-Lora text-gray-600">{post.author || "Admin"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-Lora font-semibold bg-gray-100 text-gray-700">
                        {post.category_name || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <FaCalendar className="text-gray-400 text-sm" />
                        <span className="text-sm font-Lora text-gray-600">
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-Lora font-semibold ${
                          post.status === "published"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <FaEye className="text-gray-400" />
                        <span className="text-sm font-Lora text-gray-600">{post.views || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleViewPost(post)}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          style={{ color: "#006938" }}
                          title="View"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleEditPost(post)}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          style={{ color: "#c49e72" }}
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-red-500"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && filteredPosts.length > 0 && (
        <div className="flex items-center justify-between bg-white rounded-xl shadow-md p-4 border border-gray-100">
          <p className="text-sm text-gray-600 font-Lora">
            Showing <span className="font-semibold">1-{filteredPosts.length}</span> of{" "}
            <span className="font-semibold">{filteredPosts.length}</span> posts
          </p>
          <div className="flex space-x-2">
            <button className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 font-Lora hover:bg-gray-50 transition-colors">
              Previous
            </button>
            <button
              className="px-4 py-2 rounded-lg text-white font-Lora hover:opacity-90 transition-colors"
              style={{ backgroundColor: "#c49e72" }}
            >
              1
            </button>
            <button className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 font-Lora hover:bg-gray-50 transition-colors">
              Next
            </button>
          </div>
        </div>
      )}

      {/* View Post Modal */}
      {showViewModal && selectedPost && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 flex justify-between items-center" style={{ backgroundColor: "#f7f5f2" }}>
              <h2 className="text-2xl font-bold font-Garamond" style={{ color: "#1e1e1e" }}>
                View Blog Post
              </h2>
              <button
                onClick={handleCloseModals}
                className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {/* Post Image */}
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 font-Lora">Post Image</span>
              </div>

              {/* Post Title */}
              <div>
                <h3 className="text-3xl font-bold font-Garamond" style={{ color: "#1e1e1e" }}>
                  {selectedPost.title}
                </h3>
              </div>

              {/* Post Meta */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 font-Lora">
                <div className="flex items-center space-x-2">
                  <FaUser className="text-gray-400" />
                  <span>{selectedPost.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaCalendar className="text-gray-400" />
                  <span>{selectedPost.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaEye className="text-gray-400" />
                  <span>{selectedPost.views} views</span>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                  {selectedPost.category_name || 'Uncategorized'}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedPost.status === "Published"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {selectedPost.status}
                </span>
              </div>

              {/* Post Content */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-gray-700 font-Lora leading-relaxed">
                  {selectedPost.content}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  handleCloseModals();
                  handleEditPost(selectedPost);
                }}
                className="px-6 py-3 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all"
                style={{ backgroundColor: "#c49e72" }}
              >
                <FaEdit className="inline mr-2" />
                Edit Post
              </button>
              <button
                onClick={handleCloseModals}
                className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-Lora font-semibold hover:bg-gray-50 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 flex justify-between items-center" style={{ backgroundColor: "#f7f5f2" }}>
              <h2 className="text-2xl font-bold font-Garamond" style={{ color: "#1e1e1e" }}>
                {selectedPost ? "Edit Blog Post" : "Create New Blog Post"}
              </h2>
              <button
                onClick={handleCloseModals}
                className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <form className="space-y-6">
                {/* Post Title */}
                <div>
                  <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                    Post Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                    style={{ borderColor: "#c49e72" }}
                    placeholder="Enter post title"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                    style={{ borderColor: "#c49e72" }}
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Featured Image */}
                <div>
                  <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                    Featured Image
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      name="featured_image"
                      value={formData.featured_image}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                      style={{ borderColor: "#c49e72" }}
                      placeholder="https://example.com/image.jpg or upload"
                    />
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById('image-upload').click()}
                      disabled={uploadingImage}
                      className="px-6 py-3 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: "#c49e72" }}
                    >
                      <FaUpload />
                      <span>{uploadingImage ? "Uploading..." : "Upload"}</span>
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 font-Lora mt-1">
                    Upload an image or enter a URL. Recommended: 1200x800px, max 5MB
                  </p>

                  {/* Image Preview */}
                  {(imagePreview || formData.featured_image) && (
                    <div className="mt-3">
                      <img
                        src={imagePreview || formData.featured_image}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                    Excerpt
                  </label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                    style={{ borderColor: "#c49e72" }}
                    placeholder="Brief summary of the post"
                  ></textarea>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                    Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows="8"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                    style={{ borderColor: "#c49e72" }}
                    placeholder="Enter post content"
                  ></textarea>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => handleSavePost(false)}
                    className="flex-1 px-6 py-3 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all shadow-md"
                    style={{ backgroundColor: "#006938" }}
                  >
                    Save & Publish
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSavePost(true)}
                    className="flex-1 px-6 py-3 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all shadow-md"
                    style={{ backgroundColor: "#c49e72" }}
                  >
                    Save as Draft
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModals}
                    className="flex-1 px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-Lora font-semibold hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Category Management Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div
              className="p-6 border-b border-gray-200 flex justify-between items-center"
              style={{ backgroundColor: "#f7f5f2" }}
            >
              <h2 className="text-2xl font-bold font-Garamond" style={{ color: "#1e1e1e" }}>
                Manage Blog Categories
              </h2>
              <button onClick={handleCloseModals} className="p-2 rounded-lg hover:bg-gray-200 transition-colors">
                <FaTimes size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Add New Category */}
              <div>
                <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                  Add New Category
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddCategory();
                      }
                    }}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                    style={{ borderColor: "#c49e72" }}
                    placeholder="Enter category name"
                  />
                  <button
                    onClick={handleAddCategory}
                    className="px-6 py-3 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all shadow-md flex items-center space-x-2"
                    style={{ backgroundColor: "#006938" }}
                  >
                    <FaPlus />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Categories List */}
              <div>
                <h3 className="text-lg font-semibold font-Garamond mb-3" style={{ color: "#1e1e1e" }}>
                  Existing Categories
                </h3>
                {categories.length === 0 ? (
                  <p className="text-gray-500 font-Lora text-center py-8">No categories yet</p>
                ) : (
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="font-Lora text-gray-700">{category.name}</span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-Lora ${
                              category.is_active
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {category.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteCategory(category.id, category.name)}
                          className="p-2 rounded-lg hover:bg-red-50 transition-colors text-red-500"
                          title="Delete Category"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={handleCloseModals}
                className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-Lora font-semibold hover:bg-gray-50 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManagement;

