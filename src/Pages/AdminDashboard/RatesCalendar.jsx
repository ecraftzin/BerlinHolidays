// src/Pages/AdminDashboard/RatesCalendar.jsx
import React, { useState, useEffect } from "react";
import { FaCalendar, FaEdit, FaSave, FaCheckCircle, FaPlus, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { getRoomRatesForDateRange, upsertRoomRate, deleteRoomRate } from "../../services/ratePlansService";
import { getAllRoomTypes } from "../../services/roomService";

const RatesCalendar = () => {
  const [selectedRate, setSelectedRate] = useState(null);
  const [showRateModal, setShowRateModal] = useState(false);
  const [roomRates, setRoomRates] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    room_type_id: "",
    rate_date: "",
    rate: "",
    reason: "",
    notes: "",
  });

  useEffect(() => {
    fetchRoomRates();
    fetchRoomTypes();
  }, []);

  const fetchRoomRates = async () => {
    setLoading(true);
    // Fetch rates for the next 6 months
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 6);

    const result = await getRoomRatesForDateRange(
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    );

    if (result.error) {
      Swal.fire("Error", "Failed to fetch room rates", "error");
    } else {
      setRoomRates(result.data || []);
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

  const handleEditRate = (rate) => {
    setSelectedRate(rate);
    setFormData({
      room_type_id: rate.room_type_id || "",
      rate_date: rate.rate_date || "",
      rate: rate.rate || "",
      reason: rate.reason || "",
      notes: rate.notes || "",
    });
    setShowRateModal(true);
  };

  const handleDeleteRate = async (id) => {
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
      const deleteResult = await deleteRoomRate(id);
      if (deleteResult.error) {
        Swal.fire("Error", "Failed to delete room rate", "error");
      } else {
        Swal.fire("Deleted!", "Room rate has been deleted.", "success");
        fetchRoomRates();
      }
    }
  };

  const handleCloseModal = () => {
    setShowRateModal(false);
    setSelectedRate(null);
    setFormData({
      room_type_id: "",
      rate_date: "",
      rate: "",
      reason: "",
      notes: "",
    });
  };

  const handleSaveRate = async () => {
    if (!formData.room_type_id || !formData.rate_date || !formData.rate) {
      Swal.fire("Error", "Please fill in all required fields", "error");
      return;
    }

    const rateData = {
      room_type_id: formData.room_type_id,
      rate_date: formData.rate_date,
      rate: parseFloat(formData.rate),
      reason: formData.reason || null,
      notes: formData.notes || null,
    };

    const result = await upsertRoomRate(rateData);

    if (result.error) {
      Swal.fire("Error", "Failed to save room rate", "error");
    } else {
      Swal.fire("Success", `Room rate ${selectedRate ? "updated" : "created"} successfully!`, "success");
      handleCloseModal();
      fetchRoomRates();
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-Garamond" style={{ color: "#1e1e1e" }}>
            Rates Calendar
          </h1>
          <p className="text-gray-600 font-Lora mt-1">
            Manage room rates across different dates and seasons
          </p>
        </div>
        <button
          onClick={() => setShowRateModal(true)}
          className="mt-4 md:mt-0 px-6 py-3 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all shadow-md flex items-center space-x-2"
          style={{ backgroundColor: "#006938" }}
        >
          <FaPlus />
          <span>Add Rate</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-600 font-Lora">Loading room rates...</div>
        </div>
      ) : roomRates.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12 text-center">
          <FaCalendar className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
            No Special Rates Yet
          </h3>
          <p className="text-gray-600 font-Lora mb-6">
            Get started by adding special rates for specific dates
          </p>
          <button
            onClick={() => setShowRateModal(true)}
            className="px-6 py-3 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all shadow-md inline-flex items-center space-x-2"
            style={{ backgroundColor: "#006938" }}
          >
            <FaPlus />
            <span>Add Rate</span>
          </button>
        </div>
      ) : (
        /* Special Dates List */
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold font-Garamond" style={{ color: "#1e1e1e" }}>
              Special Rate Dates
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: "#f7f5f2" }}>
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold font-Garamond" style={{ color: "#1e1e1e" }}>
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold font-Garamond" style={{ color: "#1e1e1e" }}>
                    Room Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold font-Garamond" style={{ color: "#1e1e1e" }}>
                    Rate (₹)
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold font-Garamond" style={{ color: "#1e1e1e" }}>
                    Reason
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold font-Garamond" style={{ color: "#1e1e1e" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {roomRates.map((rate) => (
                  <tr key={rate.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-Lora text-gray-800">
                      {new Date(rate.rate_date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 font-Lora text-gray-600">
                      {rate.room_types?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 font-bold font-Garamond" style={{ color: "#006938" }}>
                      ₹{rate.rate}
                    </td>
                    <td className="px-6 py-4 font-Lora text-gray-600">{rate.reason || "-"}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditRate(rate)}
                          className="p-2 rounded-lg text-white hover:opacity-90 transition-all"
                          style={{ backgroundColor: "#c49e72" }}
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteRate(rate.id)}
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

      {/* Rate Edit Modal */}
      {showRateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold font-Garamond" style={{ color: "#1e1e1e" }}>
                {selectedRate ? "Edit Room Rate" : "Add Room Rate"}
              </h2>
            </div>
            <div className="p-6">
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="rate_date"
                      value={formData.rate_date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none font-Lora"
                      style={{ borderColor: "#c49e72" }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Rate (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="rate"
                      value={formData.rate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none font-Lora"
                      style={{ borderColor: "#c49e72" }}
                      placeholder="5000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Reason
                    </label>
                    <input
                      type="text"
                      name="reason"
                      value={formData.reason}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none font-Lora"
                      style={{ borderColor: "#c49e72" }}
                      placeholder="e.g., Holiday, Peak Season"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none font-Lora"
                      style={{ borderColor: "#c49e72" }}
                      placeholder="Additional notes"
                    ></textarea>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleSaveRate}
                    className="flex-1 px-6 py-3 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all shadow-md"
                    style={{ backgroundColor: "#006938" }}
                  >
                    <FaCheckCircle className="inline mr-2" />
                    {selectedRate ? "Update Rate" : "Save & Publish"}
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

export default RatesCalendar;

