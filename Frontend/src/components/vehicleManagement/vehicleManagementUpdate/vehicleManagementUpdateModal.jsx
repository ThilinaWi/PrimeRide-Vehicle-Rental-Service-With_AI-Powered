import React, { useState, useEffect } from "react";
import { vehicleService } from "../../../services/vehicleService";

const EditVehicleModal = ({ isOpen, onClose, vehicle, onSuccess }) => {
  const [formData, setFormData] = useState({
    vehicle_number: "",
    vehicle_type: "",
    brand: "",
    year_of_manufacture: "",
    seating_capacity: "",
    fuel_type: "",
    transmission_type: "",
    daily_rate: "",
    additional_features: {
      air_conditioning: false,
      navigation_system: false,
      bluetooth: false,
      sunroof: false,
    },
    safety_features: {
      abs: false,
      airbags: false,
      parking_sensors: false,
      stability_control: false,
    },
    custom_additional_features: [],
    custom_safety_features: [],
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCustomFeature, setNewCustomFeature] = useState("");
  const [newCustomSafetyFeature, setNewCustomSafetyFeature] = useState("");

  useEffect(() => {
    if (vehicle) {
      setFormData({
        vehicle_number: vehicle.vehicle_number || "",
        vehicle_type: vehicle.vehicle_type || "",
        brand: vehicle.brand || "",
        year_of_manufacture: vehicle.year_of_manufacture || "",
        seating_capacity: vehicle.seating_capacity || "",
        fuel_type: vehicle.fuel_type || "",
        transmission_type: vehicle.transmission_type || "",
        daily_rate: vehicle.daily_rate || "",
        additional_features: vehicle.additional_features || {
          air_conditioning: false,
          navigation_system: false,
          bluetooth: false,
          sunroof: false,
        },
        safety_features: vehicle.safety_features || {
          abs: false,
          airbags: false,
          parking_sensors: false,
          stability_control: false,
        },
        custom_additional_features: vehicle.custom_additional_features || [],
        custom_safety_features: vehicle.custom_safety_features || [],
      });
      setImagePreview(
        vehicle.image_upload
          ? `http://localhost:3000/${vehicle.image_upload}`
          : ""
      );
    }
  }, [vehicle]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Input validation
    if (name === "daily_rate" && (isNaN(value) || value < 0 || value > 350))
      return;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field error when user types
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCheckboxChange = (featureType, featureName) => {
    setFormData((prev) => ({
      ...prev,
      [featureType]: {
        ...prev[featureType],
        [featureName]: !prev[featureType][featureName],
      },
    }));
  };

  const handleAddCustomFeature = () => {
    if (
      newCustomFeature.trim() &&
      !formData.custom_additional_features.includes(newCustomFeature.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        custom_additional_features: [
          ...prev.custom_additional_features,
          newCustomFeature.trim(),
        ],
      }));
      setNewCustomFeature("");
    }
  };

  const handleRemoveCustomFeature = (feature) => {
    setFormData((prev) => ({
      ...prev,
      custom_additional_features: prev.custom_additional_features.filter(
        (f) => f !== feature
      ),
    }));
  };

  const handleAddCustomSafetyFeature = () => {
    if (
      newCustomSafetyFeature.trim() &&
      !formData.custom_safety_features.includes(newCustomSafetyFeature.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        custom_safety_features: [
          ...prev.custom_safety_features,
          newCustomSafetyFeature.trim(),
        ],
      }));
      setNewCustomSafetyFeature("");
    }
  };

  const handleRemoveCustomSafetyFeature = (feature) => {
    setFormData((prev) => ({
      ...prev,
      custom_safety_features: prev.custom_safety_features.filter(
        (f) => f !== feature
      ),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && ["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setFieldErrors((prev) => ({ ...prev, image_upload: "" }));
    } else {
      setImage(null);
      setFieldErrors((prev) => ({
        ...prev,
        image_upload: "Please upload a valid image (JPEG, JPG, PNG)",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.vehicle_number)
      errors.vehicle_number = "Vehicle number is required";
    if (!formData.vehicle_type)
      errors.vehicle_type = "Vehicle type is required";
    if (!formData.brand) errors.brand = "Brand is required";
    if (!formData.year_of_manufacture)
      errors.year_of_manufacture = "Year is required";
    if (!formData.seating_capacity)
      errors.seating_capacity = "Seating capacity is required";
    if (!formData.fuel_type) errors.fuel_type = "Fuel type is required";
    if (!formData.transmission_type)
      errors.transmission_type = "Transmission type is required";
    if (
      !formData.daily_rate ||
      formData.daily_rate < 0 ||
      formData.daily_rate > 350
    ) {
      errors.daily_rate = "Daily rate must be between $0 and $350";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setError("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const data = new FormData();
      for (const key in formData) {
        if (key === "additional_features" || key === "safety_features") {
          data.append(key, JSON.stringify(formData[key]));
        } else if (
          key === "custom_additional_features" ||
          key === "custom_safety_features"
        ) {
          data.append(key, JSON.stringify(formData[key]));
        } else {
          data.append(key, formData[key]);
        }
      }
      if (image) {
        data.append("image_upload", image);
      }

      const updatedVehicle = await vehicleService.updateVehicle(
        vehicle._id,
        data
      );
      onSuccess(updatedVehicle);
      onClose();
    } catch (err) {
      setError(err.message || "Error updating vehicle");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-bold text-gray-900">Edit Vehicle</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
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

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Vehicle Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Vehicle Number *
                </label>
                <input
                  type="text"
                  name="vehicle_number"
                  value={formData.vehicle_number}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    fieldErrors.vehicle_number
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  required
                />
                {fieldErrors.vehicle_number && (
                  <p className="mt-1 text-sm text-red-600">
                    {fieldErrors.vehicle_number}
                  </p>
                )}
              </div>

              {/* Vehicle Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Vehicle Type *
                </label>
                <select
                  name="vehicle_type"
                  value={formData.vehicle_type}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    fieldErrors.vehicle_type
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Scooty">Scooty</option>
                  <option value="CT100">CT100</option>
                  <option value="Car">Car</option>
                  <option value="Van">Van</option>
                </select>
                {fieldErrors.vehicle_type && (
                  <p className="mt-1 text-sm text-red-600">
                    {fieldErrors.vehicle_type}
                  </p>
                )}
              </div>

              {/* Brand */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Brand *
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    fieldErrors.brand ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {fieldErrors.brand && (
                  <p className="mt-1 text-sm text-red-600">
                    {fieldErrors.brand}
                  </p>
                )}
              </div>

              {/* Year of Manufacture */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Year of Manufacture *
                </label>
                <input
                  type="number"
                  name="year_of_manufacture"
                  value={formData.year_of_manufacture}
                  onChange={handleChange}
                  min="1900"
                  max={new Date().getFullYear()}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    fieldErrors.year_of_manufacture
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  required
                />
                {fieldErrors.year_of_manufacture && (
                  <p className="mt-1 text-sm text-red-600">
                    {fieldErrors.year_of_manufacture}
                  </p>
                )}
              </div>

              {/* Seating Capacity */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Seating Capacity *
                </label>
                <input
                  type="number"
                  name="seating_capacity"
                  value={formData.seating_capacity}
                  onChange={handleChange}
                  min="1"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    fieldErrors.seating_capacity
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  required
                />
                {fieldErrors.seating_capacity && (
                  <p className="mt-1 text-sm text-red-600">
                    {fieldErrors.seating_capacity}
                  </p>
                )}
              </div>

              {/* Fuel Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fuel Type *
                </label>
                <select
                  name="fuel_type"
                  value={formData.fuel_type}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    fieldErrors.fuel_type ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                >
                  <option value="">Select Fuel Type</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
                {fieldErrors.fuel_type && (
                  <p className="mt-1 text-sm text-red-600">
                    {fieldErrors.fuel_type}
                  </p>
                )}
              </div>

              {/* Transmission Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Transmission Type *
                </label>
                <select
                  name="transmission_type"
                  value={formData.transmission_type}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    fieldErrors.transmission_type
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  required
                >
                  <option value="">Select Transmission</option>
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
                {fieldErrors.transmission_type && (
                  <p className="mt-1 text-sm text-red-600">
                    {fieldErrors.transmission_type}
                  </p>
                )}
              </div>

              {/* Daily Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Daily Rate ($0-$350) *
                </label>
                <input
                  type="number"
                  name="daily_rate"
                  value={formData.daily_rate}
                  onChange={handleChange}
                  min="0"
                  max="350"
                  step="1"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    fieldErrors.daily_rate
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  required
                />
                {fieldErrors.daily_rate && (
                  <p className="mt-1 text-sm text-red-600">
                    {fieldErrors.daily_rate}
                  </p>
                )}
              </div>
            </div>

            {/* Additional Features Section */}
            <div className="border-t pt-4 mt-4">
              <h4 className="text-lg font-medium text-gray-900 mb-3">
                Additional Features
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Standard Features
                  </label>
                  <div className="space-y-2">
                    {Object.entries(formData.additional_features).map(
                      ([feature, value]) => (
                        <div key={feature} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`feature-${feature}`}
                            checked={value}
                            onChange={() =>
                              handleCheckboxChange(
                                "additional_features",
                                feature
                              )
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor={`feature-${feature}`}
                            className="ml-2 block text-sm text-gray-700 capitalize"
                          >
                            {feature.replace("_", " ")}
                          </label>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Features
                  </label>
                  <div className="flex mb-2">
                    <input
                      type="text"
                      value={newCustomFeature}
                      onChange={(e) => setNewCustomFeature(e.target.value)}
                      placeholder="Add custom feature"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomFeature}
                      className="ml-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.custom_additional_features.map(
                      (feature, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {feature}
                          <button
                            type="button"
                            onClick={() => handleRemoveCustomFeature(feature)}
                            className="ml-1.5 inline-flex text-blue-400 hover:text-blue-600"
                          >
                            ×
                          </button>
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Safety Features Section */}
            <div className="border-t pt-4 mt-4">
              <h4 className="text-lg font-medium text-gray-900 mb-3">
                Safety Features
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Standard Features
                  </label>
                  <div className="space-y-2">
                    {Object.entries(formData.safety_features).map(
                      ([feature, value]) => (
                        <div key={feature} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`safety-${feature}`}
                            checked={value}
                            onChange={() =>
                              handleCheckboxChange("safety_features", feature)
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor={`safety-${feature}`}
                            className="ml-2 block text-sm text-gray-700 capitalize"
                          >
                            {feature.replace("_", " ")}
                          </label>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Safety Features
                  </label>
                  <div className="flex mb-2">
                    <input
                      type="text"
                      value={newCustomSafetyFeature}
                      onChange={(e) =>
                        setNewCustomSafetyFeature(e.target.value)
                      }
                      placeholder="Add custom safety feature"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomSafetyFeature}
                      className="ml-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.custom_safety_features.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                      >
                        {feature}
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveCustomSafetyFeature(feature)
                          }
                          className="ml-1.5 inline-flex text-green-400 hover:text-green-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="border-t pt-4 mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Image
              </label>
              <input
                type="file"
                onChange={handleImageChange}
                accept="image/jpeg,image/jpg,image/png"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Vehicle Preview"
                    className="h-32 w-32 object-cover rounded-md border"
                  />
                </div>
              )}
              {fieldErrors.image_upload && (
                <p className="mt-1 text-sm text-red-600">
                  {fieldErrors.image_upload}
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditVehicleModal;
