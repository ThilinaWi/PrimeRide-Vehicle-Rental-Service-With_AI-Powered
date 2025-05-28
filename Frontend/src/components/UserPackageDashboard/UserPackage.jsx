import React, { useState, useEffect, useRef } from "react";
import { packageService } from "../../services/packageService";
import UserPackageModal from "../packageManagement/viewpackage/UserPackageModal";
import { Link } from "react-router-dom";
import {
  FiCalendar,
  FiClock,
  FiSearch,
  FiDollarSign,
  FiUsers,
  FiMapPin,
  FiBriefcase
} from "react-icons/fi";

const UserPackageDashboard = () => {
  // Package Data States
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal States
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    package_type: "",
    priceRange: 1000,
    duration: "",
    seating_capacity: "",
  });
  const [bookingDetails, setBookingDetails] = useState({
    startDate: "",
    endDate: "",
    duration: 0,
  });

  // Slider Refs and States
  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(1000);

  // Fetch packages on component mount
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const data = await packageService.getAllPackages();
        const packagesWithPrices = Array.isArray(data)
          ? data.map((p) => ({ ...p, totalPrice: p.price_per_day }))
          : [];
        setPackages(packagesWithPrices);
        setFilteredPackages(packagesWithPrices);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Error fetching packages");
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  // Calculate booking duration and total price when dates change
  useEffect(() => {
    if (bookingDetails.startDate && bookingDetails.endDate) {
      const start = new Date(bookingDetails.startDate);
      const end = new Date(bookingDetails.endDate);
      const diffTime = Math.max(end - start, 0);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

      setBookingDetails((prev) => ({ ...prev, duration: diffDays }));

      // Update prices for all filtered packages
      setFilteredPackages((prevPackages) =>
        prevPackages.map((pkg) => ({
          ...pkg,
          totalPrice: pkg.price_per_day * diffDays,
          bookingDuration: diffDays,
        }))
      );

      if (selectedPackage) {
        setTotalPrice(selectedPackage.price_per_day * diffDays);
      }
    } else {
      // Reset to daily prices when no dates selected
      setFilteredPackages((prevPackages) =>
        prevPackages.map((pkg) => ({
          ...pkg,
          totalPrice: pkg.price_per_day,
          bookingDuration: 1,
        }))
      );
      setTotalPrice(0);
    }
  }, [bookingDetails.startDate, bookingDetails.endDate, selectedPackage]);

  // Apply filters whenever search criteria change
  useEffect(() => {
    const results = packages.filter((pkg) => {
      const matchesSearch =
        searchTerm === "" ||
        pkg.package_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilters =
        (!filters.package_type || pkg.package_type === filters.package_type) &&
        (filters.priceRange === 1000 || pkg.price_per_day <= filters.priceRange) &&
        (!filters.duration || 
          (Array.isArray(pkg.duration) 
            ? pkg.duration.some(d => parseInt(d) >= parseInt(filters.duration))
            : parseInt(pkg.duration) >= parseInt(filters.duration))) &&
        (!filters.seating_capacity || 
          pkg.seating_capacity >= parseInt(filters.seating_capacity));

      return matchesSearch && matchesFilters;
    });
    setFilteredPackages(results);
  }, [searchTerm, filters, packages]);

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

    // Calculate price (0-1000)
    const price = Math.round((position / rect.width) * 1000);

    setCurrentPrice(price);
    setFilters((prev) => ({ ...prev, priceRange: price }));
  };

  const openViewModal = (pkg) => {
    setSelectedPackage(pkg);

    // Calculate initial total price
    const duration = bookingDetails.duration > 0 ? bookingDetails.duration : 1;
    setTotalPrice(pkg.price_per_day * duration);

    setViewModalOpen(true);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookingDetailChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails((prev) => ({ ...prev, [name]: value }));
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
<div className="w-full h-[60vh] md:h-[90vh] overflow-hidden relative group">
  {/* Background Image with Parallax Effect */}
  <div className="absolute inset-0 overflow-hidden">
    <img
      src="src/assets/images/rental package.jpg"
      alt="Luxury vehicles for rent"
      className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-1000 ease-in-out"
    />
    {/* Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
  </div>

  {/* Content Container */}
  <div className="relative h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div className="text-center max-w-4xl mx-auto space-y-6 animate-fadeIn">
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
        Discover Your Perfect <span className="text-amber-400">Rental Package</span>
      </h1>
      
      <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
      Choose from curated rental packages for every adventure, whether it's a road trip, luxury getaway, or water escapade.
      </p>
      
      <div className="pt-4 flex gap-4 justify-center">
        <button className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
          Explore Packages
        </button>
      </div>
    </div>
  </div>

 
</div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl -mt-16 relative z-10">
        {/* Search Form Card */}
        <div className="bg-white rounded-xl shadow-xl p-6 mb-8 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <FiSearch className="mr-2 text-blue-600" />
            Search Packages
          </h2>

          {/* Date Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Start Date */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <div className="relative">
                <FiCalendar className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="date"
                  name="startDate"
                  min={getTodayDate()}
                  className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:border-blue-500"
                  value={bookingDetails.startDate}
                  onChange={handleBookingDetailChange}
                />
              </div>
            </div>

            {/* End Date */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <div className="relative">
                <FiCalendar className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="date"
                  name="endDate"
                  min={bookingDetails.startDate || getTodayDate()}
                  className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:border-blue-500"
                  value={bookingDetails.endDate}
                  onChange={handleBookingDetailChange}
                />
              </div>
            </div>
          </div>

          {/* Package Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Package Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Package Type
              </label>
              <select
                name="package_type"
                className="w-full p-2 border border-gray-300 rounded-lg  focus:border-blue-500"
                value={filters.package_type}
                onChange={handleFilterChange}
              >
                <option value="">All Types</option>
                <option value="Standard">Standard</option>
                <option value="Premium">Premium</option>
                <option value="Luxury">Luxury</option>
                <option value="VIP">VIP</option>
              </select>
            </div>

            {/* Package Name Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Package Name
              </label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or description"
                  className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:border-blue-500 "
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Duration */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
               Duration 
              </label>
              <div className="relative">
                <FiClock className="absolute left-3 top-3 text-gray-400" />
                <select
                  name="duration"
                  className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:border-blue-500"
                  value={filters.duration}
                  onChange={handleFilterChange}
                >
                  <option value="">Any</option>
                  <option value="">30-45 minutes</option>
                  <option value="">2-3hours</option>
                  <option value="1">1 day</option>
                  <option value="2">2 days</option>
                  <option value="4">4 days</option>
                  <option value="6">6+ days</option>
                </select>
              </div>
            </div>

            {/* Seating Capacity */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
              passengers
              </label>
              <div className="relative">
                <FiUsers className="absolute left-3 top-3 text-gray-400" />
                <select
                  name="seating_capacity"
                  className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.seating_capacity}
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
          </div>

          {/* Price Range Slider */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range: ${currentPrice} (Max $1000/day)
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
                style={{ width: `${(currentPrice / 1000) * 100}%` }}
              ></div>

              {/* Slider Handle */}
              <div
                className={`absolute top-1/2 w-5 h-5 bg-blue-600 rounded-full shadow-md transform -translate-y-1/2 -translate-x-1/2 cursor-pointer z-10 ${
                  isDragging ? "ring-2 ring-blue-300 scale-110" : ""
                }`}
                style={{ left: `${(currentPrice / 1000) * 100}%` }}
              ></div>
            </div>

            {/* Price Scale */}
            <div className="flex justify-between mt-2">
              {[0, 200, 400, 600, 800, 1000].map((price) => (
                <span key={price} className="text-xs text-gray-500">
                  ${price}
                </span>
              ))}
            </div>
          </div>

          {/* Booking Duration Display */}
          <div className="mt-6 bg-blue-50 p-3 rounded-lg">
            {bookingDetails.duration > 0 ? (
              <p className="text-center font-medium text-blue-700">
                Booking Duration:{" "}
                <span className="font-bold">
                  {bookingDetails.duration}
                </span>{" "}
                day{bookingDetails.duration !== 1 ? "s" : ""}
              </p>
            ) : (
              <p className="text-center text-gray-500">
                Select dates to see duration
              </p>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-10 flex mt-12 justify-between items-center">
          <h3 className="text-2xl font-semibold text-gray-800">
            Available Packages ({filteredPackages.length})
          </h3>
        </div>

        {/* Package Grid */}
        {filteredPackages.length === 0 ? (
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
              No packages match your search criteria
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setFilters({
                  package_type: "",
                  priceRange: 1000,
                  duration: "",
                  seating_capacity: "",
                });
                setCurrentPrice(1000);
              }}
              className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg) => (
              <div
                key={pkg._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Package Image */}
                <div className="relative h-59  w-full">
                  {pkg.image_upload ? (
                    <img
                      src={`http://localhost:3000/${pkg.image_upload}`}
                      alt={pkg.package_name}
                      className="h-full w-full object-cover"
                      onError={(e) =>
                        (e.target.src = "/assets/package-placeholder.png")
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

                {/* Package Details */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-800">
                      {pkg.package_name}
                    </h3>
                    <span className={`text-xs font-medium px-3 py-3 rounded ${
                      pkg.package_type === 'Luxury' ? 'bg-purple-100 text-purple-800' :
                      pkg.package_type === 'Premium' ? 'bg-blue-100 text-blue-800' :
                      pkg.package_type === 'VIP' ? 'bg-red-100 text-red-800' :
                      'bg-green-100 text-gray-800'
                    }`}>
                      {pkg.package_type}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                    {pkg.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="flex items-center text-sm text-gray-600">
                      <FiClock className="w-4 h-4 mr-2 text-gray-400" />
                      {Array.isArray(pkg.duration) ? pkg.duration.join(", ") : pkg.duration}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FiUsers className="w-4 h-4 mr-2 text-gray-400" />
                      {pkg.seating_capacity} Seats
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FiBriefcase className="w-4 h-4 mr-2 text-gray-400" />
                      {Object.keys(pkg.additional_features || {}).filter(k => pkg.additional_features[k]).length} features
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FiMapPin className="w-4 h-4 mr-2 text-gray-400" />
                      {pkg.vehicle_model}
                    </div>
                  </div>

                  {/* Price Display Section */}
                  <div className="bg-blue-50 p-3 rounded-lg mb-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-lg text-blue-800">
                        <span className="font-medium">
                          ${pkg.price_per_day}/day
                        </span>
                      </div>
                      {pkg.bookingDuration > 1 && (
                        <div className="flex items-center text-green-700">
                          <span className="text-sm">
                            {pkg.bookingDuration} days •{" "}
                          </span>
                          <span className="font-bold ml-1">
                            ${pkg.totalPrice}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center gap-2">
                    <button
                      onClick={() => openViewModal(pkg)}
                      className="text-blue-600 hover:text-blue-800 font-medium flex items-center text-sm px-3 py-2 rounded-lg hover:bg-blue-50 flex-1 justify-center"
                    >
                      View Details
                    </button>
                    <Link
                      to={`/book-package/${pkg._id}`}
                      state={{
                        bookingDetails,
                        totalPrice: pkg.totalPrice || pkg.price_per_day,
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
      {/* Booking Summary Banner */}
      {bookingDetails.duration > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-blue-600 text-white p-3 shadow-lg z-20">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <FiCalendar className="mr-2" />
              <div>
                <p className="text-sm font-medium">Selected Booking Period</p>
                <p className="text-xs">
                  {bookingDetails.startDate} to {bookingDetails.endDate} •{" "}
                  {bookingDetails.duration} 
                  {bookingDetails.duration !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="font-bold">
                {filteredPackages.length} package
                {filteredPackages.length !== 1 ? "s" : ""} available
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Package Details Modal */}
      <UserPackageModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        package={selectedPackage}
        bookingDetails={{
          ...bookingDetails,
          duration: selectedPackage?.bookingDuration || 1,
        }}
        totalPrice={totalPrice || (selectedPackage?.price_per_day ?? 0)}
      />
    </div>
  );
};

export default UserPackageDashboard;