// src/Pages/AdminDashboard/SpecialOffers.jsx
import React, { useState } from "react";
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
} from "react-icons/fa";

const SpecialOffers = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);

  const [offers, setOffers] = useState([
    {
      id: 1,
      title: "Summer Special",
      discount: 25,
      validFrom: "2024-06-01",
      validTo: "2024-08-31",
      roomType: "All Rooms",
      status: "Active",
      description: "Get 25% off on all bookings",
    },
    {
      id: 2,
      title: "Weekend Getaway",
      discount: 15,
      validFrom: "2024-12-01",
      validTo: "2024-12-31",
      roomType: "Deluxe Suite",
      status: "Active",
      description: "15% off on weekend stays",
    },
    {
      id: 3,
      title: "Early Bird Offer",
      discount: 30,
      validFrom: "2025-01-01",
      validTo: "2025-03-31",
      roomType: "All Rooms",
      status: "Scheduled",
      description: "Book 30 days in advance and save 30%",
    },
  ]);

  const handleEditOffer = (offer) => {
    setSelectedOffer(offer);
    setShowModal(true);
  };

  const handleDeleteOffer = (offerId) => {
    if (window.confirm("Are you sure you want to delete this offer?")) {
      setOffers(offers.filter((offer) => offer.id !== offerId));
      alert("Offer deleted successfully!");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOffer(null);
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

      {/* Offers Grid */}
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
                        {offer.discount}%
                      </span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-Lora font-semibold ${
                        offer.status === "Active"
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
                    {offer.roomType}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center text-gray-600 font-Lora">
                    <FaCalendar className="mr-2" style={{ color: "#c49e72" }} />
                    Valid From
                  </span>
                  <span className="font-semibold font-Lora" style={{ color: "#1e1e1e" }}>
                    {new Date(offer.validFrom).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center text-gray-600 font-Lora">
                    <FaCalendar className="mr-2" style={{ color: "#c49e72" }} />
                    Valid To
                  </span>
                  <span className="font-semibold font-Lora" style={{ color: "#1e1e1e" }}>
                    {new Date(offer.validTo).toLocaleDateString()}
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
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                    Offer Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedOffer?.title || ""}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                    style={{ borderColor: "#c49e72" }}
                    placeholder="e.g., Summer Special"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                    Description
                  </label>
                  <textarea
                    rows="3"
                    defaultValue={selectedOffer?.description || ""}
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
                      defaultValue={selectedOffer?.discount || ""}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                      style={{ borderColor: "#c49e72" }}
                      placeholder="25"
                      min="0"
                      max="100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Apply to Room Type
                    </label>
                    <select
                      defaultValue={selectedOffer?.roomType || ""}
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
                      defaultValue={selectedOffer?.validFrom || ""}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                      style={{ borderColor: "#c49e72" }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Valid To <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      defaultValue={selectedOffer?.validTo || ""}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                      style={{ borderColor: "#c49e72" }}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      alert(selectedOffer ? "Offer updated successfully!" : "Offer created successfully!");
                      handleCloseModal();
                    }}
                    className="flex-1 px-6 py-3 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all shadow-md"
                    style={{ backgroundColor: "#006938" }}
                  >
                    <FaCheckCircle className="inline mr-2" />
                    {selectedOffer ? "Update Offer" : "Save & Publish"}
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

export default SpecialOffers;

