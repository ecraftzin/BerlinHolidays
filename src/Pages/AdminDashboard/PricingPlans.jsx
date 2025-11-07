// src/Pages/AdminDashboard/PricingPlans.jsx
import React, { useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTag,
  FaCheckCircle,
  FaSave,
  FaPercentage,
} from "react-icons/fa";

const PricingPlans = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const [pricingPlans, setPricingPlans] = useState([
    {
      id: 1,
      name: "Early Bird Discount",
      description: "Book 30 days in advance and save 15%",
      discountType: "Percentage",
      discountValue: 15,
      validFrom: "2024-01-01",
      validTo: "2024-12-31",
      minStay: 2,
      isActive: true,
    },
    {
      id: 2,
      name: "Weekend Special",
      description: "Special rates for weekend stays",
      discountType: "Percentage",
      discountValue: 10,
      validFrom: "2024-01-01",
      validTo: "2024-12-31",
      minStay: 2,
      isActive: true,
    },
    {
      id: 3,
      name: "Long Stay Discount",
      description: "Stay 7 nights or more and get 20% off",
      discountType: "Percentage",
      discountValue: 20,
      validFrom: "2024-01-01",
      validTo: "2024-12-31",
      minStay: 7,
      isActive: true,
    },
  ]);

  const handleEditPlan = (plan) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  const handleDeletePlan = (planId) => {
    if (window.confirm("Are you sure you want to delete this pricing plan?")) {
      setPricingPlans(pricingPlans.filter((plan) => plan.id !== planId));
      alert("Pricing plan deleted successfully!");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPlan(null);
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
            Manage discount plans and special pricing strategies
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="mt-4 md:mt-0 px-6 py-3 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all shadow-md flex items-center space-x-2"
          style={{ backgroundColor: "#006938" }}
        >
          <FaPlus />
          <span>Add Pricing Plan</span>
        </button>
      </div>

      {/* Pricing Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pricingPlans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6" style={{ backgroundColor: "#f7f5f2" }}>
              <div className="flex items-center justify-between mb-2">
                <FaTag className="text-2xl" style={{ color: "#c49e72" }} />
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold font-Lora ${
                    plan.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {plan.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <h3 className="text-xl font-bold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                {plan.name}
              </h3>
              <p className="text-sm text-gray-600 font-Lora line-clamp-2">
                {plan.description}
              </p>
            </div>

            <div className="p-6 space-y-4">
              {/* Discount Value */}
              <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: "#f0fdf4" }}>
                <span className="text-sm text-gray-600 font-Lora">Discount</span>
                <span className="text-2xl font-bold font-Garamond" style={{ color: "#006938" }}>
                  {plan.discountValue}%
                </span>
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm font-Lora">
                <div className="flex justify-between">
                  <span className="text-gray-600">Valid From:</span>
                  <span className="font-semibold text-gray-800">{plan.validFrom}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Valid To:</span>
                  <span className="font-semibold text-gray-800">{plan.validTo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Min Stay:</span>
                  <span className="font-semibold text-gray-800">{plan.minStay} nights</span>
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
                      defaultValue={selectedPlan?.name || ""}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                      style={{ borderColor: "#c49e72" }}
                      placeholder="e.g., Early Bird Discount"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Description
                    </label>
                    <textarea
                      rows="3"
                      defaultValue={selectedPlan?.description || ""}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                      style={{ borderColor: "#c49e72" }}
                      placeholder="Brief description of this pricing plan"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Discount Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      defaultValue={selectedPlan?.discountType || "Percentage"}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                      style={{ borderColor: "#c49e72" }}
                    >
                      <option>Percentage</option>
                      <option>Fixed Amount</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Discount Value <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      defaultValue={selectedPlan?.discountValue || ""}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                      style={{ borderColor: "#c49e72" }}
                      placeholder="15"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Valid From <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      defaultValue={selectedPlan?.validFrom || ""}
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
                      defaultValue={selectedPlan?.validTo || ""}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                      style={{ borderColor: "#c49e72" }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Minimum Stay (nights) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      defaultValue={selectedPlan?.minStay || ""}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                      style={{ borderColor: "#c49e72" }}
                      placeholder="2"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Status
                    </label>
                    <select
                      defaultValue={selectedPlan?.isActive ? "active" : "inactive"}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                      style={{ borderColor: "#c49e72" }}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      alert(selectedPlan ? "Pricing plan updated successfully!" : "Pricing plan created successfully!");
                      handleCloseModal();
                    }}
                    className="flex-1 px-6 py-3 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all shadow-md"
                    style={{ backgroundColor: "#006938" }}
                  >
                    <FaCheckCircle className="inline mr-2" />
                    {selectedPlan ? "Update Plan" : "Save & Publish"}
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

export default PricingPlans;

