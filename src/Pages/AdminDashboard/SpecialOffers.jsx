// src/Pages/AdminDashboard/SpecialOffers.jsx
import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaGift,
  FaPercent,
  FaCalendar,
  FaSave,
  FaCheckCircle,
  FaToggleOn,
  FaToggleOff,
  FaSpinner,
} from "react-icons/fa";
import {
  getAllSpecialOffers,
  createSpecialOffer,
  updateSpecialOffer,
  deleteSpecialOffer,
} from "../../services/specialOffersService";

const SpecialOffers = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discount_type: "percentage",
    discount_value: "",
    valid_from: "",
    valid_to: "",
    room_type: "All Rooms",
    status: "active",
    slug: "",
  });

  // Fetch offers on component mount
  useEffect(() => {
    fetchOffers();
  }, []);

  // Fetch all offers from database
  const fetchOffers = async () => {
    setLoading(true);
    try {
      const { data, error } = await getAllSpecialOffers();
      if (error) {
        console.error("Error fetching offers:", error);
        alert("Failed to load offers. Please try again.");
      } else {
        setOffers(data || []);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to load offers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "title" && { slug: generateSlug(value) }),
    }));
  };

  // Handle edit offer
  const handleEditOffer = (offer) => {
    setSelectedOffer(offer);
    setFormData({
      title: offer.title || "",
      description: offer.description || "",
      discount_type: offer.discount_type || "percentage",
      discount_value: offer.discount_value || "",
      valid_from: offer.valid_from || "",
      valid_to: offer.valid_to || "",
      room_type: offer.room_type || "All Rooms",
      status: offer.status || "active",
      slug: offer.slug || "",
    });
    setShowModal(true);
  };

  // Handle save offer (create or update)
  const handleSaveOffer = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title || !formData.discount_value || !formData.valid_from || !formData.valid_to) {
      alert("Please fill in all required fields.");
      return;
    }

    setSaving(true);
    try {
      const offerData = {
        ...formData,
        slug: formData.slug || generateSlug(formData.title),
      };

      let result;
      if (selectedOffer) {
        // Update existing offer
        result = await updateSpecialOffer(selectedOffer.id, offerData);
      } else {
        // Create new offer
        result = await createSpecialOffer(offerData);
      }

      if (result.error) {
        console.error("Error saving offer:", result.error);
        alert("Failed to save offer. Please try again.");
      } else {
        alert(selectedOffer ? "Offer updated successfully!" : "Offer created successfully!");
        handleCloseModal();
        fetchOffers(); // Refresh the list
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to save offer. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Handle delete offer
  const handleDeleteOffer = async (offerId) => {
    if (window.confirm("Are you sure you want to delete this offer?")) {
      try {
        const { error } = await deleteSpecialOffer(offerId);
        if (error) {
          console.error("Error deleting offer:", error);
          alert("Failed to delete offer. Please try again.");
        } else {
          alert("Offer deleted successfully!");
          fetchOffers(); // Refresh the list
        }
      } catch (err) {
        console.error("Error:", err);
        alert("Failed to delete offer. Please try again.");
      }
    }
  };

  // Handle close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOffer(null);
    setFormData({
      title: "",
      description: "",
      discount_type: "percentage",
      discount_value: "",
      valid_from: "",
      valid_to: "",
      room_type: "All Rooms",
      status: "active",
      slug: "",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-Garamond" style={{ color: "#1e1e1e" }}>
            Special Offers
          </h1>
          <p className="text-gray-600 font-Lora mt-1">
            Manage promotional offers and discounts
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all shadow-md flex items-center space-x-2"
            style={{ backgroundColor: "#006938" }}
          >
            <FaPlus />
            <span>Create Offer</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <FaSpinner className="animate-spin text-4xl" style={{ color: "#c49e72" }} />
        </div>
      ) : offers.length === 0 ? (
        /* Empty State */
        <div className="text-center py-20">
          <FaGift className="mx-auto text-6xl mb-4" style={{ color: "#c49e72" }} />
          <h3 className="text-xl font-bold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
            No Special Offers Yet
          </h3>
          <p className="text-gray-600 font-Lora mb-6">
            Create your first special offer to attract more guests
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all shadow-md inline-flex items-center space-x-2"
            style={{ backgroundColor: "#006938" }}
          >
            <FaPlus />
            <span>Create Offer</span>
          </button>
        </div>
      ) : (
        /* Offers Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Offer Header */}
              <div className="p-6 border-b border-gray-100" style={{ backgroundColor: "#f7f5f2" }}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      {offer.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <div
                        className="px-4 py-2 rounded-full flex items-center space-x-2"
                        style={{ backgroundColor: "#006938" }}
                      >
                        <FaPercent className="text-white text-sm" />
                        <span className="text-2xl font-bold text-white font-Garamond">
                          {offer.discount_value}%
                        </span>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-Lora font-semibold ${
                          offer.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {offer.status}
                      </span>
                    </div>
                  </div>
                  <FaGift className="text-3xl" style={{ color: "#c49e72" }} />
                </div>
              </div>

              {/* Offer Details */}
              <div className="p-6">
                <p className="text-sm text-gray-600 font-Lora mb-4">
                  {offer.description}
                </p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 font-Lora">Room Type</span>
                    <span className="font-semibold font-Lora" style={{ color: "#1e1e1e" }}>
                      {offer.room_type}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-gray-600 font-Lora">
                      <FaCalendar className="mr-2" style={{ color: "#c49e72" }} />
                      Valid From
                    </span>
                    <span className="font-semibold font-Lora" style={{ color: "#1e1e1e" }}>
                      {new Date(offer.valid_from).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-gray-600 font-Lora">
                      <FaCalendar className="mr-2" style={{ color: "#c49e72" }} />
                      Valid To
                    </span>
                    <span className="font-semibold font-Lora" style={{ color: "#1e1e1e" }}>
                      {new Date(offer.valid_to).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditOffer(offer)}
                    className="flex-1 px-4 py-2 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all"
                    style={{ backgroundColor: "#c49e72" }}
                  >
                    <FaEdit className="inline mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteOffer(offer.id)}
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

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold font-Garamond" style={{ color: "#1e1e1e" }}>
                {selectedOffer ? "Edit Special Offer" : "Create Special Offer"}
              </h2>
            </div>

            <div className="p-6">
              <form className="space-y-4" onSubmit={handleSaveOffer}>
                <div>
                  <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                    Offer Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                    style={{ borderColor: "#c49e72" }}
                    placeholder="e.g., Summer Special"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                    Description
                  </label>
                  <textarea
                    rows="3"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                    style={{ borderColor: "#c49e72" }}
                    placeholder="Enter offer description"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Discount (%) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="discount_value"
                      value={formData.discount_value}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                      style={{ borderColor: "#c49e72" }}
                      placeholder="25"
                      min="0"
                      max="100"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Apply to Room Type
                    </label>
                    <select
                      name="room_type"
                      value={formData.room_type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                      style={{ borderColor: "#c49e72" }}
                    >
                      <option>All Rooms</option>
                      <option>Deluxe Suite</option>
                      <option>Premium Room</option>
                      <option>Family Suite</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Valid From <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="valid_from"
                      value={formData.valid_from}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                      style={{ borderColor: "#c49e72" }}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Valid To <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="valid_to"
                      value={formData.valid_to}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                      style={{ borderColor: "#c49e72" }}
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 px-6 py-3 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all shadow-md disabled:opacity-50"
                    style={{ backgroundColor: "#006938" }}
                  >
                    {saving ? (
                      <>
                        <FaSpinner className="inline mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaCheckCircle className="inline mr-2" />
                        {selectedOffer ? "Update Offer" : "Save & Publish"}
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={saving}
                    className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-600 font-Lora font-semibold hover:bg-gray-50 transition-all disabled:opacity-50"
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

export default SpecialOffers;

