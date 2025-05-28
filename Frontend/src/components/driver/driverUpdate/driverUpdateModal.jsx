import React, { useState, useEffect } from "react";
import * as driverService from "../../../services/driverSrvice";

const DriverUpdateModal = ({ isOpen, onClose, driver, onSuccess }) => {
  const [formData, setFormData] = useState({
    driver_id: "",
    full_name: "",
    contact_number: "",
    email: "",
    license_number: "",
    license_class: "light",
    date_of_birth: "",
    year_of_experience: "",
    availability_status: "available",
    address: "",
    emergency_contact: "",
    driver_qualifications: {
      defensive_driving: false,
      first_aid: false,
      heavy_vehicle: false,
      passenger_endorsement: false,
    },
    custom_qualifications: [],
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [newCustomQualification, setNewCustomQualification] = useState("");

  useEffect(() => {
    if (driver) {
      setFormData({
        driver_id: driver.driver_id || "",
        full_name: driver.full_name || "",
        contact_number: driver.contact_number || "",
        email: driver.email || "",
        license_number: driver.license_number || "",
        license_class: driver.license_class || "light",
        date_of_birth: driver.date_of_birth || "",
        year_of_experience: driver.year_of_experience || "",
        availability_status: driver.availability_status || "available",
        address: driver.address || "",
        emergency_contact: driver.emergency_contact || "",
        driver_qualifications: driver.driver_qualifications || {
          defensive_driving: false,
          first_aid: false,
          heavy_vehicle: false,
          passenger_endorsement: false,
        },
        custom_qualifications: driver.custom_qualifications || [],
      });
      setImagePreview(
        driver.image_upload
          ? `http://localhost:3000/${driver.image_upload}`
          : ""
      );
    }
  }, [driver]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Input-specific filtering
    if (name === "driver_id" && value && (isNaN(value) || value < 0)) return;
    if (name === "full_name" && value && !/^[a-zA-Z\s]*$/.test(value)) return;
    if (name === "contact_number" && value && !/^[0-9]*$/.test(value)) return;
    if (name === "license_number" && value && !/^[a-zA-Z0-9]*$/.test(value))
      return;
    if (name === "year_of_experience" && value && !/^[0-9]*$/.test(value))
      return;

    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCheckboxChange = (featureName) => {
    setFormData((prev) => ({
      ...prev,
      driver_qualifications: {
        ...prev.driver_qualifications,
        [featureName]: !prev.driver_qualifications[featureName],
      },
    }));
  };

  const handleAddCustomQualification = () => {
    if (
      newCustomQualification.trim() &&
      !formData.custom_qualifications.includes(newCustomQualification.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        custom_qualifications: [
          ...prev.custom_qualifications,
          newCustomQualification.trim(),
        ],
      }));
      setNewCustomQualification("");
    }
  };

  const handleRemoveCustomQualification = (qualification) => {
    setFormData((prev) => ({
      ...prev,
      custom_qualifications: prev.custom_qualifications.filter(
        (q) => q !== qualification
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
      setErrors((prev) => ({
        ...prev,
        image_upload: "Please upload a valid image (JPEG, JPG, PNG)",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.driver_id) {
      newErrors.driver_id = "Driver ID is required";
    } else if (isNaN(formData.driver_id) || Number(formData.driver_id) < 0) {
      newErrors.driver_id = "Driver ID cannot be a negative number";
    }

    if (!formData.full_name) {
      newErrors.full_name = "Full name is required";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.full_name)) {
      newErrors.full_name = "Full name can only contain letters";
    }

    if (!formData.contact_number) {
      newErrors.contact_number = "Contact number is required";
    } else if (!/^0[1-9][0-9]{8}$/.test(formData.contact_number)) {
      newErrors.contact_number =
        "Contact number must be 10 digits starting with 0 and followed by a non-zero digit";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.license_number) {
      newErrors.license_number = "License number is required";
    } else if (
      !/^[a-zA-Z0-9]{7}$|^[a-zA-Z0-9]{12}$/.test(formData.license_number)
    ) {
      newErrors.license_number =
        "License number must be exactly 7 or 12 alphanumeric characters";
    }

    if (!formData.license_class) {
      newErrors.license_class = "License class is required";
    }

    if (!formData.date_of_birth) {
      newErrors.date_of_birth = "Date of birth is required";
    } else {
      const dob = new Date(formData.date_of_birth);
      const today = new Date();
      const minAgeDate = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate()
      );

      if (dob > minAgeDate) {
        newErrors.date_of_birth = "Driver must be at least 18 years old";
      }
    }

    if (!formData.year_of_experience) {
      newErrors.year_of_experience = "Years of experience is required";
    } else {
      const years = parseInt(formData.year_of_experience);
      if (isNaN(years) || years < 0 || years >= 80) {
        newErrors.year_of_experience =
          "Years of experience must be a number between 0 and 79";
      }
    }

    if (!formData.address) {
      newErrors.address = "Address is required";
    }

    if (!formData.emergency_contact) {
      newErrors.emergency_contact = "Emergency contact is required";
    } else if (!/^0[1-9][0-9]{8}$/.test(formData.emergency_contact)) {
      newErrors.emergency_contact =
        "Emergency contact must be 10 digits starting with 0 and followed by a non-zero digit";
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
        if (key === "driver_qualifications") {
          data.append(key, JSON.stringify(formData[key]));
        } else if (key === "custom_qualifications") {
          data.append(key, JSON.stringify(formData[key]));
        } else {
          data.append(key, formData[key]);
        }
      }
      if (image) {
        data.append("image_upload", image);
      }

      await driverService.updateDriver(driver._id, data);
      setMessage("Driver updated successfully!");
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error updating driver:", error);
      setMessage(
        error.response?.data?.message ||
          "Error updating driver. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="bg-primeTeal px-6 py-4 border-b">
          <h2 className="text-2xl font-bold text-white">Update Driver</h2>
        </div>

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

        <form onSubmit={handleSubmit} className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Driver ID */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Driver ID*
              </label>
              <input
                type="number"
                name="driver_id"
                value={formData.driver_id}
                onChange={handleChange}
                className={`block w-full px-3 py-2 border ${
                  errors.driver_id ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                required
              />
              {errors.driver_id && (
                <p className="text-sm text-red-600">{errors.driver_id}</p>
              )}
            </div>

            {/* Full Name */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Full Name*
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className={`block w-full px-3 py-2 border ${
                  errors.full_name ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                required
              />
              {errors.full_name && (
                <p className="text-sm text-red-600">{errors.full_name}</p>
              )}
            </div>

            {/* Contact Number */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Contact Number* (Format: 0XXXXXXXXX)
              </label>
              <input
                type="text"
                name="contact_number"
                value={formData.contact_number}
                onChange={handleChange}
                maxLength={10}
                className={`block w-full px-3 py-2 border ${
                  errors.contact_number ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                required
              />
              {errors.contact_number && (
                <p className="text-sm text-red-600">{errors.contact_number}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Email*
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`block w-full px-3 py-2 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                required
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* License Number */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                License Number* (7 or 12 characters)
              </label>
              <input
                type="text"
                name="license_number"
                value={formData.license_number}
                onChange={handleChange}
                maxLength={12}
                className={`block w-full px-3 py-2 border ${
                  errors.license_number ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                required
              />
              {errors.license_number && (
                <p className="text-sm text-red-600">{errors.license_number}</p>
              )}
            </div>

            {/* License Class */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                License Class*
              </label>
              <select
                name="license_class"
                value={formData.license_class}
                onChange={handleChange}
                className={`block w-full px-3 py-2 border ${
                  errors.license_class ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                required
              >
                <option value="light">Light Vehicle</option>
                <option value="heavy">Heavy Vehicle</option>
                <option value="motorcycle">Motorcycle</option>
              </select>
              {errors.license_class && (
                <p className="text-sm text-red-600">{errors.license_class}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Date of Birth* (Must be 18+)
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                max={
                  new Date(
                    new Date().setFullYear(new Date().getFullYear() - 18)
                  )
                    .toISOString()
                    .split("T")[0]
                }
                className={`block w-full px-3 py-2 border ${
                  errors.date_of_birth ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                required
              />
              {errors.date_of_birth && (
                <p className="text-sm text-red-600">{errors.date_of_birth}</p>
              )}
            </div>

            {/* Years of Experience */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Years of Experience* (0-79)
              </label>
              <input
                type="number"
                name="year_of_experience"
                value={formData.year_of_experience}
                onChange={handleChange}
                min="0"
                max="79"
                className={`block w-full px-3 py-2 border ${
                  errors.year_of_experience
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                required
              />
              {errors.year_of_experience && (
                <p className="text-sm text-red-600">
                  {errors.year_of_experience}
                </p>
              )}
            </div>

            {/* Availability Status */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Availability Status*
              </label>
              <select
                name="availability_status"
                value={formData.availability_status}
                onChange={handleChange}
                className={`block w-full px-3 py-2 border ${
                  errors.availability_status
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                required
              >
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
              {errors.availability_status && (
                <p className="text-sm text-red-600">
                  {errors.availability_status}
                </p>
              )}
            </div>

            {/* Address */}
            <div className="md:col-span-2 space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Address*
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className={`block w-full px-3 py-2 border ${
                  errors.address ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                required
              />
              {errors.address && (
                <p className="text-sm text-red-600">{errors.address}</p>
              )}
            </div>

            {/* Emergency Contact */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Emergency Contact* (Format: 0XXXXXXXXX)
              </label>
              <input
                type="text"
                name="emergency_contact"
                value={formData.emergency_contact}
                onChange={handleChange}
                maxLength={10}
                className={`block w-full px-3 py-2 border ${
                  errors.emergency_contact
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                required
              />
              {errors.emergency_contact && (
                <p className="text-sm text-red-600">
                  {errors.emergency_contact}
                </p>
              )}
            </div>

            {/* Driver Qualifications */}
            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Driver Qualifications
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="defensive_driving"
                    checked={formData.driver_qualifications.defensive_driving}
                    onChange={() => handleCheckboxChange("defensive_driving")}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="defensive_driving"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Defensive Driving
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="first_aid"
                    checked={formData.driver_qualifications.first_aid}
                    onChange={() => handleCheckboxChange("first_aid")}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="first_aid"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    First Aid Certified
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="heavy_vehicle"
                    checked={formData.driver_qualifications.heavy_vehicle}
                    onChange={() => handleCheckboxChange("heavy_vehicle")}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="heavy_vehicle"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Heavy Vehicle
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="passenger_endorsement"
                    checked={
                      formData.driver_qualifications.passenger_endorsement
                    }
                    onChange={() =>
                      handleCheckboxChange("passenger_endorsement")
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="passenger_endorsement"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Passenger Endorsement
                  </label>
                </div>
              </div>

              {/* Custom Qualifications */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Custom Qualifications
                </label>
                <div className="flex mt-1">
                  <input
                    type="text"
                    value={newCustomQualification}
                    onChange={(e) => setNewCustomQualification(e.target.value)}
                    placeholder="Enter custom qualification"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomQualification}
                    className="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Add
                  </button>
                </div>
                {formData.custom_qualifications.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.custom_qualifications.map(
                      (qualification, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                        >
                          {qualification}
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveCustomQualification(qualification)
                            }
                            className="ml-1.5 inline-flex text-purple-400 hover:text-purple-600 focus:outline-none"
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

            {/* Image Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Driver Photo
              </label>
              <input
                type="file"
                name="image_upload"
                onChange={handleImageChange}
                accept="image/jpeg,image/jpg,image/png"
                className={`mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${
                  errors.image_upload ? "border-red-500" : ""
                }`}
              />
              {imagePreview && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    Selected Photo Preview:
                  </p>
                  <img
                    src={imagePreview}
                    alt="Driver Preview"
                    className="h-20 w-20 object-cover rounded"
                  />
                </div>
              )}
              {errors.image_upload && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.image_upload}
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${
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
                  Updating...
                </span>
              ) : (
                "Update Driver"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DriverUpdateModal;
