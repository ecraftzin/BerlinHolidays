// src/Pages/AdminDashboard/RoomAvailability.jsx
import React, { useState, useEffect } from "react";
import { FaCalendar, FaBed, FaCheckCircle, FaTimesCircle, FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import { getRoomAvailabilityForDateRange, upsertRoomAvailability } from "../../services/availabilityService";
import { getAllRoomTypes } from "../../services/roomService";
import { supabase } from "../../config/supabaseClient";

const RoomAvailability = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [roomTypes, setRoomTypes] = useState([]);
  const [availabilityData, setAvailabilityData] = useState({});
  const [loading, setLoading] = useState(true);

  // Store last used dates per room to persist when reopening modal
  const [lastUsedDates, setLastUsedDates] = useState({});

  const [formData, setFormData] = useState({
    from_date: "",
    to_date: "",
    available_rooms: 0,
    blocked_rooms: 0,
    minimum_stay: 1,
    reason: "",
    notes: "",
  });

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const fetchRoomTypes = async () => {
    setLoading(true);
    const result = await getAllRoomTypes();
    if (result.error) {
      Swal.fire("Error", "Failed to fetch room types", "error");
    } else {
      setRoomTypes(result.data || []);
      // Fetch availability for each room type
      if (result.data && result.data.length > 0) {
        await fetchAvailabilityForAllRooms(result.data);
      }
    }
    setLoading(false);
  };

  const fetchAvailabilityForAllRooms = async (rooms) => {
    const today = new Date().toISOString().split('T')[0];
    const availability = {};

    for (const room of rooms) {
      const result = await getRoomAvailabilityForDateRange(
        room.id,
        today,
        today
      );

      if (!result.error && result.data && result.data.length > 0) {
        const todayAvailability = result.data[0];
        availability[room.id] = {
          available: todayAvailability.available_rooms || 0,
          blocked: todayAvailability.blocked_rooms || 0,
          occupied: room.total_rooms - (todayAvailability.available_rooms || 0) - (todayAvailability.blocked_rooms || 0),
        };
      } else {
        // Default values if no availability data exists
        availability[room.id] = {
          available: room.total_rooms || 0,
          blocked: 0,
          occupied: 0,
        };
      }
    }

    setAvailabilityData(availability);
  };

  // Update availability display for a specific room (always shows today's availability)
  const updateRoomAvailabilityDisplay = async (room) => {
    const today = new Date().toISOString().split('T')[0];

    const result = await getRoomAvailabilityForDateRange(
      room.id,
      today,
      today
    );

    if (!result.error && result.data && result.data.length > 0) {
      const todayAvailability = result.data[0];
      setAvailabilityData(prev => ({
        ...prev,
        [room.id]: {
          available: todayAvailability.available_rooms || 0,
          blocked: todayAvailability.blocked_rooms || 0,
          occupied: room.total_rooms - (todayAvailability.available_rooms || 0) - (todayAvailability.blocked_rooms || 0),
        }
      }));
    } else {
      // Default values if no availability data exists for today
      setAvailabilityData(prev => ({
        ...prev,
        [room.id]: {
          available: room.total_rooms || 0,
          blocked: 0,
          occupied: 0,
        }
      }));
    }
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // If both dates are selected, try to load existing availability data
    if (name === 'from_date' || name === 'to_date') {
      const fromDate = name === 'from_date' ? value : formData.from_date;
      const toDate = name === 'to_date' ? value : formData.to_date;

      if (fromDate && toDate && selectedRoom) {
        // Save the dates for this room
        setLastUsedDates(prev => ({
          ...prev,
          [selectedRoom.id]: {
            from_date: fromDate,
            to_date: toDate,
          }
        }));

        await loadExistingAvailability(fromDate, toDate);
      }
    }
  };

  const loadExistingAvailability = async (fromDate, toDate) => {
    try {
      const result = await getRoomAvailabilityForDateRange(selectedRoom.id, fromDate, toDate);

      if (result.data && result.data.length > 0) {
        // Load data from the first record (assuming all records in range have same settings)
        const firstRecord = result.data[0];
        setFormData((prev) => ({
          ...prev,
          available_rooms: firstRecord.available_rooms || 0,
          blocked_rooms: firstRecord.blocked_rooms || 0,
          minimum_stay: firstRecord.minimum_stay || 1,
          reason: firstRecord.reason || "",
          notes: firstRecord.notes || "",
        }));
      }
    } catch (error) {
      console.error('Error loading existing availability:', error);
    }
  };

  const handleManageAvailability = async (room) => {
    setSelectedRoom(room);

    // Check if we have previously saved data for this room
    const previousData = lastUsedDates[room.id];

    if (previousData && previousData.from_date && previousData.to_date) {
      // Use the previously saved data directly
      const initialFormData = {
        from_date: previousData.from_date,
        to_date: previousData.to_date,
        available_rooms: previousData.available_rooms !== undefined ? previousData.available_rooms : room.total_rooms || 0,
        blocked_rooms: previousData.blocked_rooms !== undefined ? previousData.blocked_rooms : 0,
        minimum_stay: previousData.minimum_stay || 1,
        reason: previousData.reason || "",
        notes: previousData.notes || "",
      };

      setFormData(initialFormData);
      setShowAvailabilityModal(true);
    } else {
      // No previous data, load from database or use defaults
      const initialFormData = {
        from_date: "",
        to_date: "",
        available_rooms: room.total_rooms || 0,
        blocked_rooms: 0,
        minimum_stay: 1,
        reason: "",
        notes: "",
      };

      setFormData(initialFormData);
      setShowAvailabilityModal(true);
    }
  };

  const handleCloseModal = () => {
    // Don't save on close - only save on successful submit
    setShowAvailabilityModal(false);
    setSelectedRoom(null);
    setFormData({
      from_date: "",
      to_date: "",
      available_rooms: 0,
      blocked_rooms: 0,
      minimum_stay: 1,
      reason: "",
      notes: "",
    });
  };

  const handleSaveAvailability = async () => {
    if (!formData.from_date || !formData.to_date) {
      Swal.fire("Error", "Please select both from and to dates", "error");
      return;
    }

    if (!selectedRoom) {
      Swal.fire("Error", "No room selected", "error");
      return;
    }

    // Save current form data to use after successful save
    const currentFormData = { ...formData };

    try {
      // Generate dates between from_date and to_date
      const startDate = new Date(formData.from_date);
      const endDate = new Date(formData.to_date);
      const dates = [];

      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        dates.push(new Date(d).toISOString().split('T')[0]);
      }

      // Create availability records for each date
      const availabilityRecords = dates.map(date => ({
        room_type_id: selectedRoom.id,
        availability_date: date,
        available_rooms: parseInt(formData.available_rooms),
        blocked_rooms: parseInt(formData.blocked_rooms),
        minimum_stay: parseInt(formData.minimum_stay),
        reason: formData.reason || null,
        notes: formData.notes || null,
        updated_at: new Date().toISOString(),
      }));

      console.log('Saving availability records:', availabilityRecords);

      // Use batch upsert instead of individual upserts
      const { data, error } = await supabase
        .from('room_availability')
        .upsert(availabilityRecords, {
          onConflict: 'room_type_id,availability_date',
          ignoreDuplicates: false // This ensures updates happen
        })
        .select();

      if (error) {
        console.error('Error saving availability:', error);
        throw error;
      }

      console.log('Successfully saved:', data);

      // Update the availability display for this specific room
      await updateRoomAvailabilityDisplay(selectedRoom);

      // Update lastUsedDates with the newly saved data
      setLastUsedDates(prev => ({
        ...prev,
        [selectedRoom.id]: {
          from_date: currentFormData.from_date,
          to_date: currentFormData.to_date,
          available_rooms: currentFormData.available_rooms,
          blocked_rooms: currentFormData.blocked_rooms,
          minimum_stay: currentFormData.minimum_stay,
          reason: currentFormData.reason,
          notes: currentFormData.notes,
        }
      }));

      Swal.fire("Success", "Availability updated successfully!", "success");
      handleCloseModal();
    } catch (error) {
      console.error('Error in handleSaveAvailability:', error);
      Swal.fire("Error", `Failed to update availability: ${error.message}`, "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-Garamond" style={{ color: "#1e1e1e" }}>
            Room Availability
          </h1>
          <p className="text-gray-600 font-Lora mt-1">
            Manage room availability and blocking across dates
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-600 font-Lora">Loading room availability...</div>
        </div>
      ) : roomTypes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12 text-center">
          <FaBed className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
            No Room Types Found
          </h3>
          <p className="text-gray-600 font-Lora mb-6">
            Please add room types first to manage availability
          </p>
        </div>
      ) : (
        /* Current Availability Overview */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roomTypes.map((room) => {
            const availability = availabilityData[room.id] || { available: room.total_rooms || 0, blocked: 0, occupied: 0 };
            return (
              <div
                key={room.id}
                className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6" style={{ backgroundColor: "#f7f5f2" }}>
                  <div className="flex items-center justify-between mb-2">
                    <FaBed className="text-2xl" style={{ color: "#c49e72" }} />
                    <span className="text-sm font-Lora text-gray-600">
                      {room.total_rooms} Total
                    </span>
                  </div>
                  <h3 className="text-xl font-bold font-Garamond" style={{ color: "#1e1e1e" }}>
                    {room.name}
                  </h3>
                </div>

                <div className="p-6 space-y-4">
                  {/* Availability Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 rounded-lg" style={{ backgroundColor: "#f0fdf4" }}>
                      <div className="text-2xl font-bold font-Garamond" style={{ color: "#006938" }}>
                        {availability.available}
                      </div>
                      <div className="text-xs text-gray-600 font-Lora mt-1">Available</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-gray-100">
                      <div className="text-2xl font-bold font-Garamond text-gray-700">
                        {availability.occupied}
                      </div>
                      <div className="text-xs text-gray-600 font-Lora mt-1">Occupied</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-red-50">
                      <div className="text-2xl font-bold font-Garamond text-red-600">
                        {availability.blocked}
                      </div>
                      <div className="text-xs text-gray-600 font-Lora mt-1">Blocked</div>
                    </div>
                  </div>

                  {/* Next Available */}
                  <div className="p-3 rounded-lg border" style={{ borderColor: "#c49e72" }}>
                    <div className="text-xs text-gray-600 font-Lora mb-1">Status</div>
                    <div className="font-semibold font-Garamond" style={{ color: "#1e1e1e" }}>
                      {availability.available > 0 ? "Available Now" : "Fully Booked"}
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleManageAvailability(room)}
                    className="w-full px-4 py-3 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all"
                    style={{ backgroundColor: "#c49e72" }}
                  >
                    <FaEdit className="inline mr-2" />
                    Manage Availability
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Availability Management Modal */}
      {showAvailabilityModal && selectedRoom && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold font-Garamond" style={{ color: "#1e1e1e" }}>
                Manage Availability - {selectedRoom.name}
              </h2>
            </div>
            <div className="p-6">
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      From Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="from_date"
                      value={formData.from_date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none font-Lora"
                      style={{ borderColor: "#c49e72" }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      To Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="to_date"
                      value={formData.to_date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none font-Lora"
                      style={{ borderColor: "#c49e72" }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Available Rooms <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="available_rooms"
                      value={formData.available_rooms}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none font-Lora"
                      style={{ borderColor: "#c49e72" }}
                      placeholder="0"
                      min="0"
                      max={selectedRoom.total_rooms}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Blocked Rooms
                    </label>
                    <input
                      type="number"
                      name="blocked_rooms"
                      value={formData.blocked_rooms}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none font-Lora"
                      style={{ borderColor: "#c49e72" }}
                      placeholder="0"
                      min="0"
                      max={selectedRoom.total_rooms}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Minimum Stay (nights)
                    </label>
                    <input
                      type="number"
                      name="minimum_stay"
                      value={formData.minimum_stay}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none font-Lora"
                      style={{ borderColor: "#c49e72" }}
                      placeholder="1"
                      min="1"
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
                      placeholder="e.g., Maintenance, Special Event"
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
                    onClick={handleSaveAvailability}
                    className="flex-1 px-6 py-3 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all shadow-md"
                    style={{ backgroundColor: "#006938" }}
                  >
                    <FaCheckCircle className="inline mr-2" />
                    Save & Publish
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

export default RoomAvailability;

