// src/Pages/AdminDashboard/RestaurantCategories.jsx
import { useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaUtensils,
  FaSave,
  FaCheckCircle,
  FaSort,
} from "react-icons/fa";
import Swal from "sweetalert2";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryCounts,
} from "../../services/menuService";

const RestaurantCategories = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    display_order: 1,
    is_active: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await getAllCategories();
    if (error) {
      console.error("Error fetching categories:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load categories. Please try again.",
      });
    } else {
      setCategories(data || []);
    }

    // Get category counts
    const { data: counts } = await getCategoryCounts();
    if (counts) {
      setCategoryCounts(counts);
    }

    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      display_order: category.display_order,
      is_active: category.is_active,
    });
    setShowModal(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This category will be deleted. Menu items in this category will not be deleted but will need to be reassigned.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#006938",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      const { error } = await deleteCategory(categoryId);
      if (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to delete category. Please try again.",
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Category has been deleted successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
        fetchCategories();
      }
    }
  };

  const handleSaveCategory = async () => {
    // Validation
    if (!formData.name.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please enter a category name.",
      });
      return;
    }

    const categoryData = {
      name: formData.name,
      description: formData.description,
      display_order: parseInt(formData.display_order),
      is_active: formData.is_active,
    };

    let result;
    if (selectedCategory) {
      // Update existing category
      result = await updateCategory(selectedCategory.id, categoryData);
    } else {
      // Create new category
      result = await createCategory(categoryData);
    }

    if (result.error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Failed to ${selectedCategory ? "update" : "create"} category. Please try again.`,
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: `Category ${selectedCategory ? "updated" : "created"} successfully!`,
        timer: 2000,
        showConfirmButton: false,
      });
      handleCloseModal();
      fetchCategories();
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCategory(null);
    setFormData({
      name: "",
      description: "",
      display_order: 1,
      is_active: true,
    });
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

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2" style={{ borderColor: "#006938" }}></div>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-md">
          <FaUtensils className="mx-auto text-6xl mb-4" style={{ color: "#c49e72" }} />
          <h3 className="text-xl font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
            No Categories Yet
          </h3>
          <p className="text-gray-600 font-Lora mb-6">
            Get started by creating your first category
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all shadow-md"
            style={{ backgroundColor: "#006938" }}
          >
            <FaPlus className="inline mr-2" />
            Create First Category
          </button>
        </div>
      ) : (
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
                    Order: {category.display_order}
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
                    {categoryCounts[category.name] || 0}
                  </span>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 font-Lora">Status</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold font-Lora ${
                      category.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {category.is_active ? "Active" : "Inactive"}
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
      )}

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
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
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
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora resize-none"
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
                      name="display_order"
                      value={formData.display_order}
                      onChange={handleInputChange}
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
                    <label className="flex items-center space-x-2 mt-3">
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleInputChange}
                        className="w-5 h-5 rounded"
                        style={{ accentColor: "#006938" }}
                      />
                      <span className="text-sm font-Lora" style={{ color: "#1e1e1e" }}>
                        Active (Show on website)
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleSaveCategory}
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

