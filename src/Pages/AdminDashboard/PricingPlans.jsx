// src/Pages/AdminDashboard/PricingPlans.jsx
import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTag,
  FaCheckCircle,
  FaSave,
  FaPercentage,
  FaImage,
  FaTimes,
} from "react-icons/fa";
import Swal from "sweetalert2";
import {
  getAllPricingPlans,
  createPricingPlan,
  updatePricingPlan,
  deletePricingPlan,
} from "../../services";
import { uploadImage, deleteImage } from "../../services/storageService";

const PricingPlans = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [pricingPlans, setPricingPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    includes: "",
    price: "",
    image_url: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Fetch pricing plans on component mount
  useEffect(() => {
    fetchPricingPlans();
  }, []);

  const fetchPricingPlans = async () => {
    setLoading(true);
    const result = await getAllPricingPlans();
    if (result.error) {
      Swal.fire("Error", "Failed to fetch pricing plans", "error");
    } else {
      setPricingPlans(result.data || []);
    }
    setLoading(false);
  };

  const handleEditPlan = (plan) => {
    setSelectedPlan(plan);
    setFormData({
      name: plan.name || "",
      duration: plan.duration || "",
      includes: plan.includes || "",
      price: plan.price || "",
      image_url: plan.image_url || "",
    });
    setImagePreview(plan.image_url || null);
    setImageFile(null);
    setShowModal(true);
  };

  const handleDeletePlan = async (planId) => {
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
      const deleteResult = await deletePricingPlan(planId);
      if (deleteResult.error) {
        Swal.fire("Error", "Failed to delete pricing plan", "error");
      } else {
        Swal.fire("Deleted!", "Pricing plan has been deleted.", "success");
        fetchPricingPlans();
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPlan(null);
    setFormData({
      name: "",
      duration: "",
      includes: "",
      price: "",
      image_url: "",
    });
    setImageFile(null);
    setImagePreview(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        Swal.fire("Error", "Please upload a valid image file (JPEG, PNG, WebP, or GIF)", "error");
        return;
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        Swal.fire("Error", "Image size should be less than 5MB", "error");
        return;
      }

      setImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData((prev) => ({
      ...prev,
      image_url: "",
    }));
  };

  const handleSavePlan = async (isDraft = false) => {
    // Validation
    if (!formData.name || !formData.duration || !formData.includes || !formData.price) {
      Swal.fire("Error", "Please fill in all required fields", "error");
      return;
    }

    try {
      let imageUrl = formData.image_url;

      // Upload image if a new file is selected
      if (imageFile) {
        setUploadingImage(true);
        const uploadResult = await uploadImage(imageFile, 'pricing-images', 'plans');

        if (uploadResult.error) {
          Swal.fire("Error", "Failed to upload image", "error");
          setUploadingImage(false);
          return;
        }

        imageUrl = uploadResult.data.publicUrl;

        // Delete old image if updating
        if (selectedPlan && selectedPlan.image_url) {
          // Extract file path from URL
          const oldPath = selectedPlan.image_url.split('/').slice(-2).join('/');
          await deleteImage(oldPath, 'pricing-images');
        }

        setUploadingImage(false);
      }

      const planData = {
        name: formData.name,
        duration: formData.duration,
        includes: formData.includes,
        price: formData.price,
        image_url: imageUrl,
        is_active: !isDraft,
      };

      let result;
      if (selectedPlan) {
        result = await updatePricingPlan(selectedPlan.id, planData);
      } else {
        result = await createPricingPlan(planData);
      }

      if (result.error) {
        Swal.fire("Error", "Failed to save pricing plan", "error");
      } else {
        Swal.fire(
          "Success!",
          `Pricing plan ${selectedPlan ? "updated" : "created"} successfully!`,
          "success"
        );
        handleCloseModal();
        fetchPricingPlans();
      }
    } catch (error) {
      console.error("Error saving pricing plan:", error);
      Swal.fire("Error", "An unexpected error occurred", "error");
      setUploadingImage(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-Garamond" style={{ color: "#1e1e1e" }}>
            Pricing Plans
          </h1>
          <p className="text-gray-600 font-Lora mt-1">
            Manage holiday packages and pricing plans
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedPlan(null);
            setFormData({ name: "", duration: "", includes: "", price: "", image_url: "" });
            setImageFile(null);
            setImagePreview(null);
            setShowModal(true);
          }}
          className="mt-4 md:mt-0 px-6 py-3 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all shadow-md flex items-center space-x-2"
          style={{ backgroundColor: "#006938" }}
        >
          <FaPlus />
          <span>Add Pricing Plan</span>
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: "#006938" }}></div>
        </div>
      ) : pricingPlans.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <FaTag className="mx-auto text-6xl mb-4" style={{ color: "#c49e72" }} />
          <h3 className="text-xl font-bold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
            No Pricing Plans Yet
          </h3>
          <p className="text-gray-600 font-Lora mb-4">
            Get started by creating your first pricing plan
          </p>
          <button
            onClick={() => {
              setSelectedPlan(null);
              setFormData({ name: "", duration: "", includes: "", price: "", image_url: "" });
              setImageFile(null);
              setImagePreview(null);
              setShowModal(true);
            }}
            className="px-6 py-3 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all shadow-md"
            style={{ backgroundColor: "#006938" }}
          >
            <FaPlus className="inline mr-2" />
            Create First Plan
          </button>
        </div>
      ) : (
        /* Pricing Plans Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pricingPlans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Plan Image */}
            {plan.image_url && (
              <div className="w-full h-48 overflow-hidden">
                <img
                  src={plan.image_url}
                  alt={plan.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-6" style={{ backgroundColor: "#f7f5f2" }}>
              <div className="flex items-center justify-between mb-2">
                <FaTag className="text-2xl" style={{ color: "#c49e72" }} />
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold font-Lora ${
                    plan.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {plan.is_active ? "Active" : "Draft"}
                </span>
              </div>
              <h3 className="text-xl font-bold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                {plan.name}
              </h3>
              <p className="text-sm text-gray-600 font-Lora">
                {plan.duration}
              </p>
            </div>

            <div className="p-6 space-y-4">
              {/* Price */}
              <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: "#f0fdf4" }}>
                <span className="text-sm text-gray-600 font-Lora">Approx. Price</span>
                <span className="text-2xl font-bold font-Garamond" style={{ color: "#006938" }}>
                  {plan.price}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm font-Lora">
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-semibold text-gray-800">{plan.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Includes:</span>
                  <span className="font-semibold text-gray-800 text-right">{plan.includes}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-2">
                <button
                  onClick={() => handleEditPlan(plan)}
                  className="flex-1 px-4 py-2 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all"
                  style={{ backgroundColor: "#c49e72" }}
                >
                  <FaEdit className="inline mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeletePlan(plan.id)}
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
                {selectedPlan ? "Edit Pricing Plan" : "Add New Pricing Plan"}
              </h2>
            </div>

            <div className="p-6">
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Plan Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                      style={{ borderColor: "#c49e72" }}
                      placeholder="e.g., Weekend Package"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Duration <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                      style={{ borderColor: "#c49e72" }}
                      placeholder="e.g., 2 Nights / 3 Days"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Includes <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows="3"
                      name="includes"
                      value={formData.includes}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                      style={{ borderColor: "#c49e72" }}
                      placeholder="e.g., Accommodation, Breakfast, Airport Transfer"
                    ></textarea>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Approx. Price <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                      style={{ borderColor: "#c49e72" }}
                      placeholder="e.g., ₹6000/person or ₹15000/couple"
                    />
                  </div>

                  {/* Image Upload Field */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Plan Image
                    </label>

                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg border-2"
                          style={{ borderColor: "#c49e72" }}
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all shadow-lg"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-opacity-70 transition-all"
                        style={{ borderColor: "#c49e72" }}
                      >
                        <input
                          type="file"
                          id="image-upload"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer flex flex-col items-center"
                        >
                          <FaImage className="text-4xl mb-2" style={{ color: "#c49e72" }} />
                          <span className="text-sm font-Lora text-gray-600">
                            Click to upload image
                          </span>
                          <span className="text-xs font-Lora text-gray-400 mt-1">
                            JPEG, PNG, WebP or GIF (Max 5MB)
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => handleSavePlan(false)}
                    disabled={uploadingImage}
                    className="flex-1 px-6 py-3 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: "#006938" }}
                  >
                    <FaCheckCircle className="inline mr-2" />
                    {uploadingImage ? "Uploading..." : "Save & Publish"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSavePlan(true)}
                    disabled={uploadingImage}
                    className="flex-1 px-6 py-3 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: "#c49e72" }}
                  >
                    <FaSave className="inline mr-2" />
                    {uploadingImage ? "Uploading..." : "Save as Draft"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={uploadingImage}
                    className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-600 font-Lora font-semibold hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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

export default PricingPlans;

