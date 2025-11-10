import { MdEmail, MdOutlineShareLocation } from "react-icons/md";
import BreadCrumb from "../../BreadCrumb/BreadCrumb";
import { IoIosCall } from "react-icons/io";
import { useState } from "react";
import Swal from "sweetalert2";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      Swal.fire("Error", "Please enter your name", "error");
      return;
    }
    if (!formData.email.trim()) {
      Swal.fire("Error", "Please enter your email", "error");
      return;
    }
    if (!formData.subject) {
      Swal.fire("Error", "Please select a subject", "error");
      return;
    }
    if (!formData.message.trim()) {
      Swal.fire("Error", "Please enter your message", "error");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Swal.fire("Error", "Please enter a valid email address", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      // Get EmailJS configuration from environment variables
      const emailJsServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const emailJsTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const emailJsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
      const contactEmail = import.meta.env.VITE_CONTACT_EMAIL;

      // Check if EmailJS is configured
      if (!emailJsServiceId || !emailJsTemplateId || !emailJsPublicKey || !contactEmail) {
        Swal.fire({
          title: "Setup Required",
          html: `
            <p>The contact form needs to be configured with EmailJS credentials.</p>
            <p style="margin-top: 10px;">Please see <strong>SETUP_NOW.md</strong> for quick setup instructions.</p>
            <p style="margin-top: 10px;">Or contact us directly at:</p>
            <p style="margin-top: 5px;"><strong>berlinvayanad@gmail.com</strong></p>
          `,
          icon: "info",
          confirmButtonColor: "#c49e72",
        });
        setIsSubmitting(false);
        return;
      }

      // Prepare email parameters
      const emailParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_email: contactEmail,
        submission_date: new Date().toLocaleString(),
      };

      // Send email via EmailJS
      await emailjs.send(
        emailJsServiceId,
        emailJsTemplateId,
        emailParams,
        emailJsPublicKey
      );

      // Success
      Swal.fire({
        title: "Success!",
        text: "Your message has been sent successfully. We'll get back to you soon!",
        icon: "success",
        confirmButtonColor: "#c49e72",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending email:", error);

      // Check if it's an EmailJS configuration error
      if (error.text && error.text.includes('Public Key is invalid')) {
        Swal.fire({
          title: "Setup Required",
          html: `
            <p>EmailJS credentials need to be configured.</p>
            <p style="margin-top: 10px;">📖 See <strong>SETUP_NOW.md</strong> for 5-minute setup guide.</p>
            <p style="margin-top: 10px;">Or contact us directly at:</p>
            <p style="margin-top: 5px;"><strong>berlinvayanad@gmail.com</strong></p>
            <p style="margin-top: 5px;"><strong>+91 956 2312 019</strong></p>
          `,
          icon: "info",
          confirmButtonColor: "#c49e72",
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to send your message. Please try again later or contact us directly at berlinvayanad@gmail.com",
          icon: "error",
          confirmButtonColor: "#c49e72",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <BreadCrumb title="Contact " />

      {/* Contact */}
      {/* Contact with Us */}
      <div className="py-20 2xl:py-[120px] dark:bg-lightBlack">
        <div className="Container bg-whiteSmoke dark:bg-normalBlack px-7 md:px-10 lg:px-14 2xl:px-20 py-6 md:py-8 lg:py-10 xl:py-12 2xl:py-[50px]">
          <div className="flex items-center flex-col md:flex-row">
            <div
              className="py-5 sm:p-5 flex-1"
              data-aos="zoom-in-up"
              data-aos-duration="1000"
            >
              <p className="text-Garamond text-base leading-[26px] text-khaki font-medium">
                CONTACT US
              </p>
              <h2 className="text-Garamond text-[22px] sm:text-2xl md:text-3xl lg:text-4xl 2xl:text-[38px] leading-7 md:leading-8 lg:leading-9 xl:leading-10 2xl:leading-[44px] text-uppercase text-lightBlack dark:text-white font-semibold my-3 md:my-5">
                CONTACT WITH US
              </h2>
              <p className="text-Lora text-sm sm:text-base leading-[26px]  text-gray dark:text-lightGray font-normal">
                We’re here to make your stay seamless and memorable.
                Whether you’re planning a vacation, a romantic getaway,
                 or a family retreat, our team is always ready to assist
                  you with bookings, inquiries, and special requests. Get 
                  in touch — we’d love to hear from you.
              </p>

              {/* call */}
              <div className="flex items-center my-4 md:my-5 lg:my-[26px] group">
                <div className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] lg:w-[50px] lg:h-[50px] 2xl:w-[60px] 2xl:h-[60px] bg-white dark:bg-lightBlack group-hover:bg-khaki dark:group-hover:bg-khaki grid items-center justify-center rounded-full transition-all duration-300">
                  <IoIosCall
                    size={22}
                    className="text-khaki group-hover:text-whiteSmoke"
                  />
                </div>
                <div className="ml-3 md:ml-4">
                  <p className="font-Lora text-sm leading-[26px] text-gray dark:text-lightGray font-normal">
                    Call Us Now
                  </p>
                  <p className="font-Garamond text-lg sm:text-xl md:text-[22px] leading-[26px] text-lightBlack dark:text-white font-medium">
                    +91 956 2312 019
                  </p>
                </div>
              </div>
              <hr className="dark:text-gray dark:bg-gray text-lightGray bg-lightGray h-[1px]" />
              {/* email */}
              <div className="flex items-center my-4 md:my-5 lg:my-[26px] group">
                <div className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] lg:w-[50px] lg:h-[50px] 2xl:w-[60px] 2xl:h-[60px] bg-white dark:bg-lightBlack group-hover:bg-khaki dark:group-hover:bg-khaki grid items-center justify-center rounded-full transition-all duration-300">
                  <MdEmail
                    size={22}
                    className="text-khaki group-hover:text-whiteSmoke"
                  />
                </div>
                <div className="ml-3 md:ml-4">
                  <p className="font-Lora text-sm leading-[26px] text-gray dark:text-lightGray font-normal">
                    Send Email
                  </p>
                  <p className="font-Garamond text-lg sm:text-xl md:text-[22px] leading-[26px] text-lightBlack dark:text-white font-medium ">
                    berlinvayanad@gmail.com
                  </p>
                </div>
              </div>
              <hr className="dark:text-gray dark:bg-gray text-lightGray bg-lightGray h-[1px]" />
              {/* location */}
              <div className="flex items-center my-4 md:my-5 lg:my-[26px] group">
                <div className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] lg:w-[50px] lg:h-[50px] 2xl:w-[60px] 2xl:h-[60px] bg-white dark:bg-lightBlack group-hover:bg-khaki dark:group-hover:bg-khaki grid items-center justify-center rounded-full transition-all duration-300">
                  <MdOutlineShareLocation
                    size={22}
                    className="text-khaki group-hover:text-whiteSmoke"
                  />
                </div>
                <div className="ml-3 md:ml-4">
                  <p className="font-Lora text-sm leading-[26px] text-gray dark:text-lightGray font-normal">
                    Our Locations
                  </p>
                  <p className="font-Garamond text-lg sm:text-xl md:text-[22px] leading-[26px] text-lightBlack dark:text-white font-medium ">
                   Berlin Holidays <br />
                     Vaithiri-Pozhuthana Road - Parathode(Near Banasura Dam)-Wayanad,
                     Thariyod (Po) <br />
                     Kerala - 673575
                  </p>
                </div>
              </div>
            </div>
            <div
              className="flex-1 py-5 sm:p-5"
              data-aos="zoom-in-up"
              data-aos-duration="1000"
            >
              <div className="bg-lightBlack  p-[30px] lg:p-[45px] 2xl:p-[61px]">
                <h2 className="font-Garamond text-[22px] sm:text-2xl md:text-[28px] leading-7 md:leading-8 lg:leading-9 xl:leading-10 2xl:leading-[44px] text-white font-semibold text-center">
                  GET IN TOUCH
                </h2>
                <form onSubmit={handleSubmit} className="grid items-center grid-cols-1 gap-2 mt-8">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full h-12 md:h-13 lg:h-[59px] px-4 border border-gray dark:border-lightGray text-white dark:text-lightGray outline-none  bg-transparent mt-4 focus:ring-0 placeholder:text-gray focus:border-khaki dark:focus:border-khaki focus:outline-none"
                    placeholder="Your Name"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full h-12 md:h-13 lg:h-[59px] px-4 border  border-gray dark:border-lightGray text-white dark:text-lightGray outline-none  bg-transparent mt-4 focus:ring-0 placeholder:text-gray focus:border-khaki dark:focus:border-khaki focus:outline-none"
                    placeholder="Enter E-mail"
                    required
                  />
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full h-12 md:h-13 lg:h-[59px] px-4 border border-gray dark:border-lightGray text-white dark:text-lightGray outline-none bg-lightBlack mt-4 focus:ring-0 focus:border-khaki dark:focus:border-khaki focus:outline-none appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23c49e72' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                      backgroundPosition: 'right 0.5rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.5em 1.5em',
                    }}
                    required
                  >
                    <option value="" disabled>
                      Select Subject
                    </option>
                    <option value="Adventure">
                      Adventure
                    </option>
                    <option value="Honeymoon">
                      Honeymoon
                    </option>
                    <option value="Family Trip">
                      Family Trip
                    </option>
                    <option value="General Inquiry">
                      General Inquiry
                    </option>
                    <option value="Booking Inquiry">
                      Booking Inquiry
                    </option>
                  </select>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    cols="30"
                    rows="10"
                    className="w-full h-[121px] px-4 py-3 border border-gray dark:border-lightGray text-white dark:text-lightGray outline-none  bg-transparent mt-4 focus:ring-0 placeholder:text-gray resize-none focus:border-khaki dark:focus:border-khaki focus:outline-none"
                    placeholder="Write Message:"
                    required
                  ></textarea>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-khaki text-white text-center h-10 2xl:h-[55px] mt-5 font-Garamond font-semibold transition-all duration-300 ${
                      isSubmitting
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-opacity-90'
                    }`}
                  >
                    {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* google map */}
      <div data-aos="fade-down" data-aos-duration="1000">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387190.279909073!2d-74.25987368715491!3d40.69767006458873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sbd!4v1633418400558!5m2!1sen!2sbd"
          height={450}
          allowFullScreen=""
          loading="lazy"
          className="w-full"
        ></iframe>
      </div>
    </div>
  );
};

export default Contact;
