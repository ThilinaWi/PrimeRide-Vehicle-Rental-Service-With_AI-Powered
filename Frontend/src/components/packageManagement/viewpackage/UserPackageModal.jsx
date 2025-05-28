import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiX,
    FiUsers,
    FiSettings,
    FiInfo,
    FiMapPin,
    FiCheckCircle,
    FiShield,
    FiStar,
    FiDollarSign,
    FiCalendar,
    FiWifi,
    FiMusic,
    FiDroplet,
    FiChevronRight,
    FiClock,
    FiActivity,
    FiFileText,
    FiBriefcase,
    FiLayers,
    FiNavigation,
    FiCoffee,
    FiUmbrella,
    FiCreditCard,
    FiGift
} from "react-icons/fi";
import { FaCar } from "react-icons/fa";

const UserPackageModal = ({
    isOpen,
    onClose,
    package: pkg,
    bookingDetails,
    totalPrice,
}) => {
    const [activeTab, setActiveTab] = useState("details");
    const [calculatedPrice, setCalculatedPrice] = useState(0);
    const [duration, setDuration] = useState(1);

    useEffect(() => {
        if (bookingDetails?.duration) {
            setDuration(bookingDetails.duration);
            if (pkg?.price_per_day) {
                setCalculatedPrice(pkg.price_per_day * bookingDetails.duration);
            }
        } else if (pkg?.price_per_day) {
            setCalculatedPrice(pkg.price_per_day);
        }
    }, [bookingDetails, pkg]);

    // Enhanced feature icons mapping
    const featureIcons = {
        professional_driver: <FiUsers className="text-blue-600" />,
        unlimited_mileage: <FiNavigation className="text-purple-600" />,
        wifi_connectivity: <FiWifi className="text-pink-600" />,
        child_safety_seat: <FiShield className="text-red-600" />,
        luxury_vehicle: <FaCar className="text-amber-500" />,
        gps_navigation: <FiMapPin className="text-emerald-600" />,
        tinted_windows: <FiDroplet className="text-indigo-600" />,
        insurance_coverage: <FiShield className="text-blue-600" />,
        music_system: <FiMusic className="text-purple-600" />,
        air_conditioning: <FiDroplet className="text-sky-600" />,
        sunroof: <FiActivity className="text-amber-600" />,
        premium_sound: <FiMusic className="text-pink-600" />,
        leather_seats: <FiBriefcase className="text-brown-600" />,
    };

    // Enhanced feature rendering
    const renderFeatures = (features) => {
        if (!features) return null;

        return Object.entries(features)
            .filter(([_, value]) => value)
            .map(([key]) => (
                <motion.div
                    key={key}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center space-x-3 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
                >
                    <div className="p-2 rounded-full bg-opacity-20 bg-current">
                        {featureIcons[key] || <FiCheckCircle className="text-green-600" />}
                    </div>
                    <span className="capitalize font-medium text-gray-800">
                        {key.replace(/_/g, " ")}
                    </span>
                </motion.div>
            ));
    };

    if (!isOpen || !pkg) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            >
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
                >
{/* Premium Modal Header with Perfect Image Display */}
<div className="relative h-[700px] bg-gradient-to-br from-indigo-900 to-blue-800 overflow-hidden rounded-t-xl">
  {/* Background Image Container with Aspect Ratio Preservation */}
  <div className="absolute inset-0 w-full h-full">
    {pkg.image_upload ? (
      <motion.img
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        src={`http://localhost:3000/${pkg.image_upload}`}
        alt={pkg.package_name}
        className="w-auto h-100 object-cover object-contain"
        
        onError={(e) => {
          e.target.src = "/assets/package-placeholder.png";
          e.target.className = "w-full h-full object-contain object-center bg-gray-100 p-10";
        }}
      />
    ) : (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-900 to-blue-800">
        <FiBriefcase className="text-white text-6xl opacity-20" />
      </div>
    )}
    {/* Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
  </div>

  {/* Close Button */}
  <button
    onClick={onClose}
    className="absolute top-5 right-5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full p-2.5 text-white transition-all duration-300 shadow-md hover:shadow-lg z-10"
    aria-label="Close modal"
  >
    <FiX size={22} className="opacity-90" />
  </button>

  {/* Package Info Overlay */}
  <div className="absolute bottom-0 left-0 right-0 p-6 pt-16 pb-8 z-1">
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.15, duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 drop-shadow-xl">
        {pkg.package_name}
      </h1>

      {/* Package Metadata */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Package Type */}
        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center backdrop-blur-sm ${
          pkg.package_type === 'Luxury' ? 'bg-amber-100/90 text-amber-900' :
          pkg.package_type === 'Premium' ? 'bg-blue-100/90 text-blue-900' :
          pkg.package_type === 'VIP' ? 'bg-purple-100/90 text-purple-900' :
          'bg-white/90 text-gray-900'
        }`}>
          {pkg.package_type} Package
        </span>

        {/* Seating */}
        <div className="flex items-center text-white/90 text-sm bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 border border-white/20">
          <FiUsers className="mr-1.5" />
          <span>{pkg.seating_capacity} {pkg.seating_capacity === 1 ? 'person' : 'people'}</span>
        </div>

        {/* Duration */}
        <div className="flex items-center text-white/90 text-sm bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 border border-white/20">
          <FiClock className="mr-1.5" />
          <span>
            {Array.isArray(pkg.duration) ? 
              pkg.duration.join(" / ") : 
              `${pkg.duration} ${pkg.duration === 1 ? 'day' : 'days'}`}
          </span>
        </div>
      </div>
    </motion.div>
  </div>
</div>

                    {/* Enhanced Tabs Navigation */}
                    <div className="border-b border-gray-200 px-6 bg-gray-50">
                        <nav className="flex overflow-x-auto hide-scrollbar">
                            {[
                                { id: "details", icon: <FiBriefcase className="mr-2" />, label: "Details" },
                                { id: "features", icon: <FiStar className="mr-2" />, label: "Features" },
                                { id: "pricing", icon: <FiDollarSign className="mr-2" />, label: "Pricing" },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center py-4 px-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                                            ? "border-blue-600 text-blue-600"
                                            : "border-transparent text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Content Area */}
                    <div className="overflow-y-auto flex-1 p-6">
                        <AnimatePresence mode="wait">
                            {activeTab === "details" && (
                                <motion.div
                                    key="details"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-6"
                                >
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Package Specifications */}
                                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                            <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                                                <FiBriefcase className="mr-3 text-blue-600" />
                                                Package Specifications
                                            </h3>
                                            <div className="space-y-4">
                                                <div className="flex justify-between py-3 border-b border-gray-200">
                                                    <span className="text-gray-600 flex items-center">
                                                        <FaCar className="mr-2 text-gray-400" /> Vehicle Model
                                                    </span>
                                                    <span className="font-medium text-gray-800">
                                                        {pkg.vehicle_model}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between py-3 border-b border-gray-200">
                                                    <span className="text-gray-600 flex items-center">
                                                        <FiUsers className="mr-2 text-gray-400" /> Seating Capacity
                                                    </span>
                                                    <span className="font-medium text-gray-800">
                                                        {pkg.seating_capacity} {pkg.seating_capacity > 1 ? 'people' : 'person'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between py-3 border-b border-gray-200">
                                                    <span className="text-gray-600 flex items-center">
                                                        <FiLayers className="mr-2 text-gray-400" /> Luggage Capacity
                                                    </span>
                                                    <span className="font-medium text-gray-800">
                                                        {pkg.luggage_capacity} {pkg.luggage_capacity > 1 ? 'bags' : 'bag'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between py-3">
                                                    <span className="text-gray-600 flex items-center">
                                                        <FiClock className="mr-2 text-gray-400" /> Duration
                                                    </span>
                                                    <span className="font-medium text-gray-800">
                                                        {Array.isArray(pkg.duration) ? pkg.duration.join(", ") : pkg.duration} {pkg.duration > 1 ? 's' : ''}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Availability */}
                                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                            <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                                                <FiCalendar className="mr-3 text-blue-600" />
                                                Availability
                                            </h3>
                                            <div className="space-y-3">
                                                <motion.div
                                                    whileHover={{ y: -2 }}
                                                    className="flex items-center justify-between p-4 bg-white rounded-lg border border-green-200 hover:border-green-300 cursor-pointer transition-all"
                                                >
                                                    <div>
                                                        <p className="font-medium">Today - Next Week</p>
                                                        <p className="text-sm text-gray-500">
                                                            Instant confirmation
                                                        </p>
                                                    </div>
                                                    <FiChevronRight className="text-gray-400" />
                                                </motion.div>
                                                <motion.div
                                                    whileHover={{ y: -2 }}
                                                    className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-300 cursor-pointer transition-all"
                                                >
                                                    <div>
                                                        <p className="font-medium">Next Month</p>
                                                        <p className="text-sm text-gray-500">
                                                            Limited availability
                                                        </p>
                                                    </div>
                                                    <FiChevronRight className="text-gray-400" />
                                                </motion.div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Package Description */}
                                    {pkg.description && (
                                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                            <h3 className="text-lg font-semibold mb-3 text-gray-800">
                                                Package Description
                                            </h3>
                                            <p className="text-gray-600 leading-relaxed">
                                                {pkg.description}
                                            </p>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === "features" && (
                                <motion.div
                                    key="features"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-6"
                                >
                                    {/* Additional Features */}
                                    <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
                                        <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                                            <FiStar className="mr-3 text-blue-600" />
                                            Additional Features
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {renderFeatures(pkg.additional_features || {})}
                                            {pkg.custom_additional_features?.map((feature) => (
                                                <motion.div
                                                    key={feature}
                                                    whileHover={{ scale: 1.03 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="flex items-center space-x-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
                                                >
                                                    <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                                                        <FiCheckCircle />
                                                    </div>
                                                    <span className="font-medium text-gray-800">
                                                        {feature}
                                                    </span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Safety & Security Features */}
                                    <div className="bg-green-50/50 p-6 rounded-xl border border-green-100">
                                        <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                                            <FiShield className="mr-3 text-green-600" />
                                            Safety & Security Features
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {renderFeatures(pkg.safety_security_features || {})}
                                            {pkg.custom_safety_security_features?.map((feature) => (
                                                <motion.div
                                                    key={feature}
                                                    whileHover={{ scale: 1.03 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="flex items-center space-x-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
                                                >
                                                    <div className="p-2 rounded-full bg-green-100 text-green-600">
                                                        <FiCheckCircle />
                                                    </div>
                                                    <span className="font-medium text-gray-800">
                                                        {feature}
                                                    </span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            {activeTab === "pricing" && (
                                <motion.div
                                    key="pricing"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-6"
                                >
                                    {/* Package Rates */}
                                    <div className="bg-purple-50/50 p-6 rounded-xl border border-purple-100">
                                        <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                                            <FiDollarSign className="mr-3 text-purple-600" />
                                            Package Rates
                                        </h3>
                                        <div className="space-y-4">
                                            {/* Selected Dates Pricing */}
                                            {bookingDetails?.startDate && bookingDetails?.endDate ? (
                                                <motion.div
                                                    whileHover={{ y: -2 }}
                                                    className="bg-white p-5 rounded-xl border-2 border-blue-300 shadow-sm"
                                                >
                                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3">
                                                        <div>
                                                            <p className="font-medium text-gray-800">Selected Dates</p>
                                                            <p className="text-sm text-gray-500">
                                                                {bookingDetails.startDate} to{" "}
                                                                {bookingDetails.endDate}
                                                            </p>
                                                        </div>
                                                        <div className="text-right mt-2 md:mt-0">
                                                            <p className="text-sm text-gray-500">
                                                                {duration} day{duration !== 1 ? "s" : ""}
                                                            </p>
                                                            <p className="text-2xl font-bold text-blue-600">
                                                                ${calculatedPrice.toLocaleString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="pt-3 border-t border-gray-100 text-sm text-gray-600">
                                                        <p>
                                                            ${pkg.price_per_day.toLocaleString()} × {duration}
                                                            {duration !== 1 ? "s" : ""}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            ) : (
                                                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 flex items-center">
                                                    <FiCalendar className="text-yellow-600 mr-3" />
                                                    <p className="text-yellow-800">
                                                        Select dates to see exact pricing
                                                    </p>
                                                </div>
                                            )}

                                            {/* Standard Rates */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <motion.div
                                                    whileHover={{ y: -2 }}
                                                    className="flex flex-col justify-between p-5 bg-white rounded-xl border border-purple-100 hover:border-purple-200 transition-all"
                                                >
                                                    <div>
                                                        <p className="font-medium text-gray-800">Daily Rate</p>
                                                        <p className="text-sm text-gray-500 mb-3">
                                                            Per person basis
                                                        </p>
                                                    </div>
                                                    <span className="text-2xl font-bold text-purple-600">
                                                        ${pkg.price_per_day.toLocaleString()}
                                                    </span>
                                                </motion.div>

                                                <motion.div
                                                    whileHover={{ y: -2 }}
                                                    className="flex flex-col justify-between p-5 bg-white rounded-xl border border-green-100 hover:border-green-200 transition-all"
                                                >
                                                    <div>
                                                        <p className="font-medium text-gray-800">Weekly Rate</p>
                                                        <p className="text-sm text-gray-500 mb-3">
                                                            7 days (10% discount)
                                                        </p>
                                                    </div>
                                                    <span className="text-2xl font-bold text-green-600">
                                                        ${Math.round(pkg.price_per_day * 7 * 0.9).toLocaleString()}
                                                    </span>
                                                </motion.div>

                                                <motion.div
                                                    whileHover={{ y: -2 }}
                                                    className="flex flex-col justify-between p-5 bg-white rounded-xl border border-blue-100 hover:border-blue-200 transition-all"
                                                >
                                                    <div>
                                                        <p className="font-medium text-gray-800">Group Rate</p>
                                                        <p className="text-sm text-gray-500 mb-3">
                                                            4+ people (10% discount)
                                                        </p>
                                                    </div>
                                                    <span className="text-2xl font-bold text-blue-600">
                                                        ${Math.round(pkg.price_per_day * 0.85).toLocaleString()}/person
                                                    </span>
                                                </motion.div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Special Offers */}
                                    <div className="bg-amber-50/50 p-6 rounded-xl border border-amber-100">
                                        <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                                            <FiGift className="mr-3 text-amber-600" />
                                            Special Offers
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <motion.div
                                                whileHover={{ y: -2 }}
                                                className="p-5 bg-white rounded-xl border border-amber-100 hover:border-amber-200 transition-all"
                                            >
                                                <div className="flex items-start">
                                                    <div className="bg-amber-100 text-amber-600 p-3 rounded-xl mr-4">
                                                        <FiStar size={20} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-gray-800">Early Bird Discount</h4>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            15% off for bookings made 7+ days in advance. Limited time offer for our valued customers.
                                                        </p>
                                                        <div className="mt-3 flex items-center text-sm text-amber-600">
                                                            <FiClock className="mr-1" /> Ends Aug, 2025
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>

                                            <motion.div
                                                whileHover={{ y: -2 }}
                                                className="p-5 bg-white rounded-xl border border-blue-100 hover:border-blue-200 transition-all"
                                            >
                                                <div className="flex items-start">
                                                    <div className="bg-blue-100 text-blue-600 p-3 rounded-xl mr-4">
                                                        <FiUsers size={20} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-gray-800">Family Package</h4>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            Kids under 12 . Perfect for family vacations with additional amenities for children.
                                                        </p>
                                                        <div className="mt-3 flex items-center text-sm text-blue-600">
                                                            <FiInfo className="mr-1" /> Valid for 2+ children
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Sticky Footer CTA */}
                    <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 shadow-lg">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="text-center md:text-left">
                                {bookingDetails?.startDate && bookingDetails?.endDate ? (
                                    <>
                                        <p className="text-sm text-gray-500">
                                            {duration} day{duration !== 1 ? "s" : ""} package
                                        </p>
                                        <p className="text-xl font-bold text-blue-600">
                                            Total: ${calculatedPrice.toLocaleString()}
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-sm text-gray-500">Starting from</p>
                                        <p className="text-xl font-bold text-blue-600">
                                            ${pkg.price_per_day.toLocaleString()}/day
                                        </p>
                                    </>
                                )}
                            </div>
                            <div className="flex gap-3 w-full md:w-auto">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onClose}
                                    className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-all w-full md:w-auto"
                                >
                                    Close
                                </motion.button>
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full md:w-auto"
                                >
                                    <Link
                                        to={`/book-package/${pkg._id}`}
                                        state={{
                                            bookingDetails,
                                            totalPrice: calculatedPrice || pkg.price_per_day,
                                        }}
                                        className="block px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg text-center"
                                    >
                                        Book Now
                                    </Link>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default UserPackageModal;