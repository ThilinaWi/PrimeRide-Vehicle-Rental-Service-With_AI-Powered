import React, { useState, useEffect, useRef } from "react";
import { vehicleService } from "../../services/vehicleService";
import { getAllDrivers } from "../../services/driverSrvice";
import UserVehicleModal from "../vehicleManagement/vehicleManagementViewModal/UserVehicleModal";
import { Link } from "react-router-dom";
import {
  FiCalendar,
  FiClock,
  FiSearch,
  FiDollarSign,
  FiUsers,
  FiSettings,
  FiUser,
  FiAward,
  FiPhone,
  FiMail,
  FiStar,
  FiAlertCircle,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

const UserVehicleDashboard = () => {
  // Vehicle Data States
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal States
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    vehicle_type: "",
    priceRange: 350,
    passengers: "",
    transmission_type: "",
  });
  const [rentalDetails, setRentalDetails] = useState({
    pickupDate: "",
    pickupTime: "10:00",
    returnDate: "",
    returnTime: "10:00",
    rentalDuration: 0,
  });

  // Driver Selection States
  const [withDriver, setWithDriver] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [driverPrice, setDriverPrice] = useState(20); // Default driver price
  const [showDriverDetails, setShowDriverDetails] = useState(false);

  // Slider Refs and States
  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(350);

  // Fetch vehicles and available drivers on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch vehicles
        const vehiclesData = await vehicleService.getAllVehicles();
        const vehiclesWithPrices = Array.isArray(vehiclesData)
          ? vehiclesData.map((v) => ({ ...v, totalPrice: v.daily_rate }))
          : [];
        setVehicles(vehiclesWithPrices);
        setFilteredVehicles(vehiclesWithPrices);

        // Fetch available drivers
        const driversResponse = await getAllDrivers();
        if (driversResponse.success) {
          const availableDrivers = driversResponse.data.filter(
            (driver) => driver.availability_status === "available"
          );
          setDrivers(availableDrivers);
        }

        setLoading(false);
      } catch (err) {
        setError(err.message || "Error fetching data");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate rental duration and total price when dates change
  useEffect(() => {
    if (rentalDetails.pickupDate && rentalDetails.returnDate) {
      const start = new Date(
        `${rentalDetails.pickupDate}T${rentalDetails.pickupTime}`
      );
      const end = new Date(
        `${rentalDetails.returnDate}T${rentalDetails.returnTime}`
      );
      const diffTime = Math.max(end - start, 0);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

      setRentalDetails((prev) => ({ ...prev, rentalDuration: diffDays }));

      // Update prices for all filtered vehicles
      setFilteredVehicles((prevVehicles) =>
        prevVehicles.map((vehicle) => ({
          ...vehicle,
          totalPrice: vehicle.daily_rate * diffDays,
          rentalDuration: diffDays,
        }))
      );

      if (selectedVehicle) {
        const basePrice = selectedVehicle.daily_rate * diffDays;
        const totalWithDriver = withDriver
          ? basePrice + driverPrice * diffDays
          : basePrice;
        setTotalPrice(totalWithDriver);
      }
    } else {
      // Reset to daily prices when no dates selected
      setFilteredVehicles((prevVehicles) =>
        prevVehicles.map((vehicle) => ({
          ...vehicle,
          totalPrice: vehicle.daily_rate,
          rentalDuration: 1,
        }))
      );
      setTotalPrice(0);
    }
  }, [
    rentalDetails.pickupDate,
    rentalDetails.returnDate,
    rentalDetails.pickupTime,
    rentalDetails.returnTime,
    selectedVehicle,
    withDriver,
    driverPrice,
  ]);

  // Apply filters whenever search criteria change
  useEffect(() => {
    const results = vehicles.filter((vehicle) => {
      const matchesSearch =
        searchTerm === "" ||
        vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilters =
        (!filters.vehicle_type ||
          vehicle.vehicle_type === filters.vehicle_type) &&
        (filters.priceRange === 350 ||
          vehicle.daily_rate <= filters.priceRange) &&
        (!filters.passengers ||
          vehicle.seating_capacity >= parseInt(filters.passengers)) &&
        (!filters.transmission_type ||
          vehicle.transmission_type === filters.transmission_type);

      return matchesSearch && matchesFilters;
    });
    setFilteredVehicles(results);
  }, [searchTerm, filters, vehicles]);

  // Slider Functions
  const handleSliderMouseDown = (e) => {
    setIsDragging(true);
    updateSliderPosition(e);
    document.addEventListener("mousemove", handleSliderMouseMove);
    document.addEventListener("mouseup", handleSliderMouseUp);
  };

  const handleSliderMouseMove = (e) => {
    if (!isDragging) return;
    updateSliderPosition(e);
  };

  const handleSliderMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener("mousemove", handleSliderMouseMove);
    document.removeEventListener("mouseup", handleSliderMouseUp);
  };

  const handleSliderClick = (e) => {
    updateSliderPosition(e);
  };

  const updateSliderPosition = (e) => {
    if (!sliderRef.current) return;

    const slider = sliderRef.current;
    const rect = slider.getBoundingClientRect();
    let position = e.clientX - rect.left;

    // Constrain position within slider bounds
    position = Math.max(0, Math.min(position, rect.width));

    // Calculate price (0-350)
    const price = Math.round((position / rect.width) * 350);

    setCurrentPrice(price);
    setFilters((prev) => ({ ...prev, priceRange: price }));
  };

  // Toggle driver selection
  const toggleDriver = (e) => {
    const needsDriver = e.target.value === "with";
    setWithDriver(needsDriver);
    if (!needsDriver) {
      setSelectedDriver(null);
      setDriverPrice(0);
      setShowDriverDetails(false);
    } else {
      setDriverPrice(20); // Reset to default driver price when selecting "with driver"
    }
  };

  // Handle driver selection
  const handleDriverChange = (e) => {
    const driverId = e.target.value;
    const driver = drivers.find((d) => d._id === driverId);
    setSelectedDriver(driver);
    setShowDriverDetails(true);
    // Set driver price (you might want to fetch this from the driver's data)
    setDriverPrice(20); // $20 per day as an example
  };

  // Toggle driver details visibility
  const toggleDriverDetails = () => {
    setShowDriverDetails(!showDriverDetails);
  };

  const openViewModal = (vehicle) => {
    setSelectedVehicle(vehicle);

    // Calculate initial total price
    const duration =
      rentalDetails.rentalDuration > 0 ? rentalDetails.rentalDuration : 1;
    const basePrice = vehicle.daily_rate * duration;
    const totalWithDriver = withDriver
      ? basePrice + driverPrice * duration
      : basePrice;
    setTotalPrice(totalWithDriver);

    setViewModalOpen(true);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleRentalDetailChange = (e) => {
    const { name, value } = e.target;
    setRentalDetails((prev) => ({ ...prev, [name]: value }));
  };

  const getTodayDate = () => new Date().toISOString().split("T")[0];

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md text-center">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="w-full h-[40vh] md:h-[70vh] overflow-hidden relative">
        <img
          src="src/assets/images/vehicle rent dashboard image.jpg"
          alt="Luxury vehicles for rent"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl -mt-16 relative z-10">
        {/* Search Form Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <FiSearch className="mr-2 text-blue-600" />
            Search Vehicles
          </h2>

          {/* Date/Time Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Pickup Date */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pickup Date
              </label>
              <div className="relative">
                <FiCalendar className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="date"
                  name="pickupDate"
                  min={getTodayDate()}
                  className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={rentalDetails.pickupDate}
                  onChange={handleRentalDetailChange}
                />
              </div>
            </div>

            {/* Pickup Time */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pickup Time
              </label>
              <div className="relative">
                <FiClock className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="time"
                  name="pickupTime"
                  className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={rentalDetails.pickupTime}
                  onChange={handleRentalDetailChange}
                />
              </div>
            </div>

            {/* Return Date */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Return Date
              </label>
              <div className="relative">
                <FiCalendar className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="date"
                  name="returnDate"
                  min={rentalDetails.pickupDate || getTodayDate()}
                  className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={rentalDetails.returnDate}
                  onChange={handleRentalDetailChange}
                />
              </div>
            </div>

            {/* Return Time */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Return Time
              </label>
              <div className="relative">
                <FiClock className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="time"
                  name="returnTime"
                  className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={rentalDetails.returnTime}
                  onChange={handleRentalDetailChange}
                />
              </div>
            </div>
          </div>

          {/* Driver Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Driver Option
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="driverOption"
                    value="without"
                    checked={!withDriver}
                    onChange={toggleDriver}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">Without Driver</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="driverOption"
                    value="with"
                    checked={withDriver}
                    onChange={toggleDriver}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">
                    With Driver (+${driverPrice}/day)
                  </span>
                </label>
              </div>
            </div>

            {withDriver && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Driver
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-3 text-gray-400" />
                  <select
                    className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={selectedDriver?._id || ""}
                    onChange={handleDriverChange}
                  >
                    <option value="">Select a driver</option>
                    {drivers.map((driver) => (
                      <option key={driver._id} value={driver._id}>
                        {driver.full_name} - {driver.license_class} License
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Driver Details Card */}
          {withDriver && selectedDriver && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
              <div
                className="flex justify-between items-center mb-3 cursor-pointer"
                onClick={toggleDriverDetails}
              >
                <h3 className="text-lg font-semibold flex items-center">
                  <FiUser className="mr-2 text-blue-600" />
                  Driver: {selectedDriver.full_name}
                </h3>
                <div className="text-gray-500">
                  {showDriverDetails ? <FiChevronUp /> : <FiChevronDown />}
                </div>
              </div>

              {showDriverDetails && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Driver Image */}
                  <div className="flex items-center">
                    {selectedDriver.image_upload ? (
                      <img
                        src={`http://localhost:3000${selectedDriver.image_upload}`}
                        alt={selectedDriver.full_name}
                        className="w-20 h-20 rounded-full object-cover mr-4"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/assets/driver-placeholder.png";
                        }}
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gray-200 mr-4 flex items-center justify-center">
                        <svg
                          className="w-10 h-10 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          ></path>
                        </svg>
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium text-lg">
                        {selectedDriver.full_name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {selectedDriver.license_class} License
                      </p>
                      <div className="flex items-center mt-1">
                        <FiStar className="text-yellow-400 mr-1" />
                        <span className="text-sm">
                          {selectedDriver.year_of_experience} years experience
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Driver Information */}
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <FiPhone className="text-gray-500 mr-2" />
                      <span>
                        {selectedDriver.contact_number || "Not provided"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FiMail className="text-gray-500 mr-2" />
                      <span>{selectedDriver.email || "Not provided"}</span>
                    </div>
                    <div className="flex items-center">
                      <FiAward className="text-gray-500 mr-2" />
                      <span>License: {selectedDriver.license_number}</span>
                    </div>
                  </div>

                  {/* Qualifications */}
                  <div className="md:col-span-2">
                    <h4 className="font-medium mb-2 flex items-center">
                      <FiAlertCircle className="text-blue-500 mr-2" />
                      Qualifications
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedDriver.driver_qualifications &&
                        Object.entries(selectedDriver.driver_qualifications)
                          .filter(([_, value]) => value)
                          .map(([qualification]) => (
                            <span
                              key={qualification}
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {qualification.replace(/_/g, " ")}
                            </span>
                          ))}

                      {selectedDriver.custom_qualifications?.map(
                        (qualification, index) => (
                          <span
                            key={`custom-${index}`}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                          >
                            {qualification}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Vehicle Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Vehicle Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Type
              </label>
              <select
                name="vehicle_type"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.vehicle_type}
                onChange={handleFilterChange}
              >
                <option value="">All Types</option>
                <option value="Scooty">Scooty</option>
                <option value="CT100">CT100</option>
                <option value="Car">Car</option>
                <option value="Van">Van</option>
              </select>
            </div>

            {/* Brand/Model Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brand/Model
              </label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by brand or model"
                  className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Passengers */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Passengers
              </label>
              <div className="relative">
                <FiUsers className="absolute left-3 top-3 text-gray-400" />
                <select
                  name="passengers"
                  className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.passengers}
                  onChange={handleFilterChange}
                >
                  <option value="">Any</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="4">4</option>
                  <option value="6">6+</option>
                </select>
              </div>
            </div>

            {/* Transmission Type */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transmission
              </label>
              <div className="relative">
                <FiSettings className="absolute left-3 top-3 text-gray-400" />
                <select
                  name="transmission_type"
                  className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.transmission_type}
                  onChange={handleFilterChange}
                >
                  <option value="">Any</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range: ${currentPrice} (Max $350)
            </label>

            <div
              ref={sliderRef}
              className="relative h-8 w-full cursor-pointer"
              onClick={handleSliderClick}
              onMouseDown={handleSliderMouseDown}
            >
              {/* Slider Track */}
              <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-200 rounded-full transform -translate-y-1/2"></div>

              {/* Active Track */}
              <div
                className="absolute top-1/2 left-0 h-2 bg-blue-500 rounded-full transform -translate-y-1/2"
                style={{ width: `${(currentPrice / 350) * 100}%` }}
              ></div>

              {/* Slider Handle */}
              <div
                className={`absolute top-1/2 w-5 h-5 bg-blue-600 rounded-full shadow-md transform -translate-y-1/2 -translate-x-1/2 cursor-pointer z-10 ${
                  isDragging ? "ring-2 ring-blue-300 scale-110" : ""
                }`}
                style={{ left: `${(currentPrice / 350) * 100}%` }}
              ></div>
            </div>

            {/* Price Scale */}
            <div className="flex justify-between mt-2">
              {[0, 50, 100, 150, 200, 250, 300, 350].map((price) => (
                <span key={price} className="text-xs text-gray-500">
                  ${price}
                </span>
              ))}
            </div>
          </div>

          {/* Rental Duration Display */}
          <div className="mt-6 bg-blue-50 p-3 rounded-lg">
            {rentalDetails.rentalDuration > 0 ? (
              <p className="text-center font-medium text-blue-700">
                Rental Duration:{" "}
                <span className="font-bold">
                  {rentalDetails.rentalDuration}
                </span>{" "}
                day{rentalDetails.rentalDuration !== 1 ? "s" : ""}
                {withDriver && selectedDriver && (
                  <span>
                    {" "}
                    • Driver:{" "}
                    <span className="font-bold">
                      {selectedDriver.full_name}
                    </span>{" "}
                    (${driverPrice}/day)
                  </span>
                )}
              </p>
            ) : (
              <p className="text-center text-gray-500">
                Select dates to see duration
              </p>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">
            Available Vehicles ({filteredVehicles.length})
          </h3>
        </div>

        {/* Vehicle Grid */}
        {filteredVehicles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <p className="text-gray-500 text-lg">
              No vehicles match your search criteria
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setFilters({
                  vehicle_type: "",
                  priceRange: 350,
                  passengers: "",
                  transmission_type: "",
                });
                setCurrentPrice(350);
              }}
              className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <div
                key={vehicle._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Vehicle Image */}
                <div className="relative h-48 w-full">
                  {vehicle.image_upload ? (
                    <img
                      src={`http://localhost:3000/${vehicle.image_upload}`}
                      alt={vehicle.model}
                      className="h-full w-full object-cover"
                      onError={(e) =>
                        (e.target.src = "/assets/vehicle-placeholder.png")
                      }
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                      <svg
                        className="w-20 h-20 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        ></path>
                      </svg>
                    </div>
                  )}
                </div>

                {/* Vehicle Details */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-800">
                      {vehicle.brand} {vehicle.model}
                    </h3>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {vehicle.vehicle_type}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mb-4">
                    {vehicle.year_of_manufacture} • {vehicle.fuel_type}
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg
                        className="w-4 h-4 mr-2 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        ></path>
                      </svg>
                      {vehicle.seating_capacity} Seats
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg
                        className="w-4 h-4 mr-2 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                        ></path>
                      </svg>
                      {vehicle.transmission_type}
                    </div>
                  </div>

                  {/* Price Display Section */}
                  <div className="bg-blue-50 p-3 rounded-lg mb-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-blue-800">
                        <span className="font-medium">
                          ${vehicle.daily_rate}/day
                        </span>
                      </div>
                      {vehicle.rentalDuration > 1 && (
                        <div className="flex items-center text-green-700">
                          <span className="text-sm">
                            {vehicle.rentalDuration} day
                            {vehicle.rentalDuration !== 1 ? "s" : ""} •{" "}
                          </span>
                          <span className="font-bold ml-1">
                            ${vehicle.totalPrice}
                            {withDriver && selectedDriver && (
                              <span className="text-xs">
                                {" "}
                                (+${driverPrice * vehicle.rentalDuration} for
                                driver)
                              </span>
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                    {withDriver && selectedDriver && (
                      <div className="mt-2 text-sm text-gray-700">
                        <span className="font-medium">Total with driver:</span>{" "}
                        $
                        {vehicle.totalPrice +
                          driverPrice * vehicle.rentalDuration}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center gap-2">
                    <button
                      onClick={() => openViewModal(vehicle)}
                      className="text-blue-600 hover:text-blue-800 font-medium flex items-center text-sm px-3 py-2 rounded-lg hover:bg-blue-50 flex-1 justify-center"
                    >
                      View Details
                    </button>
                    <Link
                      to={`/book-vehicle/${vehicle._id}`}
                      state={{
                        rentalDetails,
                        totalPrice:
                          withDriver && selectedDriver
                            ? vehicle.totalPrice +
                              driverPrice * vehicle.rentalDuration
                            : vehicle.totalPrice,
                        driver: withDriver ? selectedDriver : null,
                        driverPrice: withDriver ? driverPrice : 0,
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200 flex items-center justify-center flex-1"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rental Summary Banner */}
      {rentalDetails.rentalDuration > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-blue-600 text-white p-3 shadow-lg z-20">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <FiCalendar className="mr-2" />
              <div>
                <p className="text-sm font-medium">Selected Rental Period</p>
                <p className="text-xs">
                  {rentalDetails.pickupDate} to {rentalDetails.returnDate} •{" "}
                  {rentalDetails.rentalDuration} day
                  {rentalDetails.rentalDuration !== 1 ? "s" : ""}
                  {withDriver && selectedDriver && (
                    <span> • With Driver: {selectedDriver.full_name}</span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="font-bold">
                {filteredVehicles.length} vehicle
                {filteredVehicles.length !== 1 ? "s" : ""} available
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Vehicle Details Modal */}
      <UserVehicleModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        vehicle={selectedVehicle}
        rentalDetails={{
          ...rentalDetails,
          duration: selectedVehicle?.rentalDuration || 1,
        }}
        totalPrice={totalPrice || (selectedVehicle?.daily_rate ?? 0)}
        withDriver={withDriver}
        selectedDriver={selectedDriver}
        driverPrice={driverPrice}
      />
    </div>
  );
};

export default UserVehicleDashboard;
