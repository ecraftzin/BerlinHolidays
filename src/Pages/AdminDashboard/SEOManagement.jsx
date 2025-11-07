// src/Pages/AdminDashboard/SEOManagement.jsx
import React, { useState } from "react";
import { FaSave, FaGlobe, FaImage, FaSearch, FaCheckCircle, FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const SEOManagement = () => {
  const [activeTab, setActiveTab] = useState("global");
  const [formData, setFormData] = useState({
    siteTitle: "Berlin Holidays - Luxury Resort in Wayanad",
    siteDescription: "Experience luxury and nature at Berlin Holidays, Wayanad's premier resort destination.",
    siteKeywords: "wayanad resort, luxury hotel wayanad, berlin holidays, kerala resort",
    ogImage: "",
    twitterCard: "summary_large_image",
    canonical: "https://berlinholidays.com",
    robotsIndex: true,
    robotsFollow: true,
  });

  // Page SEO state
  const [selectedPage, setSelectedPage] = useState(null);
  const [showPageForm, setShowPageForm] = useState(false);
  const [pageFormData, setPageFormData] = useState({
    pageName: "",
    pageUrl: "",
    pageTitle: "",
    pageDescription: "",
    pageKeywords: "",
    pageOgImage: "",
    pageCanonical: "",
    pageRobotsIndex: true,
    pageRobotsFollow: true,
  });

  const [pageSEOList, setPageSEOList] = useState([
    {
      id: 1,
      pageName: "Home",
      pageUrl: "/",
      pageTitle: "Berlin Holidays - Luxury Resort in Wayanad",
      pageDescription: "Experience luxury and nature at Berlin Holidays, Wayanad's premier resort destination.",
      pageKeywords: "wayanad resort, luxury hotel, berlin holidays",
      pageOgImage: "",
      pageCanonical: "https://berlinholidays.com",
      pageRobotsIndex: true,
      pageRobotsFollow: true,
    },
    {
      id: 2,
      pageName: "About Us",
      pageUrl: "/about",
      pageTitle: "About Berlin Holidays - Our Story",
      pageDescription: "Learn about Berlin Holidays, Wayanad's premier luxury resort destination.",
      pageKeywords: "about berlin holidays, wayanad resort story",
      pageOgImage: "",
      pageCanonical: "https://berlinholidays.com/about",
      pageRobotsIndex: true,
      pageRobotsFollow: true,
    },
    {
      id: 3,
      pageName: "Rooms",
      pageUrl: "/room",
      pageTitle: "Luxury Rooms & Suites - Berlin Holidays",
      pageDescription: "Explore our luxury rooms and suites at Berlin Holidays, Wayanad.",
      pageKeywords: "luxury rooms wayanad, hotel suites, berlin holidays rooms",
      pageOgImage: "",
      pageCanonical: "https://berlinholidays.com/room",
      pageRobotsIndex: true,
      pageRobotsFollow: true,
    },
    {
      id: 4,
      pageName: "Blog",
      pageUrl: "/blog",
      pageTitle: "Blog - Berlin Holidays",
      pageDescription: "Read our latest articles about travel, Wayanad, and luxury hospitality.",
      pageKeywords: "wayanad blog, travel blog, berlin holidays news",
      pageOgImage: "",
      pageCanonical: "https://berlinholidays.com/blog",
      pageRobotsIndex: true,
      pageRobotsFollow: true,
    },
    {
      id: 5,
      pageName: "Contact",
      pageUrl: "/contact",
      pageTitle: "Contact Us - Berlin Holidays",
      pageDescription: "Get in touch with Berlin Holidays for bookings and inquiries.",
      pageKeywords: "contact berlin holidays, wayanad resort contact",
      pageOgImage: "",
      pageCanonical: "https://berlinholidays.com/contact",
      pageRobotsIndex: true,
      pageRobotsFollow: true,
    },
  ]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSave = (isDraft = false) => {
    console.log("Saving SEO settings:", formData, "Draft:", isDraft);
    alert(isDraft ? "Saved as draft!" : "Published successfully!");
  };

  // Page SEO handlers
  const handlePageInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPageFormData({
      ...pageFormData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAddNewPage = () => {
    setSelectedPage(null);
    setPageFormData({
      pageName: "",
      pageUrl: "",
      pageTitle: "",
      pageDescription: "",
      pageKeywords: "",
      pageOgImage: "",
      pageCanonical: "",
      pageRobotsIndex: true,
      pageRobotsFollow: true,
    });
    setShowPageForm(true);
  };

  const handleEditPage = (page) => {
    setSelectedPage(page);
    setPageFormData({
      pageName: page.pageName,
      pageUrl: page.pageUrl,
      pageTitle: page.pageTitle,
      pageDescription: page.pageDescription,
      pageKeywords: page.pageKeywords,
      pageOgImage: page.pageOgImage,
      pageCanonical: page.pageCanonical,
      pageRobotsIndex: page.pageRobotsIndex,
      pageRobotsFollow: page.pageRobotsFollow,
    });
    setShowPageForm(true);
  };

  const handleDeletePage = (id) => {
    if (window.confirm("Are you sure you want to delete this page SEO?")) {
      setPageSEOList(pageSEOList.filter((page) => page.id !== id));
      alert("Page SEO deleted successfully!");
    }
  };

  const handleSavePageSEO = (isDraft = false) => {
    if (selectedPage) {
      // Update existing page
      setPageSEOList(
        pageSEOList.map((page) =>
          page.id === selectedPage.id
            ? { ...selectedPage, ...pageFormData }
            : page
        )
      );
      alert(isDraft ? "Page SEO saved as draft!" : "Page SEO published successfully!");
    } else {
      // Add new page
      const newPage = {
        id: Date.now(),
        ...pageFormData,
      };
      setPageSEOList([...pageSEOList, newPage]);
      alert(isDraft ? "Page SEO saved as draft!" : "Page SEO published successfully!");
    }
    setShowPageForm(false);
    setSelectedPage(null);
  };

  const handleCancelPageForm = () => {
    setShowPageForm(false);
    setSelectedPage(null);
  };

  const tabs = [
    { id: "global", label: "Global Settings", icon: FaGlobe },
    { id: "pages", label: "Page SEO", icon: FaSearch },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-Garamond" style={{ color: "#1e1e1e" }}>
            SEO Management
          </h1>
          <p className="text-gray-600 font-Lora mt-1">
            Optimize your website for search engines
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-6 py-4 font-Lora font-semibold transition-all ${
                activeTab === tab.id
                  ? "text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              style={
                activeTab === tab.id
                  ? { backgroundColor: "#c49e72" }
                  : {}
              }
            >
              <tab.icon className="inline mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Global Settings Tab */}
        {activeTab === "global" && (
          <div className="p-6">
            <form className="space-y-6">
              {/* Site Title */}
              <div>
                <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                  Site Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="siteTitle"
                  value={formData.siteTitle}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                  style={{ borderColor: "#c49e72" }}
                  placeholder="Enter site title"
                />
                <p className="text-xs text-gray-500 font-Lora mt-1">
                  Recommended: 50-60 characters
                </p>
              </div>

              {/* Meta Description */}
              <div>
                <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                  Meta Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="siteDescription"
                  value={formData.siteDescription}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                  style={{ borderColor: "#c49e72" }}
                  placeholder="Enter meta description"
                ></textarea>
                <p className="text-xs text-gray-500 font-Lora mt-1">
                  Recommended: 150-160 characters
                </p>
              </div>

              {/* Keywords */}
              <div>
                <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                  Meta Keywords
                </label>
                <input
                  type="text"
                  name="siteKeywords"
                  value={formData.siteKeywords}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                  style={{ borderColor: "#c49e72" }}
                  placeholder="keyword1, keyword2, keyword3"
                />
                <p className="text-xs text-gray-500 font-Lora mt-1">
                  Separate keywords with commas
                </p>
              </div>

              {/* Canonical URL */}
              <div>
                <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                  Canonical URL
                </label>
                <input
                  type="url"
                  name="canonical"
                  value={formData.canonical}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                  style={{ borderColor: "#c49e72" }}
                  placeholder="https://example.com"
                />
              </div>

              {/* OG Image */}
              <div>
                <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                  Open Graph Image
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    name="ogImage"
                    value={formData.ogImage}
                    onChange={handleInputChange}
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
                          alert(`Image "${file.name}" selected. In production, this would upload to your server and update the URL field.`);
                          // In production, you would upload the file and set the URL:
                          // const url = await uploadImage(file);
                          // setFormData({...formData, ogImage: url});
                        }
                      };
                      input.click();
                    }}
                    className="px-6 py-3 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all"
                    style={{ backgroundColor: "#c49e72" }}
                  >
                    <FaImage className="inline mr-2" />
                    Upload
                  </button>
                </div>
                <p className="text-xs text-gray-500 font-Lora mt-1">
                  Recommended: 1200x630px
                </p>
              </div>

              {/* Twitter Card */}
              <div>
                <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                  Twitter Card Type
                </label>
                <select
                  name="twitterCard"
                  value={formData.twitterCard}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                  style={{ borderColor: "#c49e72" }}
                >
                  <option value="summary">Summary</option>
                  <option value="summary_large_image">Summary Large Image</option>
                  <option value="app">App</option>
                  <option value="player">Player</option>
                </select>
              </div>

              {/* Robots Meta */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="robotsIndex"
                    checked={formData.robotsIndex}
                    onChange={handleInputChange}
                    className="w-5 h-5 rounded"
                    style={{ accentColor: "#c49e72" }}
                  />
                  <label className="text-sm font-Lora" style={{ color: "#1e1e1e" }}>
                    Allow search engines to index
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="robotsFollow"
                    checked={formData.robotsFollow}
                    onChange={handleInputChange}
                    className="w-5 h-5 rounded"
                    style={{ accentColor: "#c49e72" }}
                  />
                  <label className="text-sm font-Lora" style={{ color: "#1e1e1e" }}>
                    Allow search engines to follow links
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => handleSave(false)}
                  className="flex-1 px-6 py-3 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all shadow-md"
                  style={{ backgroundColor: "#006938" }}
                >
                  <FaCheckCircle className="inline mr-2" />
                  Save & Publish
                </button>
                <button
                  type="button"
                  onClick={() => handleSave(true)}
                  className="flex-1 px-6 py-3 rounded-lg border-2 font-Lora font-semibold hover:bg-gray-50 transition-all"
                  style={{ borderColor: "#c49e72", color: "#c49e72" }}
                >
                  <FaSave className="inline mr-2" />
                  Save as Draft
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Page SEO Tab */}
        {activeTab === "pages" && (
          <div className="p-6">
            {!showPageForm ? (
              <>
                {/* Header with Add Button */}
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold font-Garamond" style={{ color: "#1e1e1e" }}>
                      Page-Specific SEO
                    </h2>
                    <p className="text-gray-600 font-Lora text-sm mt-1">
                      Manage SEO settings for individual pages
                    </p>
                  </div>
                  <button
                    onClick={handleAddNewPage}
                    className="px-6 py-3 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all shadow-md flex items-center"
                    style={{ backgroundColor: "#006938" }}
                  >
                    <FaPlus className="mr-2" />
                    Add New Page
                  </button>
                </div>

                {/* Pages List */}
                <div className="space-y-4">
                  {pageSEOList.map((page) => (
                    <div
                      key={page.id}
                      className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all"
                      style={{ borderColor: "#c49e72", borderWidth: "1px" }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold font-Garamond" style={{ color: "#1e1e1e" }}>
                              {page.pageName}
                            </h3>
                            <span className="text-sm font-Lora px-3 py-1 rounded-full" style={{ backgroundColor: "#f7f5f2", color: "#c49e72" }}>
                              {page.pageUrl}
                            </span>
                          </div>
                          <p className="text-sm font-Lora text-gray-700 mb-1">
                            <strong>Title:</strong> {page.pageTitle}
                          </p>
                          <p className="text-sm font-Lora text-gray-600 mb-2">
                            <strong>Description:</strong> {page.pageDescription}
                          </p>
                          <div className="flex gap-4 text-xs font-Lora text-gray-500">
                            <span>
                              Index: {page.pageRobotsIndex ? "✓ Yes" : "✗ No"}
                            </span>
                            <span>
                              Follow: {page.pageRobotsFollow ? "✓ Yes" : "✗ No"}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleEditPage(page)}
                            className="px-4 py-2 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all"
                            style={{ backgroundColor: "#c49e72" }}
                          >
                            <FaEdit className="inline mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeletePage(page.id)}
                            className="px-4 py-2 rounded-lg bg-red-500 text-white font-Lora font-semibold hover:opacity-90 transition-all"
                          >
                            <FaTrash className="inline mr-1" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                {/* Page SEO Form */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold font-Garamond" style={{ color: "#1e1e1e" }}>
                    {selectedPage ? "Edit Page SEO" : "Add New Page SEO"}
                  </h2>
                  <p className="text-gray-600 font-Lora text-sm mt-1">
                    Configure SEO settings for this page
                  </p>
                </div>

                <form className="space-y-6">
                  {/* Page Name */}
                  <div>
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Page Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="pageName"
                      value={pageFormData.pageName}
                      onChange={handlePageInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                      style={{ borderColor: "#c49e72" }}
                      placeholder="e.g., Home, About Us, Contact"
                    />
                  </div>

                  {/* Page URL */}
                  <div>
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Page URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="pageUrl"
                      value={pageFormData.pageUrl}
                      onChange={handlePageInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                      style={{ borderColor: "#c49e72" }}
                      placeholder="e.g., /, /about, /contact"
                    />
                  </div>

                  {/* Page Title */}
                  <div>
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Page Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="pageTitle"
                      value={pageFormData.pageTitle}
                      onChange={handlePageInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                      style={{ borderColor: "#c49e72" }}
                      placeholder="Enter page title"
                    />
                    <p className="text-xs text-gray-500 font-Lora mt-1">
                      Recommended: 50-60 characters
                    </p>
                  </div>

                  {/* Page Meta Description */}
                  <div>
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Meta Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="pageDescription"
                      value={pageFormData.pageDescription}
                      onChange={handlePageInputChange}
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                      style={{ borderColor: "#c49e72" }}
                      placeholder="Enter meta description"
                    ></textarea>
                    <p className="text-xs text-gray-500 font-Lora mt-1">
                      Recommended: 150-160 characters
                    </p>
                  </div>

                  {/* Page Keywords */}
                  <div>
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Meta Keywords
                    </label>
                    <input
                      type="text"
                      name="pageKeywords"
                      value={pageFormData.pageKeywords}
                      onChange={handlePageInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                      style={{ borderColor: "#c49e72" }}
                      placeholder="keyword1, keyword2, keyword3"
                    />
                    <p className="text-xs text-gray-500 font-Lora mt-1">
                      Separate keywords with commas
                    </p>
                  </div>

                  {/* Page Canonical URL */}
                  <div>
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Canonical URL
                    </label>
                    <input
                      type="url"
                      name="pageCanonical"
                      value={pageFormData.pageCanonical}
                      onChange={handlePageInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                      style={{ borderColor: "#c49e72" }}
                      placeholder="https://berlinholidays.com/page-url"
                    />
                  </div>

                  {/* Page OG Image */}
                  <div>
                    <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                      Open Graph Image
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="text"
                        name="pageOgImage"
                        value={pageFormData.pageOgImage}
                        onChange={handlePageInputChange}
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
                              alert(`Image "${file.name}" selected. In production, this would upload to your server and update the URL field.`);
                              // In production, you would upload the file and set the URL:
                              // const url = await uploadImage(file);
                              // setPageFormData({...pageFormData, pageOgImage: url});
                            }
                          };
                          input.click();
                        }}
                        className="px-6 py-3 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all"
                        style={{ backgroundColor: "#c49e72" }}
                      >
                        <FaImage className="inline mr-2" />
                        Upload
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 font-Lora mt-1">
                      Recommended: 1200x630px
                    </p>
                  </div>

                  {/* Page Robots Meta */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        name="pageRobotsIndex"
                        checked={pageFormData.pageRobotsIndex}
                        onChange={handlePageInputChange}
                        className="w-5 h-5 rounded"
                        style={{ accentColor: "#c49e72" }}
                      />
                      <label className="text-sm font-Lora" style={{ color: "#1e1e1e" }}>
                        Allow search engines to index
                      </label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        name="pageRobotsFollow"
                        checked={pageFormData.pageRobotsFollow}
                        onChange={handlePageInputChange}
                        className="w-5 h-5 rounded"
                        style={{ accentColor: "#c49e72" }}
                      />
                      <label className="text-sm font-Lora" style={{ color: "#1e1e1e" }}>
                        Allow search engines to follow links
                      </label>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => handleSavePageSEO(false)}
                      className="flex-1 px-6 py-3 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all shadow-md"
                      style={{ backgroundColor: "#006938" }}
                    >
                      <FaCheckCircle className="inline mr-2" />
                      Save & Publish
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSavePageSEO(true)}
                      className="flex-1 px-6 py-3 rounded-lg border-2 font-Lora font-semibold hover:bg-gray-50 transition-all"
                      style={{ borderColor: "#c49e72", color: "#c49e72" }}
                    >
                      <FaSave className="inline mr-2" />
                      Save as Draft
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelPageForm}
                      className="flex-1 px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-Lora font-semibold hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SEOManagement;

