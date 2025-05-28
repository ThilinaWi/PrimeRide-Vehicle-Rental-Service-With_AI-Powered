import React from 'react';

const ViewPackage = ({ isOpen, onClose, pkg }) => {
  if (!isOpen || !pkg) return null;

  // Enhanced helper function to render object properties with icons
  const renderObjectProperties = (obj, type = 'additional') => {
    if (!obj || Object.keys(obj).length === 0) {
      return <span className="text-gray-400 italic">None</span>;
    }
    
    const features = typeof obj === 'string' ? JSON.parse(obj) : obj;
    const iconMap = {
  
      default: '✅'
    };

    return (
      <div className="flex flex-wrap gap-2 mt-1">
        {Object.entries(features)
          .filter(([_, value]) => value)
          .map(([key]) => (
            <span 
              key={key}
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                type === 'additional' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-green-100 text-green-800'
              }`}
            >
              {iconMap[key] || iconMap.default} {key.replace(/_/g, ' ')}
            </span>
          ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden transform transition-all duration-300 ease-out">
        {/* Modal Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 z-10 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">{pkg.package_name}</h2>
            <p className="text-blue-100 text-sm">{pkg.package_type} Package</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-blue-200 transition-colors duration-200 rounded-full p-1 hover:bg-blue-700/30"
            aria-label="Close"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto flex-1 p-6">
          {/* Image Section - Adjusted Size */}
          <div className="mb-6 flex justify-center">
            <div className="relative w-full max-w rounded-lg overflow-hidden bg-gray-100 shadow-md border border-gray-200">
              {pkg.image_upload ? (
                <img
                  src={`http://localhost:3000/${pkg.image_upload}`}
                  alt={pkg.package_name}
                  className="w-full h-auto max-h-64 object-contain"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/600x400?text=Package+Image';
                    e.target.className = 'w-full h-auto max-h-64 object-cover';
                  }}
                />
              ) : (
                <div className="w-full h-64 flex items-center justify-center bg-gray-100">
                  <span className="text-gray-400 text-lg">No image available</span>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <h3 className="text-white font-semibold text-lg">{pkg.vehicle_model}</h3>
                <p className="text-blue-200 text-sm">{pkg.vehicle_number}</p>
              </div>
            </div>
          </div>

          {/* Package Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Basic Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Package ID</p>
                    <p className="mt-1 font-medium text-gray-900">{pkg.package_id}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-400">Package Type</p>
                    <p className="mt-1 font-medium text-gray-900">{pkg.package_type}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-400">Duration</p>
                    <p className="mt-1 font-medium text-gray-900">{pkg.duration} days</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-400">Price Per Day</p>
                    <p className="mt-1 font-medium text-gray-900">${pkg.price_per_day}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Vehicle Specifications</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Model</p>
                    <p className="mt-1 font-medium text-gray-900">{pkg.vehicle_model}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400">Number</p>
                    <p className="mt-1 font-medium text-gray-900">{pkg.vehicle_number}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400">Seat Capacity</p>
                    <p className="mt-1 font-medium text-gray-900">{pkg.seating_capacity} persons</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-400">Luggage Capacity</p>
                    <p className="mt-1 font-medium text-gray-900">{pkg.luggage_capacity} </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 h-75">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Description</h3>
                <p className="text-gray-700 whitespace-pre-line">{pkg.description || 'No description provided'}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Additional Features</h3>
                {renderObjectProperties(pkg.additional_features, 'additional')}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Security Features</h3>
                {renderObjectProperties(pkg.safety_security_features, 'security')}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewPackage;