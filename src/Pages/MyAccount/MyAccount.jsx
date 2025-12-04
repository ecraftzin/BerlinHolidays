// src/Pages/MyAccount/MyAccount.jsx
import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaSignOutAlt, FaCalendarAlt, FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../../Context/AuthContext";
import BreadCrumb from "../../BreadCrumb/BreadCrumb";

const MyAccount = () => {
  const navigate = useNavigate();
  const { user, customerProfile, isAuthenticated, loading, signOut } = useAuth();

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
            {/* Account Card */}
            <div className="bg-white dark:bg-mediumBlack rounded-2xl shadow-xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-khaki to-khaki/80 px-8 py-10 text-center">
                <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center text-4xl font-bold text-khaki shadow-lg mb-4">
                  {customerProfile?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white font-Garamond">
                  {customerProfile?.name || "User"}
                </h1>
                <p className="text-white/80 font-Lora mt-1">Welcome to your account</p>
              </div>

              {/* Profile Details */}
              <div className="p-8">
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
                </div>

                {/* Action Buttons */}
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

