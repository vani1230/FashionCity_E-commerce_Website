import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="min-h-screen bg-purple-50 py-16 px-6">

      {/* Title */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-purple-600 mb-3">
          Contact Us
        </h1>
        <p className="text-gray-600">
          We'd love to hear from you! Reach out for any questions or support.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">

        {/* Contact Info */}
        <div className="bg-white p-8 rounded-2xl shadow-md space-y-6">

          <div className="flex items-center gap-4">
            <FaPhoneAlt className="text-purple-400 text-xl" />
            <p className="text-gray-600">+91 98765 43210</p>
          </div>

          <div className="flex items-center gap-4">
            <FaEnvelope className="text-pink-400 text-xl" />
            <p className="text-gray-600">support@fashioncity.com</p>
          </div>

          <div className="flex items-center gap-4">
            <FaMapMarkerAlt className="text-rose-400 text-xl" />
            <p className="text-gray-600">
              Fashion City HQ, New Delhi, India
            </p>
          </div>

        </div>

        {/* Contact Form */}
        <div className="bg-white p-8 rounded-2xl shadow-md">

          <form className="space-y-4">

            <input
              type="text"
              placeholder="Your Name"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />

            <input
              type="email"
              placeholder="Your Email"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />

            <textarea
              placeholder="Your Message"
              rows="4"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-300"
            ></textarea>

            <button
              className="bg-gradient-to-r from-pink-400 to-purple-400 text-white px-6 py-3 rounded-lg w-full hover:opacity-90 transition"
            >
              Send Message
            </button>

          </form>

        </div>

      </div>
    </div>
  );
};

export default Contact;