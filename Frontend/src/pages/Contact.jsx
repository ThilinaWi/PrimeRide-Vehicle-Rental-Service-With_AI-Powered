import React from "react";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
    alert("Thank you for your message! We'll contact you soon.");
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Contact <span className="text-blue-600">PrimeRide</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're here to help you with all your vehicle rental needs. Reach out
            to us anytime!
          </p>
        </div>

        {/* Contact Content */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Send Us a Message
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label
                  htmlFor="name"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="phone"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="subject"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Subject
                </label>
                <select
                  id="subject"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a subject</option>
                  <option value="booking">Booking Inquiry</option>
                  <option value="support">Customer Support</option>
                  <option value="feedback">Feedback</option>
                  <option value="business">Business Partnership</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="message"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="How can we help you?"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Contact Information
            </h2>

            <div className="bg-white p-8 rounded-xl shadow-md mb-8">
              <div className="flex items-start mb-6">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <MapPin className="text-blue-600 w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    Our Office
                  </h3>
                  <p className="text-gray-600">123 Rental Avenue</p>
                  <p className="text-gray-600">Malabe, Colombo 10115</p>
                  <p className="text-gray-600">Sri Lanka</p>
                </div>
              </div>

              <div className="flex items-start mb-6">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <Phone className="text-green-600 w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    Phone
                  </h3>
                  <p className="text-gray-600">+94 112 345 678 (Office)</p>
                  <p className="text-gray-600">
                    +94 765 432 109 (24/7 Support)
                  </p>
                </div>
              </div>

              <div className="flex items-start mb-6">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <Mail className="text-purple-600 w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    Email
                  </h3>
                  <p className="text-gray-600">info@primeride.lk</p>
                  <p className="text-gray-600">support@primeride.lk</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-orange-100 p-3 rounded-full mr-4">
                  <Clock className="text-orange-600 w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    Business Hours
                  </h3>
                  <p className="text-gray-600">
                    Monday - Friday: 8:00 AM - 8:00 PM
                  </p>
                  <p className="text-gray-600">Saturday: 9:00 AM - 5:00 PM</p>
                  <p className="text-gray-600">Sunday: 10:00 AM - 4:00 PM</p>
                  <p className="text-gray-600 text-sm mt-2">
                    *24/7 emergency roadside assistance available
                  </p>
                </div>
              </div>
            </div>

            {/* Live Chat */}
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <MessageCircle className="text-blue-600 w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Live Chat Support
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Chat with our customer service team in real-time for instant
                assistance.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300">
                Start Chat Now
              </button>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="max-w-7xl mx-auto bg-white p-6 rounded-xl shadow-md mb-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Find Us on Map
          </h2>
          <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.798511757686!2d79.99172981472093!3d6.914677295003807!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae256db1a6771c5%3A0x2c63e344ab9a7536!2sMalabe!5e0!3m2!1sen!2slk!4v1621234567890!5m2!1sen!2slk"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="PrimeRide Location"
            ></iframe>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* FAQ Item 1 */}
            <div className="border-b border-gray-200">
              <button className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-50">
                <span className="text-lg font-medium text-gray-900">
                  What documents do I need to rent a vehicle?
                </span>
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div className="px-6 pb-6 hidden">
                <p className="text-gray-600">
                  You'll need a valid driver's license, credit card in your
                  name, and proof of insurance if you're not purchasing ours.
                  International renters will also need a passport.
                </p>
              </div>
            </div>

            {/* FAQ Item 2 */}
            <div className="border-b border-gray-200">
              <button className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-50">
                <span className="text-lg font-medium text-gray-900">
                  What is your cancellation policy?
                </span>
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div className="px-6 pb-6 hidden">
                <p className="text-gray-600">
                  You can cancel your reservation up to 24 hours before pickup
                  with no penalty. Late cancellations may incur a fee equivalent
                  to one day's rental rate.
                </p>
              </div>
            </div>

            {/* FAQ Item 3 */}
            <div className="border-b border-gray-200">
              <button className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-50">
                <span className="text-lg font-medium text-gray-900">
                  Do you offer long-term rentals?
                </span>
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div className="px-6 pb-6 hidden">
                <p className="text-gray-600">
                  Yes, we offer special rates for rentals of one month or
                  longer. Contact our business team for customized long-term
                  rental solutions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
