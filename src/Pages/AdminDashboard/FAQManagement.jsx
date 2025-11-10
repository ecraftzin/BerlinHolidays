import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaQuestionCircle } from "react-icons/fa";
import Swal from "sweetalert2";
import { getAllFAQs, createFAQ, updateFAQ, deleteFAQ } from "../../services/faqService";

const FAQManagement = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState(null);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
  });

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    setLoading(true);
    const { data, error } = await getAllFAQs();
    if (error) {
      console.error("Error fetching FAQs:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load FAQs. Please try again.",
      });
    } else {
      setFaqs(data || []);
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

  const handleEditFAQ = (faq) => {
    setSelectedFAQ(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
    });
    setShowModal(true);
  };

  const handleDeleteFAQ = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This FAQ will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#006938",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      const { error } = await deleteFAQ(id);
      if (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to delete FAQ. Please try again.",
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "FAQ has been deleted successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
        fetchFAQs();
      }
    }
  };

  const handleSaveFAQ = async (isDraft = false) => {
    // Validation
    if (!formData.question.trim() || !formData.answer.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill in all required fields.",
      });
      return;
    }

    const faqData = {
      question: formData.question,
      answer: formData.answer,
      is_active: !isDraft,
    };

    let result;
    if (selectedFAQ) {
      // Update existing FAQ
      result = await updateFAQ(selectedFAQ.id, faqData);
    } else {
      // Create new FAQ
      result = await createFAQ(faqData);
    }

    if (result.error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Failed to ${selectedFAQ ? "update" : "create"} FAQ. Please try again.`,
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: `FAQ ${selectedFAQ ? "updated" : "created"} successfully!`,
        timer: 2000,
        showConfirmButton: false,
      });
      setShowModal(false);
      setSelectedFAQ(null);
      setFormData({ question: "", answer: "" });
      fetchFAQs();
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-Garamond" style={{ color: "#1e1e1e" }}>
            FAQ Management
          </h1>
          <p className="text-gray-600 font-Lora mt-1">
            Manage frequently asked questions
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedFAQ(null);
            setFormData({ question: "", answer: "" });
            setShowModal(true);
          }}
          className="mt-4 md:mt-0 px-6 py-3 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all shadow-md flex items-center space-x-2"
          style={{ backgroundColor: "#006938" }}
        >
          <FaPlus />
          <span>Add FAQ</span>
        </button>
      </div>

      {/* FAQs List */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2" style={{ borderColor: "#006938" }}></div>
        </div>
      ) : faqs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-md">
          <FaQuestionCircle className="mx-auto text-6xl mb-4" style={{ color: "#c49e72" }} />
          <h3 className="text-xl font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
            No FAQs Yet
          </h3>
          <p className="text-gray-600 font-Lora mb-6">
            Get started by creating your first FAQ
          </p>
          <button
            onClick={() => {
              setSelectedFAQ(null);
              setFormData({ question: "", answer: "" });
              setShowModal(true);
            }}
            className="px-6 py-3 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all shadow-md"
            style={{ backgroundColor: "#006938" }}
          >
            <FaPlus className="inline mr-2" />
            Create First FAQ
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FaQuestionCircle className="text-xl flex-shrink-0" style={{ color: "#c49e72" }} />
                      <h3 className="text-lg font-bold font-Garamond" style={{ color: "#1e1e1e" }}>
                        {faq.question}
                      </h3>
                    </div>
                    <p className="text-gray-600 font-Lora ml-8 whitespace-pre-line">
                      {faq.answer}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold font-Lora ml-4 flex-shrink-0 ${
                      faq.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {faq.is_active ? "Active" : "Draft"}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 ml-8">
                  <button
                    onClick={() => handleEditFAQ(faq)}
                    className="px-4 py-2 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all"
                    style={{ backgroundColor: "#c49e72" }}
                  >
                    <FaEdit className="inline mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteFAQ(faq.id)}
                    className="px-4 py-2 rounded-lg border-2 border-red-500 text-red-500 font-Lora font-semibold hover:bg-red-50 transition-all"
                  >
                    <FaTrash className="inline mr-2" />
                    Delete
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
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold font-Garamond" style={{ color: "#1e1e1e" }}>
                {selectedFAQ ? "Edit FAQ" : "Add New FAQ"}
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Question */}
              <div>
                <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                  Question <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="question"
                  value={formData.question}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora"
                  style={{ borderColor: "#c49e72" }}
                  placeholder="Enter the question"
                />
              </div>

              {/* Answer */}
              <div>
                <label className="block text-sm font-semibold font-Garamond mb-2" style={{ color: "#1e1e1e" }}>
                  Answer <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="answer"
                  value={formData.answer}
                  onChange={handleInputChange}
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-opacity-50 font-Lora resize-none"
                  style={{ borderColor: "#c49e72" }}
                  placeholder="Enter the answer"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleSaveFAQ(false)}
                className="flex-1 px-6 py-3 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all"
                style={{ backgroundColor: "#006938" }}
              >
                Save & Publish
              </button>
              <button
                onClick={() => handleSaveFAQ(true)}
                className="flex-1 px-6 py-3 rounded-lg text-white font-Lora font-semibold hover:opacity-90 transition-all"
                style={{ backgroundColor: "#c49e72" }}
              >
                Save as Draft
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedFAQ(null);
                  setFormData({ question: "", answer: "" });
                }}
                className="flex-1 px-6 py-3 rounded-lg border-2 font-Lora font-semibold hover:bg-gray-50 transition-all"
                style={{ borderColor: "#c49e72", color: "#c49e72" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQManagement;

