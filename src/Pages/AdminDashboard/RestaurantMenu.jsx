// src/Pages/AdminDashboard/RestaurantMenu.jsx
import React, { useState } from "react";
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

const RestaurantMenu = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [filterVeg, setFilterVeg] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      name: "Kerala Breakfast Platter",
      category: "breakfast",
      price: 350,
      isVeg: true,
      spiceLevel: 1,
      available: true,
      description: "Traditional Kerala breakfast with appam, puttu, and curry",
    },
    {
      id: 2,
      name: "Wayanad Special Biryani",
      category: "lunch",
      price: 450,
      isVeg: false,
      spiceLevel: 3,
      available: true,
      description: "Aromatic biryani with local spices",
    },
    {
      id: 3,
      name: "Grilled Fish",
      category: "dinner",
      price: 550,
      isVeg: false,
      spiceLevel: 2,
      available: true,
      description: "Fresh catch grilled to perfection",
    },
    {
      id: 4,
      name: "Masala Chai",
      category: "beverages",
      price: 80,
      isVeg: true,
      spiceLevel: 1,
      available: true,
      description: "Traditional spiced tea",
    },
  ]);

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleDeleteItem = (itemId) => {
    if (window.confirm("Are you sure you want to delete this menu item?")) {
      setMenuItems(menuItems.filter((item) => item.id !== itemId));
      alert("Menu item deleted successfully!");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  const categories = [
    { id: "all", name: "All Items", count: 56 },
    { id: "breakfast", name: "Breakfast", count: 15 },
    { id: "lunch", name: "Lunch", count: 18 },
    { id: "dinner", name: "Dinner", count: 16 },
    { id: "beverages", name: "Beverages", count: 7 },
  ];

  const getSpiceIndicator = (level) => {
    return Array(level).fill("🌶️").join("");
  };

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
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-lg font-Lora font-semibold transition-all ${
                  activeCategory === cat.id
                    ? "text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                style={
                  activeCategory === cat.id
                    ? { backgroundColor: "#c49e72" }
                    : {}
                }
              >
                {cat.name} ({cat.count})
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

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Item Image Placeholder */}
            <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <FaUtensils className="text-6xl text-gray-400" />
            </div>

            {/* Item Details */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-bold font-Garamond" style={{ color: "#1e1e1e" }}>
                      {item.name}
                    </h3>
                    {item.isVeg && (
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
                    {item.category}
                  </span>
                </div>
                {item.spiceLevel > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 font-Lora">Spice Level</span>
                    <span className="text-sm">{getSpiceIndicator(item.spiceLevel)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 font-Lora">Availability</span>
                  <button className="flex items-center space-x-1">
                    {item.available ? (
                      <FaToggleOn className="text-2xl" style={{ color: "#006938" }} />
                    ) : (
                      <FaToggleOff className="text-2xl text-gray-400" />
                    )}
                  </button>
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
                      defaultValue={selectedItem?.name || ""}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                      style={{ borderColor: "#c49e72" }}
                      placeholder="e.g., Kerala Breakfast Platter"
                    />
                  </div>

                  {/* Item Image */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Item Image
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="text"
                        defaultValue={selectedItem?.image || ""}
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                        style={{ borderColor: "#c49e72" }}
                        placeholder="Image URL or upload"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.onchange = (e) => {
                            const file = e.target.files[0];
                            if (file) {
                              alert(`Image "${file.name}" selected. In production, this would upload to your server.`);
                            }
                          };
                          input.click();
                        }}
                        className="px-6 py-3 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all flex items-center space-x-2"
                        style={{ backgroundColor: "#c49e72" }}
                      >
                        <FaUpload />
                        <span>Upload</span>
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 font-Lora mt-1">
                      Recommended size: 800x600px
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      defaultValue={selectedItem?.category || ""}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                      style={{ borderColor: "#c49e72" }}
                    >
                      <option value="breakfast">Breakfast</option>
                      <option value="lunch">Lunch</option>
                      <option value="dinner">Dinner</option>
                      <option value="beverages">Beverages</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      defaultValue={selectedItem?.price || ""}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                      style={{ borderColor: "#c49e72" }}
                      placeholder="350"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Spice Level
                    </label>
                    <select
                      defaultValue={selectedItem?.spiceLevel || "0"}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                      style={{ borderColor: "#c49e72" }}
                    >
                      <option value="0">None</option>
                      <option value="1">Mild 🌶️</option>
                      <option value="2">Medium 🌶️🌶️</option>
                      <option value="3">Hot 🌶️🌶️🌶️</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        defaultChecked={selectedItem?.isVeg || false}
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
                        className="w-5 h-5 rounded"
                        style={{ accentColor: "#006938" }}
                        defaultChecked={selectedItem?.available !== false}
                      />
                      <span className="text-sm font-Lora" style={{ color: "#1e1e1e" }}>
                        Available
                      </span>
                    </label>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Description
                    </label>
                    <textarea
                      rows="3"
                      defaultValue={selectedItem?.description || ""}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                      style={{ borderColor: "#c49e72" }}
                      placeholder="Enter item description"
                    ></textarea>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      alert(selectedItem ? "Menu item updated successfully!" : "Menu item created successfully!");
                      handleCloseModal();
                    }}
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

