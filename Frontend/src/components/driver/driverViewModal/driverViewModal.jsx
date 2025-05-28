import React from "react";

const DriverViewModal = ({ isOpen, onClose, driver }) => {
  if (!isOpen || !driver) return null;

  // Format qualifications for display
  const formatQualifications = (qualifications) => {
    return (
      Object.entries(qualifications)
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
                {driver.full_name || "Driver Details"}
              </h2>
              <p className="text-gray-600 mt-1">
                ID: {driver.driver_id || "N/A"} •{" "}
                {driver.license_class || "N/A"} License
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
            {/* Driver Image */}
            <div className="lg:col-span-1">
              <div className="bg-gray-100 rounded-lg overflow-hidden aspect-w-4 aspect-h-3">
                {driver.image_upload ? (
                  <img
                    src={`http://localhost:3000${driver.image_upload}`}
                    alt={`${driver.full_name}`}
                    className="w-full h-full object-cover"
                    onError={(e) =>
                      (e.target.src = "/assets/driver-placeholder.png")
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

            {/* Driver Details */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Contact Number
                    </h4>
                    <p className="mt-1 text-gray-900 font-medium">
                      {driver.contact_number || "N/A"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </h4>
                    <p className="mt-1 text-gray-900">
                      {driver.email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                      License Number
                    </h4>
                    <p className="mt-1 text-gray-900">
                      {driver.license_number || "N/A"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Date of Birth
                    </h4>
                    <p className="mt-1 text-gray-900">
                      {driver.date_of_birth || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Years of Experience
                    </h4>
                    <p className="mt-1 text-gray-900">
                      {driver.year_of_experience || "N/A"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </h4>
                    <p
                      className={`mt-1 inline-block px-2 py-1 rounded-full text-xs ${
                        driver.availability_status === "available"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {driver.availability_status
                        ? driver.availability_status.charAt(0).toUpperCase() +
                          driver.availability_status.slice(1).toLowerCase()
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Emergency Contact
                    </h4>
                    <p className="mt-1 text-gray-900">
                      {driver.emergency_contact || "N/A"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                      License Class
                    </h4>
                    <p className="mt-1 text-gray-900 capitalize">
                      {driver.license_class || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Address Section */}
              {driver.address && (
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Address
                  </h3>
                  <p className="text-gray-700">{driver.address}</p>
                </div>
              )}

              {/* Qualifications Section */}
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Qualifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Standard Qualifications
                    </h4>
                    <ul className="space-y-2">
                      {driver.driver_qualifications &&
                        Object.entries(driver.driver_qualifications).map(
                          ([qualification, enabled]) =>
                            enabled && (
                              <li
                                key={qualification}
                                className="flex items-center"
                              >
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
                                  {qualification.replace("_", " ")}
                                </span>
                              </li>
                            )
                        )}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Custom Qualifications
                    </h4>
                    {driver.custom_qualifications?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {driver.custom_qualifications.map(
                          (qualification, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                            >
                              {qualification}
                            </span>
                          )
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500">No custom qualifications</p>
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

export default DriverViewModal;
