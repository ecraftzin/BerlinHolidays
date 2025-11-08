// src/Pages/AdminDashboard/RoomTypes.jsx
import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaBed,
  FaUsers,
  FaRulerCombined,
  FaCheckCircle,
  FaUpload,
  FaWifi,
  FaSwimmingPool,
  FaCoffee,
  FaDumbbell,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { getAllRoomTypes, createRoomType, updateRoomType, deleteRoomType } from "../../services/roomService";
import { uploadImage } from "../../services/storageService";

// Available amenities list with icons
const AVAILABLE_AMENITIES = [
  { id: "2-5-persons", label: "2 - 5 Persons", icon: FaUsers },
  { id: "free-wifi", label: "Free WiFi Available", icon: FaWifi },
  { id: "swimming-pool", label: "Swimming Pools", icon: FaSwimmingPool },
  { id: "breakfast", label: "Breakfast", icon: FaCoffee },
  { id: "250-sqft", label: "250 SQFT Rooms", icon: FaRulerCombined },
  { id: "gym", label: "Gym facilities", icon: FaDumbbell },
  { id: "ac", label: "Air Conditioning", icon: null },
  { id: "tv", label: "Television", icon: null },
  { id: "mini-bar", label: "Mini Bar", icon: null },
  { id: "room-service", label: "Room Service", icon: null },
  { id: "parking", label: "Free Parking", icon: null },
  { id: "laundry", label: "Laundry Service", icon: null },
];

const RoomTypes = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [visibleRooms, setVisibleRooms] = useState(3); // Number of room type cards to display

  const [formData, setFormData] = useState({
    name: "",
    category_label: "",
    description: "",
    capacity: 2,
    size: "",
    base_price: "",
    bed_type: "",
    star_rating: 5,
    amenities: [],
    total_rooms: 0,
    images: [],
    check_in_time: "9:00 AM",
    check_out_time: "12:00 PM",
    early_check_in: true,
    house_rules: "",
    children_policy: "",
  });

  // Fetch room types on component mount
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
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAmenityToggle = (amenityLabel) => {
    setFormData((prev) => {
      const amenities = prev.amenities || [];
      const isSelected = amenities.includes(amenityLabel);

      if (isSelected) {
        // Remove amenity
        return {
          ...prev,
          amenities: amenities.filter((a) => a !== amenityLabel),
        };
      } else {
        // Add amenity
        return {
          ...prev,
          amenities: [...amenities, amenityLabel],
        };
      }
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const result = await uploadImage(file, "room-images");

    if (result.error) {
      Swal.fire("Error", "Failed to upload image", "error");
    } else {
      const imageUrl = result.data.publicUrl;
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), imageUrl],
      }));
      if (!imagePreview) {
        setImagePreview(imageUrl);
      }
      Swal.fire("Success", "Image uploaded successfully!", "success");
    }
    setUploadingImage(false);
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
    if (imagePreview === formData.images[indexToRemove]) {
      setImagePreview(formData.images[0] || null);
    }
  };

  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name || "",
      category_label: room.category_label || "",
      description: room.description || "",
      capacity: room.capacity || 2,
      size: room.size || "",
      base_price: room.base_price || "",
      bed_type: room.bed_type || "",
      star_rating: room.star_rating || 5,
      amenities: room.amenities || [],
      total_rooms: room.total_rooms || 0,
      images: room.images || [],
      check_in_time: room.check_in_time || "9:00 AM",
      check_out_time: room.check_out_time || "12:00 PM",
      early_check_in: room.early_check_in !== undefined ? room.early_check_in : true,
      house_rules: room.house_rules || "",
      children_policy: room.children_policy || "",
    });
    if (room.images && room.images.length > 0) {
      setImagePreview(room.images[0]);
    }
    setShowModal(true);
  };

  const handleDeleteRoom = async (id) => {
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
      const deleteResult = await deleteRoomType(id);
      if (deleteResult.error) {
        Swal.fire("Error", "Failed to delete room type", "error");
      } else {
        Swal.fire("Deleted!", "Room type has been deleted.", "success");
        fetchRoomTypes();
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRoom(null);
    setImagePreview(null);
    setFormData({
      name: "",
      category_label: "",
      description: "",
      capacity: 2,
      size: "",
      base_price: "",
      bed_type: "",
      star_rating: 5,
      amenities: [],
      total_rooms: 0,
      images: [],
      check_in_time: "9:00 AM",
      check_out_time: "12:00 PM",
      early_check_in: true,
      house_rules: "",
      children_policy: "",
    });
  };

  // Show more room type cards (3 at a time)
  const handleShowMoreRooms = () => {
    setVisibleRooms(prev => prev + 3);
  };

  const handleSaveRoom = async () => {
    // Validation
    if (!formData.name || !formData.base_price || !formData.capacity) {
      Swal.fire("Error", "Please fill in all required fields", "error");
      return;
    }

    const roomData = {
      ...formData,
      slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      base_price: parseFloat(formData.base_price),
      capacity: parseInt(formData.capacity),
      total_rooms: parseInt(formData.total_rooms),
    };

    let result;
    if (editingRoom) {
      result = await updateRoomType(editingRoom.id, roomData);
    } else {
      result = await createRoomType(roomData);
    }

    if (result.error) {
      Swal.fire("Error", "Failed to save room type", "error");
    } else {
      Swal.fire("Success", `Room type ${editingRoom ? "updated" : "created"} successfully!`, "success");
      handleCloseModal();
      fetchRoomTypes();
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-Garamond" style={{ color: "#1e1e1e" }}>
            Room Types
          </h1>
          <p className="text-gray-600 font-Lora mt-1">
            Manage your room categories and configurations
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all shadow-md flex items-center space-x-2"
            style={{ backgroundColor: "#006938" }}
          >
            <FaPlus />
            <span>Add Room Type</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-600 font-Lora">Loading room types...</div>
        </div>
      ) : roomTypes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12 text-center">
          <FaBed className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
            No Room Types Yet
          </h3>
          <p className="text-gray-600 font-Lora mb-6">
            Get started by adding your first room type
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all shadow-md inline-flex items-center space-x-2"
            style={{ backgroundColor: "#006938" }}
          >
            <FaPlus />
            <span>Add Room Type</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Room Counter Display */}
          {roomTypes.length > 0 && (
            <div className="flex items-center justify-between p-4 rounded-lg border-2" style={{ backgroundColor: "#f7f5f2", borderColor: "#c49e72" }}>
              <div className="flex items-center space-x-3">
                <FaBed className="text-2xl" style={{ color: "#c49e72" }} />
                <div>
                  <p className="text-sm font-Lora text-gray-600">Displaying Room Types</p>
                  <p className="text-xl font-bold font-Garamond" style={{ color: "#1e1e1e" }}>
                    {roomTypes.length > 0 ? `1 >> ${Math.min(visibleRooms, roomTypes.length)}` : '0 >> 0'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-Lora text-gray-600">Total Room Types</p>
                <p className="text-2xl font-bold font-Garamond" style={{ color: "#006938" }}>
                  {roomTypes.length}
                </p>
              </div>
            </div>
          )}

          {/* Room Types Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roomTypes.slice(0, visibleRooms).map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Room Image */}
              <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center overflow-hidden">
                {room.images && room.images.length > 0 ? (
                  <img
                    src={room.images[0]}
                    alt={room.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentElement.innerHTML = '<div class="flex items-center justify-center w-full h-full"><svg class="text-6xl text-gray-400 w-24 h-24" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg></div>';
                    }}
                  />
                ) : (
                  <FaBed className="text-6xl text-gray-400" />
                )}
              </div>

              {/* Room Details */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    {room.category_label && (
                      <p className="text-xs font-semibold font-Lora uppercase mb-1" style={{ color: "#c49e72" }}>
                        {room.category_label}
                      </p>
                    )}
                    <h3 className="text-xl font-bold font-Garamond" style={{ color: "#1e1e1e" }}>
                      {room.name}
                    </h3>
                    <p className="text-sm text-gray-600 font-Lora mt-1">
                      {room.description}
                    </p>
                  </div>
                  {room.star_rating && (
                    <div className="flex items-center ml-2">
                      {[...Array(room.star_rating)].map((_, i) => (
                        <span key={i} className="text-yellow-400">★</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Room Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-gray-600 font-Lora">
                      <FaUsers className="mr-2" style={{ color: "#c49e72" }} />
                      Capacity
                    </span>
                    <span className="font-semibold font-Lora" style={{ color: "#1e1e1e" }}>
                      {room.capacity} Guests
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-gray-600 font-Lora">
                      <FaRulerCombined className="mr-2" style={{ color: "#c49e72" }} />
                      Size
                    </span>
                    <span className="font-semibold font-Lora" style={{ color: "#1e1e1e" }}>
                      {room.size}
                    </span>
                  </div>
                  {room.bed_type && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center text-gray-600 font-Lora">
                        <FaBed className="mr-2" style={{ color: "#c49e72" }} />
                        Bed Type
                      </span>
                      <span className="font-semibold font-Lora" style={{ color: "#1e1e1e" }}>
                        {room.bed_type}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 font-Lora">Base Price</span>
                    <span className="font-bold font-Garamond text-lg" style={{ color: "#006938" }}>
                      ₹{room.base_price}
                    </span>
                  </div>
                </div>

                {/* Amenities */}
                {room.amenities && room.amenities.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 font-Lora mb-2">Amenities:</p>
                    <div className="flex flex-wrap gap-2">
                      {room.amenities.map((amenity, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 rounded-full text-xs font-Lora bg-gray-100 text-gray-700"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Total Rooms */}
                <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: "#f7f5f2" }}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 font-Lora">Total Rooms</span>
                    <span className="font-semibold font-Lora" style={{ color: "#1e1e1e" }}>
                      {room.total_rooms}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditRoom(room)}
                    className="flex-1 px-4 py-2 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all"
                    style={{ backgroundColor: "#c49e72" }}
                  >
                    <FaEdit className="inline mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteRoom(room.id)}
                    className="px-4 py-2 rounded-lg border-2 border-red-500 text-red-500 font-Lora font-semibold hover:bg-red-50 transition-all"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
          </div>

          {/* Show More Button */}
          {visibleRooms < roomTypes.length && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleShowMoreRooms}
                className="px-8 py-3 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all shadow-md flex items-center space-x-2"
                style={{ backgroundColor: "#c49e72" }}
              >
                <FaPlus />
                <span>Show More Rooms (3 more)</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold font-Garamond" style={{ color: "#1e1e1e" }}>
                {editingRoom ? "Edit Room Type" : "Add New Room Type"}
              </h2>
            </div>

            <div className="p-6">
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Room Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                      style={{ borderColor: "#c49e72" }}
                      placeholder="e.g., Deluxe Suite"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Category Label
                    </label>
                    <input
                      type="text"
                      name="category_label"
                      value={formData.category_label}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                      style={{ borderColor: "#c49e72" }}
                      placeholder="e.g., LUXURY ROOM"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Base Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="base_price"
                      value={formData.base_price}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                      style={{ borderColor: "#c49e72" }}
                      placeholder="5000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Capacity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                      style={{ borderColor: "#c49e72" }}
                      placeholder="2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Size (sq ft)
                    </label>
                    <input
                      type="text"
                      name="size"
                      value={formData.size}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                      style={{ borderColor: "#c49e72" }}
                      placeholder="500 SQ FT/Rooms"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Bed Type
                    </label>
                    <input
                      type="text"
                      name="bed_type"
                      value={formData.bed_type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                      style={{ borderColor: "#c49e72" }}
                      placeholder="e.g., 2 King Bed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Star Rating
                    </label>
                    <select
                      name="star_rating"
                      value={formData.star_rating}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                      style={{ borderColor: "#c49e72" }}
                    >
                      <option value="1">1 Star</option>
                      <option value="2">2 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="5">5 Stars</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Total Rooms
                    </label>
                    <input
                      type="number"
                      name="total_rooms"
                      value={formData.total_rooms}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                      style={{ borderColor: "#c49e72" }}
                      placeholder="10"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Check-in Time
                    </label>
                    <input
                      type="text"
                      name="check_in_time"
                      value={formData.check_in_time}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                      style={{ borderColor: "#c49e72" }}
                      placeholder="9:00 AM - anytime"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Check-out Time
                    </label>
                    <input
                      type="text"
                      name="check_out_time"
                      value={formData.check_out_time}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                      style={{ borderColor: "#c49e72" }}
                      placeholder="Before noon"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold font-Garamond mb-3" style={{ color: "#1e1e1e" }}>
                      Amenities
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 border border-gray-200 rounded-lg" style={{ borderColor: "#c49e72" }}>
                      {AVAILABLE_AMENITIES.map((amenity) => {
                        const Icon = amenity.icon;
                        const isSelected = formData.amenities.includes(amenity.label);

                        return (
                          <label
                            key={amenity.id}
                            className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                              isSelected
                                ? "border-opacity-100 bg-opacity-10"
                                : "border-gray-200 hover:border-opacity-50"
                            }`}
                            style={{
                              borderColor: isSelected ? "#c49e72" : undefined,
                              backgroundColor: isSelected ? "#f7f5f2" : undefined,
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleAmenityToggle(amenity.label)}
                              className="w-5 h-5 rounded accent-[#c49e72] cursor-pointer"
                            />
                            {Icon && <Icon className="text-lg" style={{ color: isSelected ? "#c49e72" : "#6b7280" }} />}
                            <span className={`font-Lora text-sm ${isSelected ? "font-semibold" : ""}`} style={{ color: isSelected ? "#1e1e1e" : "#6b7280" }}>
                              {amenity.label}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                    <p className="text-xs text-gray-500 font-Lora mt-2">
                      Select all amenities that apply to this room type
                    </p>
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
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                      style={{ borderColor: "#c49e72" }}
                      placeholder="Enter room description"
                    ></textarea>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      House Rules
                    </label>
                    <textarea
                      name="house_rules"
                      value={formData.house_rules}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                      style={{ borderColor: "#c49e72" }}
                      placeholder="Enter house rules (e.g., No smoking, No pets, etc.)"
                    ></textarea>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Children & Extra Beds Policy
                    </label>
                    <textarea
                      name="children_policy"
                      value={formData.children_policy}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                      style={{ borderColor: "#c49e72" }}
                      placeholder="Enter children and extra beds policy"
                    ></textarea>
                  </div>

                  {/* Room Images */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Room Images
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="file"
                        id="room-image-upload"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById('room-image-upload').click()}
                        disabled={uploadingImage}
                        className="px-6 py-3 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: "#c49e72" }}
                      >
                        <FaUpload />
                        <span>{uploadingImage ? "Uploading..." : "Upload Image"}</span>
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 font-Lora mt-1">
                      Upload multiple room images. Recommended size: 1200x800px, max 5MB each
                    </p>

                    {/* All Images Preview */}
                    {formData.images && formData.images.length > 0 && (
                      <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">
                        {formData.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image}
                              alt={`Room ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <FaTrash className="text-xs" />
                            </button>
                            {index === 0 && (
                              <span className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded font-Lora">
                                Primary
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleSaveRoom}
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

export default RoomTypes;

