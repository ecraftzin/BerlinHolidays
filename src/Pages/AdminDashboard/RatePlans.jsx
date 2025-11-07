// src/Pages/AdminDashboard/RatePlans.jsx
import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaMoneyBillWave, FaSave, FaCheckCircle } from "react-icons/fa";
import Swal from "sweetalert2";
import { getAllRatePlans, createRatePlan, updateRatePlan, deleteRatePlan } from "../../services/ratePlansService";
import { getAllRoomTypes } from "../../services/roomService";

const RatePlans = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [ratePlans, setRatePlans] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    room_type_id: "",
    base_rate: "",
    weekend_rate: "",
    seasonal_rate: "",
    description: "",
  });

  useEffect(() => {
    fetchRatePlans();
    fetchRoomTypes();
  }, []);

  const fetchRatePlans = async () => {
    setLoading(true);
    const result = await getAllRatePlans();
    if (result.error) {
      Swal.fire("Error", "Failed to fetch rate plans", "error");
    } else {
      setRatePlans(result.data || []);
    }
    setLoading(false);
  };

  const fetchRoomTypes = async () => {
    const result = await getAllRoomTypes();
    if (result.error) {
      Swal.fire("Error", "Failed to fetch room types", "error");
    } else {
      setRoomTypes(result.data || []);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditPlan = (plan) => {
    setSelectedPlan(plan);
    setFormData({
      name: plan.name || "",
      room_type_id: plan.room_type_id || "",
      base_rate: plan.base_rate || "",
      weekend_rate: plan.weekend_rate || "",
      seasonal_rate: plan.seasonal_rate || "",
      description: plan.description || "",
    });
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
      const deleteResult = await deleteRatePlan(planId);
      if (deleteResult.error) {
        Swal.fire("Error", "Failed to delete rate plan", "error");
      } else {
        Swal.fire("Deleted!", "Rate plan has been deleted.", "success");
        fetchRatePlans();
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPlan(null);
    setFormData({
      name: "",
      room_type_id: "",
      base_rate: "",
      weekend_rate: "",
      seasonal_rate: "",
      description: "",
    });
  };

  const handleSavePlan = async () => {
    if (!formData.name || !formData.room_type_id || !formData.base_rate) {
      Swal.fire("Error", "Please fill in all required fields", "error");
      return;
    }

    const planData = {
      ...formData,
      base_rate: parseFloat(formData.base_rate),
      weekend_rate: formData.weekend_rate ? parseFloat(formData.weekend_rate) : null,
      seasonal_rate: formData.seasonal_rate ? parseFloat(formData.seasonal_rate) : null,
    };

    let result;
    if (selectedPlan) {
      result = await updateRatePlan(selectedPlan.id, planData);
    } else {
      result = await createRatePlan(planData);
    }

    if (result.error) {
      Swal.fire("Error", "Failed to save rate plan", "error");
    } else {
      Swal.fire("Success", `Rate plan ${selectedPlan ? "updated" : "created"} successfully!`, "success");
      handleCloseModal();
      fetchRatePlans();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-Garamond" style={{ color: "#1e1e1e" }}>
            Rate Plans
          </h1>
          <p className="text-gray-600 font-Lora mt-1">
            Manage pricing strategies for different room types
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="mt-4 md:mt-0 px-6 py-3 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all shadow-md flex items-center space-x-2"
          style={{ backgroundColor: "#006938" }}
        >
          <FaPlus />
          <span>Create Rate Plan</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-600 font-Lora">Loading rate plans...</div>
        </div>
      ) : ratePlans.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12 text-center">
          <FaMoneyBillWave className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
            No Rate Plans Yet
          </h3>
          <p className="text-gray-600 font-Lora mb-6">
            Get started by creating your first rate plan
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all shadow-md inline-flex items-center space-x-2"
            style={{ backgroundColor: "#006938" }}
          >
            <FaPlus />
            <span>Create Rate Plan</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: "#f7f5f2" }}>
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold font-Garamond" style={{ color: "#1e1e1e" }}>
                    Plan Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold font-Garamond" style={{ color: "#1e1e1e" }}>
                    Room Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold font-Garamond" style={{ color: "#1e1e1e" }}>
                    Base Rate
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold font-Garamond" style={{ color: "#1e1e1e" }}>
                    Weekend Rate
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold font-Garamond" style={{ color: "#1e1e1e" }}>
                    Seasonal Rate
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold font-Garamond" style={{ color: "#1e1e1e" }}>
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold font-Garamond" style={{ color: "#1e1e1e" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ratePlans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-Lora font-semibold" style={{ color: "#1e1e1e" }}>
                      {plan.name}
                    </td>
                    <td className="px-6 py-4 font-Lora text-gray-600">
                      {plan.room_types?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 font-Lora font-semibold" style={{ color: "#006938" }}>
                      ₹{plan.base_rate}
                    </td>
                    <td className="px-6 py-4 font-Lora font-semibold" style={{ color: "#006938" }}>
                      {plan.weekend_rate ? `₹${plan.weekend_rate}` : "-"}
                    </td>
                    <td className="px-6 py-4 font-Lora font-semibold" style={{ color: "#006938" }}>
                      {plan.seasonal_rate ? `₹${plan.seasonal_rate}` : "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-Lora font-semibold ${plan.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                        {plan.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditPlan(plan)}
                          className="p-2 rounded-lg text-white hover:opacity-90 transition-all"
                          style={{ backgroundColor: "#c49e72" }}
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeletePlan(plan.id)}
                          className="p-2 rounded-lg border-2 border-red-500 text-red-500 hover:bg-red-50 transition-all"
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
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold font-Garamond" style={{ color: "#1e1e1e" }}>
                {selectedPlan ? "Edit Rate Plan" : "Create Rate Plan"}
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
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none font-Lora"
                      style={{ borderColor: "#c49e72" }}
                      placeholder="e.g., Standard Rate"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Room Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="room_type_id"
                      value={formData.room_type_id}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none font-Lora"
                      style={{ borderColor: "#c49e72" }}
                    >
                      <option value="">Select Room Type</option>
                      {roomTypes.map((roomType) => (
                        <option key={roomType.id} value={roomType.id}>
                          {roomType.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Base Rate (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="base_rate"
                      value={formData.base_rate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none font-Lora"
                      style={{ borderColor: "#c49e72" }}
                      placeholder="5000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Weekend Rate (₹)
                    </label>
                    <input
                      type="number"
                      name="weekend_rate"
                      value={formData.weekend_rate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none font-Lora"
                      style={{ borderColor: "#c49e72" }}
                      placeholder="6000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Seasonal Rate (₹)
                    </label>
                    <input
                      type="number"
                      name="seasonal_rate"
                      value={formData.seasonal_rate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none font-Lora"
                      style={{ borderColor: "#c49e72" }}
                      placeholder="7000"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none font-Lora"
                      style={{ borderColor: "#c49e72" }}
                      placeholder="Enter rate plan description"
                    ></textarea>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleSavePlan}
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

export default RatePlans;

