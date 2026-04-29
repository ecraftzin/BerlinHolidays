// src/Pages/MyAccount/MyAccount.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaSignOutAlt, FaCalendarAlt, FaArrowLeft, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { useAuth } from "../../Context/AuthContext";
import BreadCrumb from "../../BreadCrumb/BreadCrumb";

const MyAccount = () => {
  const navigate = useNavigate();
  const { user, customerProfile, isAuthenticated, loading, signOut, updateCustomerProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: ""
  });

  // Initialize form data when profile loads
  useEffect(() => {
    if (customerProfile) {
      setFormData({
        name: customerProfile.name || "",
        phone: customerProfile.phone || "",
        address: customerProfile.address || ""
      });
    }
  }, [customerProfile]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [loading, isAuthenticated, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrorMessage("");
    // Reset form to current profile data
    if (customerProfile) {
      setFormData({
        name: customerProfile.name || "",
        phone: customerProfile.phone || "",
        address: customerProfile.address || ""
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        throw new Error("Full name is required");
      }

      const updates = {
        name: formData.name.trim(),
        phone: formData.phone.trim() || null,
        address: formData.address.trim() || null
      };

      const { data, error } = await updateCustomerProfile(updates);

      if (error) {
        throw error;
      }

      setSuccessMessage("Profile updated successfully! Changes saved permanently.");
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage(error.message || "Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-whiteSmoke dark:bg-normalBlack">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-khaki"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <BreadCrumb title="My Account" pageName="My Account" />
      
      <section className="py-20 2xl:py-[120px] bg-whiteSmoke dark:bg-normalBlack">
        <div className="Container">
          <div className="max-w-3xl mx-auto">
            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">{successMessage}</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Account Card */}
            <div className="bg-white dark:bg-mediumBlack rounded-2xl shadow-xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-khaki to-khaki/80 px-8 py-10 text-center relative">
                <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center text-4xl font-bold text-khaki shadow-lg mb-4">
                  {formData.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white font-Garamond">
                  {formData.name || "User"}
                </h1>
                <p className="text-white/80 font-Lora mt-1">Welcome to your account</p>
                
                {/* Edit Toggle Button */}
                {!isEditing && (
                  <button
                    onClick={handleEditClick}
                    className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center gap-2 bg-white hover:bg-gray-100 text-khaki font-semibold py-2 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <FaEdit size={16} />
                    <span className="hidden sm:inline">Edit Profile</span>
                  </button>
                )}
              </div>

              {/* Profile Details or Edit Form */}
              <div className="p-8">
                {!isEditing ? (
                  <>
                    {/* View Mode */}
                    <h2 className="text-xl font-semibold text-lightBlack dark:text-white font-Garamond mb-6 border-b border-gray-200 dark:border-gray-700 pb-3">
                      Personal Information
                    </h2>
                    
                    <div className="space-y-5">
                      {/* Name */}
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-khaki/10 flex items-center justify-center flex-shrink-0">
                          <FaUser className="text-khaki" />
                        </div>
                        <div>
                          <p className="text-sm text-gray dark:text-lightGray font-Lora">Full Name</p>
                          <p className="text-lg text-lightBlack dark:text-white font-Garamond">
                            {customerProfile?.name || "Not provided"}
                          </p>
                        </div>
                      </div>

                      {/* Email */}
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-khaki/10 flex items-center justify-center flex-shrink-0">
                          <FaEnvelope className="text-khaki" />
                        </div>
                        <div>
                          <p className="text-sm text-gray dark:text-lightGray font-Lora">Email Address</p>
                          <p className="text-lg text-lightBlack dark:text-white font-Garamond">
                            {user?.email || customerProfile?.email || "Not provided"}
                          </p>
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-khaki/10 flex items-center justify-center flex-shrink-0">
                          <FaPhone className="text-khaki" />
                        </div>
                        <div>
                          <p className="text-sm text-gray dark:text-lightGray font-Lora">Phone Number</p>
                          <p className="text-lg text-lightBlack dark:text-white font-Garamond">
                            {customerProfile?.phone || "Not provided"}
                          </p>
                        </div>
                      </div>

                      {/* Address */}
                      {customerProfile?.address && (
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-khaki/10 flex items-center justify-center flex-shrink-0">
                            <FaUser className="text-khaki" />
                          </div>
                          <div>
                            <p className="text-sm text-gray dark:text-lightGray font-Lora">Address</p>
                            <p className="text-lg text-lightBlack dark:text-white font-Garamond">
                              {customerProfile.address}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    {/* Edit Mode */}
                    <h2 className="text-xl font-semibold text-lightBlack dark:text-white font-Garamond mb-6 border-b border-gray-200 dark:border-gray-700 pb-3">
                      Edit Personal Information
                    </h2>
                    
                    <form onSubmit={handleSave} className="space-y-6">
                      {/* Full Name Field */}
                      <div>
                        <label className="block text-sm font-semibold text-lightBlack dark:text-white font-Lora mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-mediumBlack text-lightBlack dark:text-white focus:outline-none focus:ring-2 focus:ring-khaki transition-all duration-300"
                          placeholder="Enter your full name"
                          disabled={isSaving}
                        />
                      </div>

                      {/* Phone Field */}
                      <div>
                        <label className="block text-sm font-semibold text-lightBlack dark:text-white font-Lora mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-mediumBlack text-lightBlack dark:text-white focus:outline-none focus:ring-2 focus:ring-khaki transition-all duration-300"
                          placeholder="Enter your phone number"
                          disabled={isSaving}
                        />
                      </div>

                      {/* Address Field */}
                      <div>
                        <label className="block text-sm font-semibold text-lightBlack dark:text-white font-Lora mb-2">
                          Address
                        </label>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          rows="3"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-mediumBlack text-lightBlack dark:text-white focus:outline-none focus:ring-2 focus:ring-khaki transition-all duration-300 resize-none"
                          placeholder="Enter your address"
                          disabled={isSaving}
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4 mt-8">
                        <button
                          type="submit"
                          disabled={isSaving}
                          className="flex-1 flex items-center justify-center gap-2 bg-khaki hover:bg-khaki/90 disabled:bg-gray-400 text-white font-Garamond uppercase tracking-wider py-4 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          <FaSave />
                          <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                        </button>
                        
                        <button
                          type="button"
                          onClick={handleCancel}
                          disabled={isSaving}
                          className="flex-1 flex items-center justify-center gap-2 bg-gray-400 hover:bg-gray-500 disabled:bg-gray-300 text-white font-Garamond uppercase tracking-wider py-4 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          <FaTimes />
                          <span>Cancel</span>
                        </button>
                      </div>
                    </form>
                  </>
                )}

                {/* Action Buttons (only show when not editing) */}
                {!isEditing && (
                  <div className="mt-10 flex flex-col sm:flex-row gap-4">
                    <Link
                      to="/my-bookings"
                      className="flex-1 flex items-center justify-center gap-2 bg-khaki hover:bg-khaki/90 text-white font-Garamond uppercase tracking-wider py-4 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <FaCalendarAlt />
                      <span>View My Bookings</span>
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-Garamond uppercase tracking-wider py-4 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <FaSignOutAlt />
                      <span>Logout</span>
                    </button>
                  </div>
                )}

                {/* Back to Home */}
                <div className="mt-6 text-center">
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-gray dark:text-lightGray hover:text-khaki transition-colors duration-300 font-Lora"
                  >
                    <FaArrowLeft size={14} />
                    <span>Back to Home</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MyAccount;

