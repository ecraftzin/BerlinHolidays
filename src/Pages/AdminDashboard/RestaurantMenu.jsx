// src/Pages/AdminDashboard/RestaurantMenu.jsx
import { useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaUtensils,
  FaLeaf,
  FaPepperHot,
  FaToggleOn,
  FaToggleOff,
  FaSave,
  FaCheckCircle,
  FaFilter,
  FaImage,
  FaUpload,
} from "react-icons/fa";
import Swal from "sweetalert2";
import {
  getAllMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleMenuItemAvailability,
  getActiveCategories,
  getCategoryCounts,
} from "../../services/menuService";

const RestaurantMenu = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [filterVeg, setFilterVeg] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category_name: "Breakfast",
    image_url: "",
    is_veg: true,
    spice_level: 0,
    is_available: true,
    is_active: true,
  });

  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
  }, []);

  const fetchMenuItems = async () => {
    setLoading(true);
    const { data, error } = await getAllMenuItems();
    if (error) {
      console.error("Error fetching menu items:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load menu items. Please try again.",
      });
    } else {
      setMenuItems(data || []);
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    const { data, error } = await getActiveCategories();
    if (!error && data) {
      setCategories(data);
    }

    // Get category counts
    const { data: counts } = await getCategoryCounts();
    if (counts) {
      setCategoryCounts(counts);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      Swal.fire({
        icon: "error",
        title: "Invalid File Type",
        text: "Please upload a valid image file (JPEG, PNG, WebP, or GIF)",
      });
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      Swal.fire({
        icon: "error",
        title: "File Too Large",
        text: "Image size should not exceed 5MB",
      });
      return;
    }

    setUploadingImage(true);

    try {
      // Create a local URL for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Convert image to base64 and store in formData
      const base64 = await convertToBase64(file);
      setFormData((prev) => ({
        ...prev,
        image_url: base64,
      }));

      Swal.fire({
        icon: "success",
        title: "Image Uploaded",
        text: "Image uploaded successfully!",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "Failed to upload image. Please try again.",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      image_url: "",
    }));
    setImagePreview("");
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      description: item.description || "",
      price: item.price,
      category_name: item.category_name,
      image_url: item.image_url || "",
      is_veg: item.is_veg,
      spice_level: item.spice_level,
      is_available: item.is_available,
      is_active: item.is_active,
    });
    setImagePreview(item.image_url || "");
    setShowModal(true);
  };

  const handleDeleteItem = async (itemId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This menu item will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#006938",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      const { error } = await deleteMenuItem(itemId);
      if (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to delete menu item. Please try again.",
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Menu item has been deleted successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
        fetchMenuItems();
        fetchCategories();
      }
    }
  };

  const handleToggleAvailability = async (itemId, currentStatus) => {
    const { error } = await toggleMenuItemAvailability(itemId, !currentStatus);
    if (!error) {
      fetchMenuItems();
    }
  };

  const handleSaveItem = async () => {
    // Validation
    if (!formData.name.trim() || !formData.price || !formData.category_name) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill in all required fields (Name, Price, Category).",
      });
      return;
    }

    const itemData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category_name: formData.category_name,
      image_url: formData.image_url,
      is_veg: formData.is_veg,
      spice_level: parseInt(formData.spice_level),
      is_available: formData.is_available,
      is_active: formData.is_active,
    };

    let result;
    if (selectedItem) {
      // Update existing item
      result = await updateMenuItem(selectedItem.id, itemData);
    } else {
      // Create new item
      result = await createMenuItem(itemData);
    }

    if (result.error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Failed to ${selectedItem ? "update" : "create"} menu item. Please try again.`,
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: `Menu item ${selectedItem ? "updated" : "created"} successfully!`,
        timer: 2000,
        showConfirmButton: false,
      });
      handleCloseModal();
      fetchMenuItems();
      fetchCategories();
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setImagePreview("");
    setFormData({
      name: "",
      description: "",
      price: "",
      category_name: "Breakfast",
      image_url: "",
      is_veg: true,
      spice_level: 0,
      is_available: true,
      is_active: true,
    });
  };

  const getSpiceIndicator = (level) => {
    return Array(level).fill("🌶️").join("");
  };

  // Filter menu items based on active category and veg filter
  const filteredItems = menuItems.filter((item) => {
    const categoryMatch =
      activeCategory === "all" || item.category_name.toLowerCase() === activeCategory.toLowerCase();
    const vegMatch = !filterVeg || item.is_veg;
    return categoryMatch && vegMatch;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-Garamond" style={{ color: "#1e1e1e" }}>
            Restaurant Menu
          </h1>
          <p className="text-gray-600 font-Lora mt-1">
            Manage your restaurant menu items and categories
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all shadow-md flex items-center space-x-2"
            style={{ backgroundColor: "#006938" }}
          >
            <FaPlus />
            <span>Add Menu Item</span>
          </button>
        </div>
      </div>

      {/* Categories and Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-lg font-Lora font-semibold transition-all ${
                activeCategory === "all"
                  ? "text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              style={
                activeCategory === "all"
                  ? { backgroundColor: "#c49e72" }
                  : {}
              }
            >
              All Items ({menuItems.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.name)}
                className={`px-4 py-2 rounded-lg font-Lora font-semibold transition-all ${
                  activeCategory === cat.name
                    ? "text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                style={
                  activeCategory === cat.name
                    ? { backgroundColor: "#c49e72" }
                    : {}
                }
              >
                {cat.name} ({categoryCounts[cat.name] || 0})
              </button>
            ))}
          </div>

          {/* Veg Filter */}
          <button
            onClick={() => setFilterVeg(!filterVeg)}
            className={`px-4 py-2 rounded-lg font-Lora font-semibold transition-all flex items-center space-x-2 ${
              filterVeg
                ? "text-white shadow-md"
                : "text-gray-600 border-2 border-gray-200 hover:bg-gray-100"
            }`}
            style={filterVeg ? { backgroundColor: "#006938" } : {}}
          >
            <FaLeaf />
            <span>Veg Only</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2" style={{ borderColor: "#006938" }}></div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-md">
          <FaUtensils className="mx-auto text-6xl mb-4" style={{ color: "#c49e72" }} />
          <h3 className="text-xl font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
            No Menu Items Yet
          </h3>
          <p className="text-gray-600 font-Lora mb-6">
            Get started by creating your first menu item
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all shadow-md"
            style={{ backgroundColor: "#006938" }}
          >
            <FaPlus className="inline mr-2" />
            Create First Menu Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Item Image */}
              {item.image_url ? (
                <div className="h-48 overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <FaUtensils className="text-6xl text-gray-400" />
                </div>
              )}

              {/* Item Details */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-bold font-Garamond" style={{ color: "#1e1e1e" }}>
                        {item.name}
                      </h3>
                      {item.is_veg && (
                        <span className="w-5 h-5 border-2 border-green-600 flex items-center justify-center">
                          <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 font-Lora">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Item Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 font-Lora">Category</span>
                    <span className="px-2 py-1 rounded-full text-xs font-Lora bg-gray-100 text-gray-700 capitalize">
                      {item.category_name}
                    </span>
                  </div>
                  {item.spice_level > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 font-Lora">Spice Level</span>
                      <span className="text-sm">{getSpiceIndicator(item.spice_level)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 font-Lora">Availability</span>
                    <button
                      onClick={() => handleToggleAvailability(item.id, item.is_available)}
                      className="flex items-center space-x-1"
                    >
                      {item.is_available ? (
                        <FaToggleOn className="text-2xl" style={{ color: "#006938" }} />
                      ) : (
                        <FaToggleOff className="text-2xl text-gray-400" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 font-Lora">Status</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold font-Lora ${
                        item.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {item.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: "#f7f5f2" }}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 font-Lora">Price</span>
                    <span className="text-2xl font-bold font-Garamond" style={{ color: "#006938" }}>
                      ₹{item.price}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditItem(item)}
                    className="flex-1 px-4 py-2 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all"
                    style={{ backgroundColor: "#c49e72" }}
                  >
                    <FaEdit className="inline mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="px-4 py-2 rounded-lg border-2 border-red-500 text-red-500 font-Lora font-semibold hover:bg-red-50 transition-all"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold font-Garamond" style={{ color: "#1e1e1e" }}>
                {selectedItem ? "Edit Menu Item" : "Add Menu Item"}
              </h2>
            </div>

            <div className="p-6">
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Item Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                      style={{ borderColor: "#c49e72" }}
                      placeholder="e.g., Kerala Breakfast Platter"
                    />
                  </div>

                  {/* Item Image Upload */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Item Image
                    </label>

                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="mb-4 relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg border-2"
                          style={{ borderColor: "#c49e72" }}
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}

                    {/* Upload Button */}
                    <div className="flex gap-3">
                      <label
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer hover:bg-opacity-10 transition-colors font-Garamond font-medium"
                        style={{ borderColor: "#c49e72", color: "#006938" }}
                      >
                        <FaUpload />
                        {uploadingImage ? "Uploading..." : "Upload Image"}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={uploadingImage}
                        />
                      </label>
                    </div>

                    {/* OR Divider */}
                    <div className="flex items-center gap-3 my-3">
                      <hr className="flex-1 border-gray-300" />
                      <span className="text-xs text-gray-500 font-Lora">OR</span>
                      <hr className="flex-1 border-gray-300" />
                    </div>

                    {/* Image URL Input */}
                    <input
                      type="text"
                      name="image_url"
                      value={formData.image_url}
                      onChange={(e) => {
                        handleInputChange(e);
                        setImagePreview(e.target.value);
                      }}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                      style={{ borderColor: "#c49e72" }}
                      placeholder="Or paste image URL here"
                    />
                    <p className="text-xs text-gray-500 font-Lora mt-1">
                      Upload an image or enter an image URL
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category_name"
                      value={formData.category_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                      style={{ borderColor: "#c49e72" }}
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                      style={{ borderColor: "#c49e72" }}
                      placeholder="350"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Spice Level
                    </label>
                    <select
                      name="spice_level"
                      value={formData.spice_level}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                      style={{ borderColor: "#c49e72" }}
                    >
                      <option value="0">None</option>
                      <option value="1">Mild 🌶️</option>
                      <option value="2">Medium 🌶️🌶️</option>
                      <option value="3">Hot 🌶️🌶️🌶️</option>
                    </select>
                  </div>

                  <div className="flex flex-col space-y-3">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="is_veg"
                        checked={formData.is_veg}
                        onChange={handleInputChange}
                        className="w-5 h-5 rounded"
                        style={{ accentColor: "#006938" }}
                      />
                      <span className="text-sm font-Lora" style={{ color: "#1e1e1e" }}>
                        Vegetarian
                      </span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="is_available"
                        checked={formData.is_available}
                        onChange={handleInputChange}
                        className="w-5 h-5 rounded"
                        style={{ accentColor: "#006938" }}
                      />
                      <span className="text-sm font-Lora" style={{ color: "#1e1e1e" }}>
                        Available
                      </span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleInputChange}
                        className="w-5 h-5 rounded"
                        style={{ accentColor: "#006938" }}
                      />
                      <span className="text-sm font-Lora" style={{ color: "#1e1e1e" }}>
                        Active (Show on website)
                      </span>
                    </label>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Description
                    </label>
                    <textarea
                      rows="3"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora resize-none"
                      style={{ borderColor: "#c49e72" }}
                      placeholder="Enter item description"
                    ></textarea>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleSaveItem}
                    className="flex-1 px-6 py-3 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all shadow-md"
                    style={{ backgroundColor: "#006938" }}
                  >
                    <FaCheckCircle className="inline mr-2" />
                    {selectedItem ? "Update Item" : "Save & Publish"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-600 font-Lora font-semibold hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantMenu;

