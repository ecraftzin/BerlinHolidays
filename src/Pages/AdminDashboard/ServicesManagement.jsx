// src/Pages/AdminDashboard/ServicesManagement.jsx
import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaImage, FaSave, FaFileAlt, FaTags } from "react-icons/fa";
import { getAllServices, createService, updateService, deleteService } from "../../services/servicesService";
import { uploadImage, deleteImage } from "../../services/storageService";
import { getAllCategories, createCategory, deleteCategory } from "../../services/serviceCategoriesService";
import { useDarkMode } from "../../Context/DarkModeContext";

const ServicesManagement = () => {
  const { isDarkMode } = useDarkMode();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");

  const [formData, setFormData] = useState({
    image: "",
    number: 1,
    category: "",
    heading: "",
    description: "",
    status: "draft",
  });

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    const { data, error } = await getAllServices();
    if (error) {
      console.error("Error fetching services:", error);
      alert("Failed to load services");
    } else {
      setServices(data || []);
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    const { data, error } = await getAllCategories();
    if (error) {
      console.error("Error fetching categories:", error);
    } else {
      setCategories(data || []);
    }
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

    setUploadingImage(true);
    const { data, error } = await uploadImage(file, "services-images", "services");

    if (error) {
      alert("Failed to upload image: " + error.message);
      setUploadingImage(false);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      image: data.publicUrl,
    }));
    setImagePreview(data.publicUrl);
    setUploadingImage(false);
  };

  const handleSubmit = async (status) => {
    if (!formData.category || !formData.heading) {
      alert("Please fill in all required fields (Category and Heading)");
      return;
    }

    const serviceData = {
      ...formData,
      status,
      number: parseInt(formData.number),
    };

    let result;
    if (editingService) {
      result = await updateService(editingService.id, serviceData);
    } else {
      result = await createService(serviceData);
    }

    if (result.error) {
      alert(`Failed to ${editingService ? "update" : "create"} service`);
      return;
    }

    alert(`Service ${editingService ? "updated" : "created"} successfully!`);
    setShowModal(false);
    resetForm();
    fetchServices();
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      image: service.image || "",
      number: service.number || 1,
      category: service.category || "",
      heading: service.heading || "",
      description: service.description || "",
      status: service.status || "draft",
    });
    setImagePreview(service.image);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) {
      return;
    }

    const { error } = await deleteService(id);
    if (error) {
      alert("Failed to delete service");
      return;
    }

    alert("Service deleted successfully!");
    fetchServices();
  };

  const resetForm = () => {
    setFormData({
      image: "",
      number: 1,
      category: "",
      heading: "",
      description: "",
      status: "draft",
    });
    setEditingService(null);
    setImagePreview(null);
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      alert("Please enter a category name");
      return;
    }

    const { data, error } = await createCategory(newCategoryName);
    if (error) {
      if (error.code === '23505') {
        alert("This category already exists");
      } else {
        alert("Failed to create category");
      }
      return;
    }

    alert("Category created successfully!");
    setNewCategoryName("");
    fetchCategories();
  };

  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the category "${name}"?`)) {
      return;
    }

    const { error } = await deleteCategory(id);
    if (error) {
      alert("Failed to delete category. It may be in use by existing services.");
      return;
    }

    alert("Category deleted successfully!");
    fetchCategories();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-Garamond" style={{ color: "#1e1e1e" }}>
            Services Management
          </h1>
          <p className="text-gray-600 font-Lora mt-1">
            Manage your resort services and facilities
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button
            onClick={() => setShowCategoryModal(true)}
            className="px-6 py-3 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all shadow-md flex items-center space-x-2"
            style={{ backgroundColor: "#c49e72" }}
          >
            <FaTags />
            <span>Manage Categories</span>
          </button>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="px-6 py-3 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all shadow-md flex items-center space-x-2"
            style={{ backgroundColor: "#006938" }}
          >
            <FaPlus />
            <span>Add Service</span>
          </button>
        </div>
      </div>

      {/* Services List */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4" style={{ borderColor: "#c49e72" }}></div>
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow-md">
          <p className="text-gray-600 font-Lora text-lg">No services found. Add your first service!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Service Image */}
              {service.image && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.heading}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl"
                    style={{ backgroundColor: "#c49e72" }}
                  >
                    {service.number}
                  </div>
                </div>
              )}

              {/* Service Content */}
              <div className="p-6">
                <div className="mb-3">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: "#006938" }}
                  >
                    {service.category}
                  </span>
                  <span
                    className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${
                      service.status === "published"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {service.status}
                  </span>
                </div>

                <h3 className="text-xl font-bold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                  {service.heading}
                </h3>

                <p className="text-sm text-gray-600 font-Lora mb-4 line-clamp-3">
                  {service.description}
                </p>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(service)}
                    className="flex-1 px-4 py-2 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all"
                    style={{ backgroundColor: "#c49e72" }}
                  >
                    <FaEdit className="inline mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold font-Garamond" style={{ color: "#1e1e1e" }}>
                {editingService ? "Edit Service" : "Add New Service"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold font-Lora mb-2" style={{ color: "#1e1e1e" }}>
                  Service Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {imagePreview ? (
                    <div className="relative">
                      <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded" />
                      <button
                        onClick={() => {
                          setImagePreview(null);
                          setFormData((prev) => ({ ...prev, image: "" }));
                        }}
                        className="mt-2 text-red-500 hover:text-red-700 font-Lora"
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <div>
                      <FaImage className="mx-auto text-4xl text-gray-400 mb-2" />
                      <label className="cursor-pointer">
                        <span className="text-sm font-Lora" style={{ color: "#006938" }}>
                          {uploadingImage ? "Uploading..." : "Click to upload image"}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={uploadingImage}
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Number */}
              <div>
                <label className="block text-sm font-semibold font-Lora mb-2" style={{ color: "#1e1e1e" }}>
                  Number *
                </label>
                <input
                  type="number"
                  name="number"
                  value={formData.number}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 font-Lora"
                  style={{ focusRingColor: "#006938" }}
                  min="1"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold font-Lora mb-2" style={{ color: "#1e1e1e" }}>
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 font-Lora"
                  style={{ focusRingColor: "#006938" }}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1 font-Lora">
                  Don't see your category? Click "Manage Categories" to add one.
                </p>
              </div>

              {/* Heading */}
              <div>
                <label className="block text-sm font-semibold font-Lora mb-2" style={{ color: "#1e1e1e" }}>
                  Heading *
                </label>
                <input
                  type="text"
                  name="heading"
                  value={formData.heading}
                  onChange={handleInputChange}
                  placeholder="e.g., Gym & Wellness Center"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 font-Lora"
                  style={{ focusRingColor: "#006938" }}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold font-Lora mb-2" style={{ color: "#1e1e1e" }}>
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Enter service description..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 font-Lora"
                  style={{ focusRingColor: "#006938" }}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => handleSubmit("published")}
                  className="flex-1 px-6 py-3 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all flex items-center justify-center space-x-2"
                  style={{ backgroundColor: "#006938" }}
                >
                  <FaSave />
                  <span>Save & Publish</span>
                </button>
                <button
                  onClick={() => handleSubmit("draft")}
                  className="flex-1 px-6 py-3 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all flex items-center justify-center space-x-2"
                  style={{ backgroundColor: "#c49e72" }}
                >
                  <FaFileAlt />
                  <span>Save as Draft</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Management Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold font-Garamond" style={{ color: "#1e1e1e" }}>
                Manage Categories
              </h2>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Add New Category */}
              <div>
                <label className="block text-sm font-semibold font-Lora mb-2" style={{ color: "#1e1e1e" }}>
                  Add New Category
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="e.g., FITNESS, LEISURE, DINING"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 font-Lora"
                    style={{ focusRingColor: "#006938" }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddCategory();
                      }
                    }}
                  />
                  <button
                    onClick={handleAddCategory}
                    className="px-6 py-2 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all flex items-center space-x-2"
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
                  <p className="text-gray-500 font-Lora text-sm text-center py-8">
                    No categories yet. Add your first category above.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-Lora font-semibold" style={{ color: "#1e1e1e" }}>
                          {category.name}
                        </span>
                        <button
                          onClick={() => handleDeleteCategory(category.id, category.name)}
                          className="px-3 py-1 rounded-lg border-2 border-red-500 text-red-500 font-Lora text-sm font-semibold hover:bg-red-50 transition-all flex items-center space-x-1"
                        >
                          <FaTrash size={12} />
                          <span>Delete</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Close Button */}
              <div className="pt-4 border-t">
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className="w-full px-6 py-3 rounded-lg font-Lora font-semibold hover:opacity-90 transition-all"
                  style={{ backgroundColor: "#c49e72", color: "white" }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesManagement;

