import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiUsers,
  FiSettings,
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
} from "react-icons/fi";
import { FaCar, FaGasPump, FaSnowflake } from "react-icons/fa";

const UserVehicleModal = ({
  isOpen,
  onClose,
  vehicle,
  rentalDetails = {},
  totalPrice,
  isSelected = false,
  onSelectVehicle,
  withDriver = false,
  selectedDriver = null,
  driverPrice = 0,
}) => {
  const [activeTab, setActiveTab] = useState("details");
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [duration, setDuration] = useState(1);

  useEffect(() => {
    if (rentalDetails?.rentalDuration && vehicle?.daily_rate) {
      setDuration(rentalDetails.rentalDuration);
      const basePrice = vehicle.daily_rate * rentalDetails.rentalDuration;

      // Apply discounts based on duration
      let finalPrice = basePrice;
      if (rentalDetails.rentalDuration >= 30) {
        finalPrice = basePrice * 0.75; // 25% discount for monthly
      } else if (rentalDetails.rentalDuration >= 7) {
        finalPrice = basePrice * 0.85; // 15% discount for weekly
      }

      // Add driver cost if selected
      if (withDriver && selectedDriver) {
        finalPrice += driverPrice * rentalDetails.rentalDuration;
      }

      setCalculatedPrice(Math.round(finalPrice));
    } else if (vehicle?.daily_rate) {
      setCalculatedPrice(vehicle.daily_rate);
    }
  }, [rentalDetails, vehicle, withDriver, selectedDriver, driverPrice]);

  // Feature icons mapping
  const featureIcons = {
    air_conditioning: <FaSnowflake className="text-blue-500" />,
    navigation_system: <FiMapPin className="text-purple-500" />,
    bluetooth: <FiMusic className="text-pink-500" />,
    sunroof: <FiStar className="text-yellow-500" />,
    abs: <FiShield className="text-red-500" />,
    airbags: <FiShield className="text-red-500" />,
    parking_sensors: <FiMapPin className="text-green-500" />,
    stability_control: <FiShield className="text-red-500" />,
  };

  const renderFeatures = (features) => {
    if (!features) return null;

    return Object.entries(features)
      .filter(([_, value]) => value)
      .map(([key]) => (
        <motion.div
          key={key}
          whileHover={{ scale: 1.03 }}
          className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="p-2 rounded-full bg-opacity-20 bg-current">
            {featureIcons[key] || <FiCheckCircle className="text-green-500" />}
          </div>
          <span className="capitalize font-medium text-gray-700">
            {key.replace("_", " ")}
          </span>
        </motion.div>
      ));
  };

  if (!isOpen || !vehicle) return null;

  const displayPrice = calculatedPrice || vehicle.daily_rate;
  const hasRentalDates = rentalDetails?.pickupDate && rentalDetails?.returnDate;
  const baseVehiclePrice = vehicle.daily_rate * duration;
  const driverCost = withDriver && selectedDriver ? driverPrice * duration : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Modal Header */}
          <div className="relative h-64 bg-gradient-to-r from-blue-600 to-blue-800 overflow-hidden">
            {vehicle.image_upload ? (
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={`http://localhost:3000/${vehicle.image_upload}`}
                alt={vehicle.vehicle_number}
                className="w-full h-full object-cover"
                onError={(e) =>
                  (e.target.src = "/assets/vehicle-placeholder.png")
                }
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-700">
                <FaCar className="text-white text-6xl opacity-30" />
              </div>
            )}

            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-opacity-30 transition-all"
            >
              <FiX size={24} />
            </button>

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 pt-12">
              <motion.h2
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                className="text-3xl font-bold text-white"
              >
                {vehicle.brand} {vehicle.vehicle_number}
              </motion.h2>
              <div className="flex items-center space-x-4 text-white text-opacity-90 mt-2">
                <span className="flex items-center">
                  <FiCalendar className="mr-1" /> {vehicle.year_of_manufacture}
                </span>
                <span className="flex items-center">
                  <FaCar className="mr-1" /> {vehicle.vehicle_type}
                </span>
                <span className="flex items-center">
                  <FaGasPump className="mr-1" /> {vehicle.fuel_type}
                </span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 px-6">
            <nav className="flex space-x-8">
              {["details", "features", "pricing", "health"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === tab
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="overflow-y-auto flex-1 p-6">
            <AnimatePresence mode="wait">
              {activeTab === "details" && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-5 rounded-xl">
                      <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                        <FiSettings className="mr-2 text-blue-500" />
                        Specifications
                      </h3>
                      <div className="space-y-4">
                        {[
                          ["Transmission", vehicle.transmission_type],
                          [
                            "Seating Capacity",
                            `${vehicle.seating_capacity} seats`,
                          ],
                          ["Fuel Type", vehicle.fuel_type],
                        ].map(([label, value]) => (
                          <div
                            key={label}
                            className="flex justify-between py-2 border-b border-gray-200"
                          >
                            <span className="text-gray-600">{label}</span>
                            <span className="font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-5 rounded-xl">
                      <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                        <FiClock className="mr-2 text-blue-500" />
                        Availability
                      </h3>
                      <div className="space-y-3">
                        {[
                          {
                            title: "Today - Next Week",
                            subtitle: "Instant confirmation",
                            border: "border-green-100",
                          },
                          {
                            title: "Next Month",
                            subtitle: "Limited availability",
                            border: "border-gray-200",
                          },
                        ].map((item, index) => (
                          <div
                            key={index}
                            className={`flex items-center justify-between p-3 bg-white rounded-lg border ${item.border}`}
                          >
                            <div>
                              <p className="font-medium">{item.title}</p>
                              <p className="text-sm text-gray-500">
                                {item.subtitle}
                              </p>
                            </div>
                            <FiChevronRight className="text-gray-400" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {vehicle.description && (
                    <div className="bg-gray-50 p-5 rounded-xl">
                      <h3 className="text-lg font-semibold mb-3 text-gray-800">
                        Description
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {vehicle.description}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "features" && (
                <motion.div
                  key="features"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {[
                    {
                      title: "Comfort Features",
                      icon: <FiStar className="mr-2 text-blue-500" />,
                      features: vehicle.additional_features,
                      customFeatures: vehicle.custom_additional_features,
                      bgColor: "bg-blue-50",
                    },
                    {
                      title: "Safety Features",
                      icon: <FiShield className="mr-2 text-green-500" />,
                      features: vehicle.safety_features,
                      customFeatures: vehicle.custom_safety_features,
                      bgColor: "bg-green-50",
                    },
                  ].map((section, index) => (
                    <div
                      key={index}
                      className={`${section.bgColor} p-5 rounded-xl`}
                    >
                      <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                        {section.icon}
                        {section.title}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {renderFeatures(section.features)}
                        {section.customFeatures?.map((feature) => (
                          <motion.div
                            key={feature}
                            whileHover={{ scale: 1.03 }}
                            className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
                          >
                            <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                              <FiCheckCircle />
                            </div>
                            <span className="font-medium text-gray-700">
                              {feature}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === "pricing" && (
                <motion.div
                  key="pricing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-purple-50 p-5 rounded-xl">
                    <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                      <FiDollarSign className="mr-2 text-purple-500" />
                      Rental Rates
                    </h3>
                    <div className="space-y-4">
                      {hasRentalDates ? (
                        <div className="bg-white p-4 rounded-lg border border-blue-200">
                          <div className="flex justify-between items-center mb-2">
                            <div>
                              <p className="font-medium">Selected Dates</p>
                              <p className="text-sm text-gray-500">
                                {rentalDetails.pickupDate} to{" "}
                                {rentalDetails.returnDate}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">
                                {duration} day{duration !== 1 ? "s" : ""}
                              </p>
                              <p className="text-xl font-bold text-blue-600">
                                ${calculatedPrice}
                              </p>
                            </div>
                          </div>
                          <div className="pt-2 border-t border-gray-100 text-sm text-gray-600">
                            <div className="mb-1">
                              <p>
                                ${vehicle.daily_rate} × {duration} day
                                {duration !== 1 ? "s" : ""}
                                {duration >= 7 && (
                                  <span className="ml-2 text-green-600">
                                    ({duration >= 30 ? "25%" : "15%"} discount
                                    applied)
                                  </span>
                                )}
                              </p>
                            </div>
                            {withDriver && selectedDriver && (
                              <div className="mt-2 pt-2 border-t border-gray-100">
                                <p>
                                  Driver: {selectedDriver.full_name} ×{" "}
                                  {duration} day{duration !== 1 ? "s" : ""} @ $
                                  {driverPrice}
                                  /day
                                </p>
                                <p className="font-medium mt-1">
                                  Driver Cost: ${driverCost}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                          <p className="text-yellow-800 flex items-center">
                            <FiCalendar className="mr-2" />
                            Select dates to see exact pricing
                          </p>
                        </div>
                      )}

                      {[
                        {
                          label: "Daily Rate",
                          duration: "24 hour period",
                          days: 1,
                          price: vehicle.daily_rate,
                          color: "text-purple-600",
                          border: "border-purple-100",
                        },
                        {
                          label: "Weekly Rate",
                          duration: "7 days (15% discount)",
                          days: 7,
                          price: Math.round(vehicle.daily_rate * 7 * 0.85),
                          color: "text-green-600",
                          border: "border-green-100",
                        },
                        {
                          label: "Monthly Rate",
                          duration: "30 days (25% discount)",
                          days: 30,
                          price: Math.round(vehicle.daily_rate * 30 * 0.75),
                          color: "text-blue-600",
                          border: "border-blue-100",
                        },
                      ].map((rate, index) => (
                        <div
                          key={index}
                          className={`flex justify-between items-center p-4 bg-white rounded-lg border ${rate.border}`}
                        >
                          <div>
                            <p className="font-medium">{rate.label}</p>
                            <p className="text-sm text-gray-500">
                              {rate.duration}
                            </p>
                          </div>
                          <span className={`text-2xl font-bold ${rate.color}`}>
                            ${rate.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-5 rounded-xl">
                    <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                      <FiStar className="mr-2 text-yellow-500" />
                      Special Offers
                    </h3>
                    <div className="space-y-3">
                      {[
                        {
                          icon: <FiStar />,
                          bgColor: "bg-yellow-100",
                          textColor: "text-yellow-600",
                          title: "Weekend Special",
                          description: "10% off Friday-Monday rentals",
                        },
                        {
                          icon: <FiUsers />,
                          bgColor: "bg-blue-100",
                          textColor: "text-blue-600",
                          title: "Family Package",
                          description: "Free child seat with 7+ day rental",
                        },
                      ].map((offer, index) => (
                        <div
                          key={index}
                          className="p-4 bg-white rounded-lg border border-yellow-200"
                        >
                          <div className="flex items-start">
                            <div
                              className={`${offer.bgColor} ${offer.textColor} p-2 rounded-lg mr-3`}
                            >
                              {offer.icon}
                            </div>
                            <div>
                              <h4 className="font-medium">{offer.title}</h4>
                              <p className="text-sm text-gray-600">
                                {offer.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "health" && (
                <motion.div
                  key="health"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-gray-50 p-5 rounded-xl">
                    <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                      <FiActivity className="mr-2 text-blue-500" />
                      Vehicle Health Status
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Overall Condition</span>
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            Excellent
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-green-600 h-2.5 rounded-full"
                            style={{ width: "90%" }}
                          ></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          {
                            label: "Engine Health",
                            value: 95,
                            color: "bg-green-500",
                          },
                          {
                            label: "Brake System",
                            value: 92,
                            color: "bg-green-500",
                          },
                          {
                            label: "Tire Condition",
                            value: 85,
                            color: "bg-blue-500",
                          },
                          {
                            label: "Battery Life",
                            value: 88,
                            color: "bg-blue-500",
                          },
                        ].map((item, index) => (
                          <div
                            key={index}
                            className="bg-white p-4 rounded-lg border border-gray-200"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">{item.label}</span>
                              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                {item.value}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className={`${item.color} h-2.5 rounded-full`}
                                style={{ width: `${item.value}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-5 rounded-xl">
                    <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                      <FiFileText className="mr-2 text-blue-500" />
                      Maintenance History
                    </h3>
                    <div className="space-y-4">
                      {[
                        {
                          title: "Oil Change",
                          description: "Last changed: 1,500 km ago",
                          status: "Up to date",
                          statusColor: "bg-green-100 text-green-800",
                        },
                        {
                          title: "Tire Rotation",
                          description: "Last rotated: 2 months ago",
                          status: "On schedule",
                          statusColor: "bg-green-100 text-green-800",
                        },
                        {
                          title: "Brake Inspection",
                          description: "Last inspection: 3 months ago",
                          status: "Due in 1 month",
                          statusColor: "bg-yellow-100 text-yellow-800",
                        },
                        {
                          title: "Full Service",
                          description: "Last service: 6 months ago",
                          status: "Scheduled",
                          statusColor: "bg-blue-100 text-blue-800",
                        },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="bg-white p-4 rounded-lg border border-gray-200"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{item.title}</h4>
                              <p className="text-sm text-gray-600">
                                {item.description}
                              </p>
                            </div>
                            <span
                              className={`px-3 py-1 ${item.statusColor} rounded-full text-sm font-medium`}
                            >
                              {item.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {vehicle.health_report && (
                    <div className="bg-white p-5 rounded-xl border border-gray-200">
                      <h3 className="text-lg font-semibold mb-4 text-gray-800">
                        Detailed Health Report
                      </h3>
                      <div className="flex justify-center">
                        <button
                          onClick={() => {
                            window.open(
                              `http://localhost:3000/${vehicle.health_report}`,
                              "_blank"
                            );
                          }}
                          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
                        >
                          <FiFileText className="mr-2" />
                          View Full Health Report PDF
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer CTA */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="text-center sm:text-left">
                {hasRentalDates ? (
                  <>
                    <p className="text-sm text-gray-500">
                      {duration} day{duration !== 1 ? "s" : ""} rental
                    </p>
                    <div>
                      <p className="font-medium text-blue-600">
                        Total: ${displayPrice}
                        {duration >= 7 && (
                          <span className="ml-2 text-green-600 text-sm">
                            ({duration >= 30 ? "25%" : "15%"} off)
                          </span>
                        )}
                      </p>
                      {withDriver && selectedDriver && (
                        <p className="text-xs text-gray-500 mt-1">
                          Includes ${driverCost} for driver
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-500">Starting from</p>
                    <p className="font-medium text-blue-600">
                      ${vehicle.daily_rate}/day
                    </p>
                  </>
                )}
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors w-full sm:w-auto"
                >
                  Close
                </button>

                {onSelectVehicle ? (
                  <button
                    onClick={() => onSelectVehicle(vehicle)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all shadow-md hover:shadow-lg w-full sm:w-auto text-center ${
                      isSelected
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <span className="hidden sm:inline">Selected </span>✓
                      </>
                    ) : (
                      "Select Vehicle"
                    )}
                  </button>
                ) : (
                  <Link
                    to={`/book-vehicle/${vehicle._id}`}
                    state={{
                      rentalDetails,
                      totalPrice: displayPrice,
                      driver: withDriver ? selectedDriver : null,
                      driverPrice: withDriver ? driverPrice : 0,
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg w-full sm:w-auto text-center"
                  >
                    Book Now
                  </Link>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UserVehicleModal;
