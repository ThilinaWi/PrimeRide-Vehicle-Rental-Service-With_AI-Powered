import React, { useState } from "react";
import { vehicleService } from "../../../services/vehicleService";
import { useNavigate } from "react-router-dom";

const CreateVehicle = () => {
  const navigate = useNavigate();
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
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [newCustomAdditionalFeature, setNewCustomAdditionalFeature] =
    useState("");
  const [newCustomSafetyFeature, setNewCustomSafetyFeature] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
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

  const handleAddCustomAdditionalFeature = () => {
    if (
      newCustomAdditionalFeature.trim() &&
      !formData.custom_additional_features.includes(
        newCustomAdditionalFeature.trim()
      )
    ) {
      setFormData((prev) => ({
        ...prev,
        custom_additional_features: [
          ...prev.custom_additional_features,
          newCustomAdditionalFeature.trim(),
        ],
      }));
      setNewCustomAdditionalFeature("");
    }
  };

  const handleRemoveCustomAdditionalFeature = (feature) => {
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
      setErrors((prev) => ({ ...prev, image_upload: "" }));
    } else {
      setImage(null);
      setImagePreview("");
      setErrors((prev) => ({
        ...prev,
        image_upload: "Please upload a valid image (JPEG, JPG, PNG)",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Enhanced Vehicle Number Validation
    if (!formData.vehicle_number) {
      newErrors.vehicle_number = "Vehicle number is required";
    } else {
      const vehicleNumberRegex = /^(([0-9]{1,3}|[A-Z]{2,3})-([0-9]{4}))$/;

      if (!vehicleNumberRegex.test(formData.vehicle_number)) {
        newErrors.vehicle_number =
          "Format must be XXX-XXXX or XX-XXXX (e.g., 123-4567 or AB-3456)";
      } else {
        const [firstPart] = formData.vehicle_number.split("-");

        // If first part is numeric, check it's between 0-256
        if (/^[0-9]+$/.test(firstPart)) {
          const num = parseInt(firstPart, 10);
          if (num < 0 || num > 256) {
            newErrors.vehicle_number = "Numeric part must be between 0-256";
          }
        }
      }
    }


    if (!formData.vehicle_type) {
      newErrors.vehicle_type = "Vehicle type is required";
    }

    if (!formData.brand) {
      newErrors.brand = "Brand is required";
    }

    if (!formData.year_of_manufacture) {
      newErrors.year_of_manufacture = "Year of manufacture is required";
    } else if (
      isNaN(formData.year_of_manufacture) ||
      Number(formData.year_of_manufacture) < 1900 ||
      Number(formData.year_of_manufacture) > new Date().getFullYear()
    ) {
      newErrors.year_of_manufacture = "Please enter a valid year";
    }

    if (!formData.seating_capacity) {
      newErrors.seating_capacity = "Seating capacity is required";
    } else if (
      isNaN(formData.seating_capacity) ||
      Number(formData.seating_capacity) <= 0
    ) {
      newErrors.seating_capacity = "Seating capacity must be a positive number";
    }

    if (!formData.fuel_type) {
      newErrors.fuel_type = "Fuel type is required";
    }

    if (!formData.transmission_type) {
      newErrors.transmission_type = "Transmission type is required";
    }

    if (!formData.daily_rate) {
      newErrors.daily_rate = "Daily rate is required";
    } else if (
      isNaN(formData.daily_rate) ||
      Number(formData.daily_rate) < 0 ||
      Number(formData.daily_rate) > 350
    ) {
      newErrors.daily_rate = "Daily rate must be between $0 and $350";
    }

    if (!image) {
      newErrors.image_upload = "Vehicle image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setMessage("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

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

      await vehicleService.createVehicle(data);
      setMessage("Vehicle created successfully!");
      setTimeout(() => navigate("/vehicle-table"), 1500);
    } catch (error) {
      console.error("Error creating vehicle:", error);
      setMessage(
        error.response?.data?.message ||
          "Error creating vehicle. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 px-6 py-4 border-b">
            <h2 className="text-2xl font-bold text-white">Add New Vehicle</h2>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`px-6 py-4 ${
                message.includes("Error")
                  ? "bg-red-50 text-red-700"
                  : "bg-green-50 text-green-700"
              }`}
            >
              {message}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Vehicle Number */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Vehicle Number* (Format: XXX-XXXX or XX-XXXX)
                </label>
                <input
                  type="text"
                  name="vehicle_number"
                  value={formData.vehicle_number}
                  onChange={handleChange}
                  placeholder="E.g., 123-4567 or AB-3456"
                  className={`block w-full px-3 py-2 border ${
                    errors.vehicle_number ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  required
                />
                {errors.vehicle_number && (
                  <p className="text-sm text-red-600">
                    {errors.vehicle_number}
                  </p>
                )}
              </div>

              {/* Vehicle Type */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Vehicle Type*
                </label>
                <select
                  name="vehicle_type"
                  value={formData.vehicle_type}
                  onChange={handleChange}
                  className={`block w-full px-3 py-2 border ${
                    errors.vehicle_type ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Scooty">Scooty</option>
                  <option value="CT100">CT100</option>
                  <option value="Car">Car</option>
                  <option value="Van">Van</option>
                </select>
                {errors.vehicle_type && (
                  <p className="text-sm text-red-600">{errors.vehicle_type}</p>
                )}
              </div>

              {/* Brand */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Brand*
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="Enter Brand"
                  className={`block w-full px-3 py-2 border ${
                    errors.brand ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  required
                />
                {errors.brand && (
                  <p className="text-sm text-red-600">{errors.brand}</p>
                )}
              </div>

              {/* Year of Manufacture */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Year of Manufacture*
                </label>
                <input
                  type="number"
                  name="year_of_manufacture"
                  value={formData.year_of_manufacture}
                  onChange={handleChange}
                  placeholder="Enter Year"
                  min="1900"
                  max={new Date().getFullYear()}
                  className={`block w-full px-3 py-2 border ${
                    errors.year_of_manufacture
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  required
                />
                {errors.year_of_manufacture && (
                  <p className="text-sm text-red-600">
                    {errors.year_of_manufacture}
                  </p>
                )}
              </div>

              {/* Seating Capacity */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Seating Capacity*
                </label>
                <input
                  type="number"
                  name="seating_capacity"
                  value={formData.seating_capacity}
                  onChange={handleChange}
                  placeholder="Enter Seating Capacity"
                  min="1"
                  className={`block w-full px-3 py-2 border ${
                    errors.seating_capacity
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  required
                />
                {errors.seating_capacity && (
                  <p className="text-sm text-red-600">
                    {errors.seating_capacity}
                  </p>
                )}
              </div>

              {/* Fuel Type */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Fuel Type*
                </label>
                <select
                  name="fuel_type"
                  value={formData.fuel_type}
                  onChange={handleChange}
                  className={`block w-full px-3 py-2 border ${
                    errors.fuel_type ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  required
                >
                  <option value="">Select Fuel Type</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
                {errors.fuel_type && (
                  <p className="text-sm text-red-600">{errors.fuel_type}</p>
                )}
              </div>

              {/* Transmission Type */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Transmission Type*
                </label>
                <select
                  name="transmission_type"
                  value={formData.transmission_type}
                  onChange={handleChange}
                  className={`block w-full px-3 py-2 border ${
                    errors.transmission_type
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  required
                >
                  <option value="">Select Transmission</option>
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
                {errors.transmission_type && (
                  <p className="text-sm text-red-600">
                    {errors.transmission_type}
                  </p>
                )}
              </div>

              {/* Daily Rate */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Daily Rate ($0-$350)*
                </label>
                <input
                  type="number"
                  name="daily_rate"
                  value={formData.daily_rate}
                  onChange={handleChange}
                  placeholder="Enter Daily Rate"
                  min="0"
                  max="350"
                  className={`block w-full px-3 py-2 border ${
                    errors.daily_rate ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  required
                />
                {errors.daily_rate && (
                  <p className="text-sm text-red-600">{errors.daily_rate}</p>
                )}
              </div>

              {/* Additional Features */}
              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Additional Features
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="air_conditioning"
                      checked={formData.additional_features.air_conditioning}
                      onChange={() =>
                        handleCheckboxChange(
                          "additional_features",
                          "air_conditioning"
                        )
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="air_conditioning"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Air Conditioning
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="navigation_system"
                      checked={formData.additional_features.navigation_system}
                      onChange={() =>
                        handleCheckboxChange(
                          "additional_features",
                          "navigation_system"
                        )
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="navigation_system"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Navigation System
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="bluetooth"
                      checked={formData.additional_features.bluetooth}
                      onChange={() =>
                        handleCheckboxChange("additional_features", "bluetooth")
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="bluetooth"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Bluetooth
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="sunroof"
                      checked={formData.additional_features.sunroof}
                      onChange={() =>
                        handleCheckboxChange("additional_features", "sunroof")
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="sunroof"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Sunroof
                    </label>
                  </div>
                </div>

                {/* Custom Additional Features */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Custom Additional Features
                  </label>
                  <div className="flex mt-1">
                    <input
                      type="text"
                      value={newCustomAdditionalFeature}
                      onChange={(e) =>
                        setNewCustomAdditionalFeature(e.target.value)
                      }
                      placeholder="Enter custom feature"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomAdditionalFeature}
                      className="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Add
                    </button>
                  </div>
                  {formData.custom_additional_features.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.custom_additional_features.map(
                        (feature, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {feature}
                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveCustomAdditionalFeature(feature)
                              }
                              className="ml-1.5 inline-flex text-blue-400 hover:text-blue-600 focus:outline-none"
                            >
                              ×
                            </button>
                          </span>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Safety Features */}
              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Safety Features
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="abs"
                      checked={formData.safety_features.abs}
                      onChange={() =>
                        handleCheckboxChange("safety_features", "abs")
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="abs"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      ABS
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="airbags"
                      checked={formData.safety_features.airbags}
                      onChange={() =>
                        handleCheckboxChange("safety_features", "airbags")
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="airbags"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Airbags
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="parking_sensors"
                      checked={formData.safety_features.parking_sensors}
                      onChange={() =>
                        handleCheckboxChange(
                          "safety_features",
                          "parking_sensors"
                        )
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="parking_sensors"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Parking Sensors
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="stability_control"
                      checked={formData.safety_features.stability_control}
                      onChange={() =>
                        handleCheckboxChange(
                          "safety_features",
                          "stability_control"
                        )
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="stability_control"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Stability Control
                    </label>
                  </div>
                </div>

                {/* Custom Safety Features */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Custom Safety Features
                  </label>
                  <div className="flex mt-1">
                    <input
                      type="text"
                      value={newCustomSafetyFeature}
                      onChange={(e) =>
                        setNewCustomSafetyFeature(e.target.value)
                      }
                      placeholder="Enter custom safety feature"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomSafetyFeature}
                      className="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Add
                    </button>
                  </div>
                  {formData.custom_safety_features.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
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
                            className="ml-1.5 inline-flex text-green-400 hover:text-green-600 focus:outline-none"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Image Upload */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Vehicle Image*
                </label>
                <input
                  type="file"
                  name="image_upload"
                  onChange={handleImageChange}
                  accept="image/jpeg,image/jpg,image/png"
                  className={`mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${
                    errors.image_upload ? "border-red-500" : ""
                  }`}
                  required
                />
                {imagePreview && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      Selected Image Preview:
                    </p>
                    <img
                      src={imagePreview}
                      alt="Vehicle Preview"
                      className="h-20 w-20 object-cover rounded"
                      onError={(e) => {
                        e.target.src = "../../../assets/1.png";
                      }}
                    />
                  </div>
                )}
                {image && !imagePreview && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected: {image.name}
                  </p>
                )}
                {errors.image_upload && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.image_upload}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transition duration-300 ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    Creating...
                  </span>
                ) : (
                  "Create Vehicle"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateVehicle;
