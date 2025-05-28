import React from "react";

const ViewVehicleModal = ({ isOpen, onClose, vehicle }) => {
  if (!isOpen || !vehicle) return null;

  // Format features for display
  const formatFeatures = (features) => {
    return (
      Object.entries(features)
        .filter(([_, value]) => value)
        .map(([key]) => key.replace("_", " "))
        .join(", ") || "None"
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {vehicle.brand} - {vehicle.vehicle_number}
              </h2>
              <p className="text-gray-600 mt-1">
                {vehicle.vehicle_type} • {vehicle.year_of_manufacture}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Vehicle Image */}
            <div className="lg:col-span-1">
              <div className="bg-gray-100 rounded-lg overflow-hidden aspect-w-4 aspect-h-3">
                {vehicle.image_upload ? (
                  <img
                    src={`http://localhost:3000/${vehicle.image_upload}`}
                    alt={`${vehicle.brand} ${vehicle.vehicle_number}`}
                    className="w-full h-full object-cover"
                    onError={(e) =>
                      (e.target.src = "/assets/vehicle-placeholder.png")
                    }
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                    <svg
                      className="w-16 h-16"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Vehicle Number
                    </h4>
                    <p className="mt-1 text-gray-900 font-medium">
                      {vehicle.vehicle_number}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </h4>
                    <p className="mt-1 text-gray-900">{vehicle.vehicle_type}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Brand
                    </h4>
                    <p className="mt-1 text-gray-900">{vehicle.brand}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Year
                    </h4>
                    <p className="mt-1 text-gray-900">
                      {vehicle.year_of_manufacture}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Seating Capacity
                    </h4>
                    <p className="mt-1 text-gray-900">
                      {vehicle.seating_capacity}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Fuel Type
                    </h4>
                    <p className="mt-1 text-gray-900">{vehicle.fuel_type}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Transmission
                    </h4>
                    <p className="mt-1 text-gray-900">
                      {vehicle.transmission_type}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Daily Rate
                    </h4>
                    <p className="mt-1 text-gray-900 font-bold">
                      ${vehicle.daily_rate}
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Features Section */}
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Standard Features
                    </h4>
                    <ul className="space-y-2">
                      {vehicle.additional_features &&
                        Object.entries(vehicle.additional_features).map(
                          ([feature, enabled]) =>
                            enabled && (
                              <li key={feature} className="flex items-center">
                                <svg
                                  className="h-5 w-5 text-green-500 mr-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                <span className="capitalize">
                                  {feature.replace("_", " ")}
                                </span>
                              </li>
                            )
                        )}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Custom Features
                    </h4>
                    {vehicle.custom_additional_features?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {vehicle.custom_additional_features.map(
                          (feature, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {feature}
                            </span>
                          )
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500">No custom features</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Safety Features Section */}
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Safety Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Standard Safety
                    </h4>
                    <ul className="space-y-2">
                      {vehicle.safety_features &&
                        Object.entries(vehicle.safety_features).map(
                          ([feature, enabled]) =>
                            enabled && (
                              <li key={feature} className="flex items-center">
                                <svg
                                  className="h-5 w-5 text-green-500 mr-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                <span className="capitalize">
                                  {feature.replace("_", " ")}
                                </span>
                              </li>
                            )
                        )}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Custom Safety
                    </h4>
                    {vehicle.custom_safety_features?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {vehicle.custom_safety_features.map(
                          (feature, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                            >
                              {feature}
                            </span>
                          )
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500">No custom safety features</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewVehicleModal;
