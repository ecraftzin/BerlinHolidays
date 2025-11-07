// src/Pages/AdminDashboard/RestaurantCategories.jsx
import React, { useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaUtensils,
  FaSave,
  FaCheckCircle,
  FaSort,
} from "react-icons/fa";

const RestaurantCategories = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Breakfast",
      description: "Morning delights and traditional Kerala breakfast items",
      itemCount: 15,
      displayOrder: 1,
      isActive: true,
    },
    {
      id: 2,
      name: "Lunch",
      description: "Hearty lunch options featuring local and international cuisine",
      itemCount: 18,
      displayOrder: 2,
      isActive: true,
    },
    {
      id: 3,
      name: "Dinner",
      description: "Evening dining with specialty dishes and grills",
      itemCount: 16,
      displayOrder: 3,
      isActive: true,
    },
    {
      id: 4,
      name: "Beverages",
      description: "Refreshing drinks, teas, and specialty beverages",
      itemCount: 7,
      displayOrder: 4,
      isActive: true,
    },
    {
      id: 5,
      name: "Desserts",
      description: "Sweet treats and traditional desserts",
      itemCount: 8,
      displayOrder: 5,
      isActive: true,
    },
  ]);

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const handleDeleteCategory = (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category? All menu items in this category will be affected.")) {
      setCategories(categories.filter((cat) => cat.id !== categoryId));
      alert("Category deleted successfully!");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCategory(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-Garamond" style={{ color: "#1e1e1e" }}>
            Restaurant Categories
          </h1>
          <p className="text-gray-600 font-Lora mt-1">
            Organize your menu items into categories
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="mt-4 md:mt-0 px-6 py-3 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all shadow-md flex items-center space-x-2"
          style={{ backgroundColor: "#006938" }}
        >
          <FaPlus />
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6" style={{ backgroundColor: "#f7f5f2" }}>
              <div className="flex items-center justify-between mb-2">
                <FaUtensils className="text-2xl" style={{ color: "#c49e72" }} />
                <span className="text-sm font-Lora text-gray-600">
                  Order: {category.displayOrder}
                </span>
              </div>
              <h3 className="text-xl font-bold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                {category.name}
              </h3>
              <p className="text-sm text-gray-600 font-Lora line-clamp-2">
                {category.description}
              </p>
            </div>

            <div className="p-6 space-y-4">
              {/* Stats */}
              <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: "#f7f5f2" }}>
                <span className="text-sm text-gray-600 font-Lora">Menu Items</span>
                <span className="text-xl font-bold font-Garamond" style={{ color: "#006938" }}>
                  {category.itemCount}
                </span>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 font-Lora">Status</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold font-Lora ${
                    category.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {category.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-2">
                <button
                  onClick={() => handleEditCategory(category)}
                  className="flex-1 px-4 py-2 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all"
                  style={{ backgroundColor: "#c49e72" }}
                >
                  <FaEdit className="inline mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
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
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold font-Garamond" style={{ color: "#1e1e1e" }}>
                {selectedCategory ? "Edit Category" : "Add New Category"}
              </h2>
            </div>

            <div className="p-6">
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Category Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedCategory?.name || ""}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                      style={{ borderColor: "#c49e72" }}
                      placeholder="e.g., Breakfast, Lunch, Dinner"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Description
                    </label>
                    <textarea
                      rows="3"
                      defaultValue={selectedCategory?.description || ""}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                      style={{ borderColor: "#c49e72" }}
                      placeholder="Brief description of this category"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Display Order <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      defaultValue={selectedCategory?.displayOrder || ""}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                      style={{ borderColor: "#c49e72" }}
                      placeholder="1"
                      min="1"
                    />
                    <p className="text-xs text-gray-500 font-Lora mt-1">
                      Lower numbers appear first
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Status
                    </label>
                    <select
                      defaultValue={selectedCategory?.isActive ? "active" : "inactive"}
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
                      alert(selectedCategory ? "Category updated successfully!" : "Category created successfully!");
                      handleCloseModal();
                    }}
                    className="flex-1 px-6 py-3 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all shadow-md"
                    style={{ backgroundColor: "#006938" }}
                  >
                    <FaCheckCircle className="inline mr-2" />
                    {selectedCategory ? "Update Category" : "Save & Publish"}
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

export default RestaurantCategories;

