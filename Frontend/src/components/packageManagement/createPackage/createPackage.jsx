import React, { useState } from 'react';
import { packageService } from '../../../services/packageService';
import { useNavigate } from 'react-router-dom';

const CreatePackage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    package_id: '',
    package_name: '',
    package_type: '',
    price_per_day: '',
    duration: '',
    description: '',
    vehicle_model: '',
    vehicle_number: '',
    seating_capacity: '',
    luggage_capacity: '',
    additional_features: {
      professional_driver: false,
      floral_decorations: false,
      unlimited_mileage: false,
      luxury_vehicle: false,
    },
    safety_security_features: {
      gps_tracking: false,
      roadside_assistance: false,
      traction_control: false,
      anti_lock_braking_system: false,
    },
  });

  const [image, setImage] = useState(undefined);
  const [imagePreview, setImagePreview] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [newAdditionalFeature, setNewAdditionalFeature] = useState('');
  const [newSafetyFeature, setNewSafetyFeature] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'package_id' && value && (isNaN(value) || value < 0)) return;

    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (featureType, featureName) => {
    setFormData(prev => ({
      ...prev,
      [featureType]: {
        ...prev[featureType],
        [featureName]: !prev[featureType][featureName]
      }
    }));
  };

  const formatFeatureName = (key) => {
    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleAddAdditionalFeature = () => {
    const featureKey = newAdditionalFeature.trim().toLowerCase().replace(/\s+/g, '_');
    if (featureKey && !formData.additional_features.hasOwnProperty(featureKey)) {
      setFormData(prev => ({
        ...prev,
        additional_features: {
          ...prev.additional_features,
          [featureKey]: true
        }
      }));
      setNewAdditionalFeature('');
    }
  };

  const handleAddSafetyFeature = () => {
    const featureKey = newSafetyFeature.trim().toLowerCase().replace(/\s+/g, '_');
    if (featureKey && !formData.safety_security_features.hasOwnProperty(featureKey)) {
      setFormData(prev => ({
        ...prev,
        safety_security_features: {
          ...prev.safety_security_features,
          [featureKey]: true
        }
      }));
      setNewSafetyFeature('');
    }
  };

  const handleRemoveFeature = (featureType, featureKey) => {
    setFormData(prev => {
      const newFeatures = { ...prev[featureType] };
      delete newFeatures[featureKey];
      return {
        ...prev,
        [featureType]: newFeatures
      };
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, image_upload: '' }));
    } else {
      setImage(null);
      setImagePreview('');
      setErrors((prev) => ({ ...prev, image_upload: 'Please upload a valid image (JPEG, JPG, PNG)' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.package_id) {
      newErrors.package_id = "Package ID is required";
    } else if (isNaN(formData.package_id) || Number(formData.package_id) < 0) {
      newErrors.package_id = "Package ID cannot be a negative number";
    }

    if (!formData.package_name) {
      newErrors.package_name = "Package name is required";
    }

    if (!formData.package_type) {
      newErrors.package_type = "Package type is required";
    }

    if (!formData.price_per_day) {
      newErrors.price_per_day = 'Price per day is required';
    } else if (isNaN(formData.price_per_day) || Number(formData.price_per_day) <= 0) {
      newErrors.price_per_day = 'Price per day must be a valid number greater than 0';
    }

    if (!formData.duration) {
      newErrors.duration = 'Duration is required';
    }

    if (!formData.description) {
      newErrors.description = 'Description is required';
    }

    if (!formData.vehicle_model) {
      newErrors.vehicle_model = 'Vehicle model is required';
    } else if (!/^[a-zA-Z0-9-]+$/.test(formData.vehicle_model)) {
      newErrors.vehicle_model = 'Model can only contain letters, numbers, and hyphens';
    }

    if (!formData.seating_capacity) {
      newErrors.seating_capacity = 'Seating capacity is required';
    } else if (isNaN(formData.seating_capacity) || Number(formData.seating_capacity) <= 0) {
      newErrors.seating_capacity = 'Seating capacity must be a positive number';
    }

    if (!formData.luggage_capacity) {
      newErrors.luggage_capacity = 'Luggage capacity is required';
    } else if (isNaN(formData.luggage_capacity) || Number(formData.luggage_capacity) <= 0) {
      newErrors.luggage_capacity = 'Luggage capacity must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setMessage('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await packageService.createPackage(formData);
      setMessage(response.message || 'Package created successfully!');
      setFormData({
        package_id: '',
        package_name: '',
        package_type: '',
        price_per_day: '',
        duration: '',
        description: '',
        vehicle_model: '',
        vehicle_number: '',
        seating_capacity: '',
        luggage_capacity: '',
        additional_features: {
          professional_driver: false,
          floral_decorations: false,
          unlimited_mileage: false,
          luxury_vehicle: false,
        },
        safety_security_features: {
          gps_tracking: false,
          roadside_assistance: false,
          traction_control: false,
          anti_lock_braking_system: false,
        },
      });
      setImage(null);
      setImagePreview('');
      setErrors({});
      setTimeout(() => navigate('/package-table'), 1.5);
    } catch (error) {
      setMessage(error.message || 'Error creating package');
    } finally {
      setIsSubmitting(false);
    }
  };

  // List of protected features that shouldn't be removable
  const protectedAdditionalFeatures = [
    'professional_driver',
    'floral_decorations',
    'unlimited_mileage',
    'luxury_vehicle'
  ];

  const protectedSafetyFeatures = [
    'gps_tracking',
    'roadside_assistance',
    'traction_control',
    'anti_lock_braking_system'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 px-6 py-4 border-b ">
            <h2 className="text-2xl font-bold text-white">Add New Package</h2>
          </div>

          {/* Message */}
          {message && (
            <div className={`px-6 py-4 ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
              {message}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Package ID */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Package ID *</label>
                <input
                  type="number"
                  name="package_id"
                  value={formData.package_id || ''} 
                  onChange={handleChange}
                  placeholder="Enter Package ID"
                  className={`block w-full px-3 py-2 border ${errors.package_id ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  required
                />
                {errors.package_id && (
                  <p className="text-sm text-red-600">{errors.package_id}</p>
                )}
              </div>

              {/* Package Name */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Package Name *</label>
                <input
                  type="text"
                  name="package_name"
                  value={formData.package_name}
                  onChange={handleChange}
                  placeholder="Enter Package Name"
                  className={`block w-full px-3 py-2 border ${errors.package_name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  required
                />
                {errors.package_name && (
                  <p className="text-sm text-red-600">{errors.package_name}</p>
                )}
              </div>

              {/* Package Type */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Package Type *</label>
                <select
                  name="package_type"
                  value={formData.package_type}
                  onChange={handleChange}
                  className={`block w-full px-3 py-2 border ${errors.package_type ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  required
                >
                  <option value="">Select Package Type</option>
                  <option value="Standard">Standard</option>
                  <option value="Premium">Premium</option>
                  <option value="Luxury">Luxury</option>
                  <option value="VIP">VIP</option>
                </select>
                {errors.package_type && (
                  <p className="text-sm text-red-600">{errors.package_type}</p>
                )}
              </div>

              {/* Duration */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Duration *</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="Enter Duration in Days"
                  className={`block w-full px-3 py-2 border ${errors.duration ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  required
                />
                {errors.duration && (
                  <p className="text-sm text-red-600">{errors.duration}</p>
                )}
              </div>

              {/* Price per Day */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Price per Day *</label>
                <input
                  type="number"
                  name="price_per_day"
                  value={formData.price_per_day}
                  onChange={handleChange}
                  placeholder="Enter Price per Day"
                  className={`block w-full px-3 py-2 border ${errors.price_per_day ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  required
                />
                {errors.price_per_day && (
                  <p className="text-sm text-red-600">{errors.price_per_day}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter Package Description"
                  rows={3}
                  className={`block w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  required
                />
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              {/* Vehicle Model */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Vehicle Model *</label>
                <input
                  type="text"
                  name="vehicle_model"
                  value={formData.vehicle_model}
                  onChange={handleChange}
                  placeholder="Enter Vehicle Model"
                  className={`block w-full px-3 py-2 border ${errors.vehicle_model ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  required
                />
                {errors.vehicle_model && (
                  <p className="text-sm text-red-600">{errors.vehicle_model}</p>
                )}
              </div>
              
              {/* Vehicle Number */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Vehicle Number *</label>
                <input
                  type="text"
                  name="vehicle_number"
                  value={formData.vehicle_number}
                  onChange={handleChange}
                  placeholder="Enter Vehicle Number"
                  className={`block w-full px-3 py-2 border ${errors.vehicle_number ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  required
                />
                {errors.vehicle_number && (
                  <p className="text-sm text-red-600">{errors.vehicle_number}</p>
                )}
              </div>

              {/* Seating Capacity */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Seating Capacity *</label>
                <input
                  type="number"
                  name="seating_capacity"
                  value={formData.seating_capacity}
                  onChange={handleChange}
                  placeholder="Enter Seating Capacity"
                  className={`block w-full px-3 py-2 border ${errors.seating_capacity ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  required
                />
                {errors.seating_capacity && (
                  <p className="text-sm text-red-600">{errors.seating_capacity}</p>
                )}
              </div>

              {/* Luggage Capacity */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Luggage Capacity *</label>
                <input
                  type="number"
                  name="luggage_capacity"
                  value={formData.luggage_capacity}
                  onChange={handleChange}
                  placeholder="Enter Luggage Capacity"
                  className={`block w-full px-3 py-2 border ${errors.luggage_capacity ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  required
                />
                {errors.luggage_capacity && (
                  <p className="text-sm text-red-600">{errors.luggage_capacity}</p>
                )}
              </div>

              {/* Additional Features */}
              <div className="md:col-span-2 space-y-2">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <label className="block text-sm font-medium text-gray-700">Additional Features</label>
                <div className="grid mt-3  grid-cols-2 gap-2">
                  {Object.entries(formData.additional_features).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`add_${key}`}
                          checked={value}
                          onChange={() => handleCheckboxChange('additional_features', key)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`add_${key}`} className="ml-2 block text-sm text-gray-700">
                          {formatFeatureName(key)}
                        </label>
                      </div>
                      {!protectedAdditionalFeatures.includes(key) && (
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature('additional_features', key)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
             
                {/* Add New Additional Feature */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Add Additional Feature</label>
                  <div className="flex mt-1">
                    <input
                      type="text"
                      value={newAdditionalFeature}
                      onChange={(e) => setNewAdditionalFeature(e.target.value)}
                      placeholder="Enter new feature name"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddAdditionalFeature}
                      className="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
              </div>
              {/* Safety & Security Features */}
              <div className="md:col-span-2 space-y-2">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <label className="block text-sm font-medium text-gray-700">Safety & Security Features</label>
                <div className="grid mt-3 grid-cols-2 gap-2">
                  {Object.entries(formData.safety_security_features).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`safety_${key}`}
                          checked={value}
                          onChange={() => handleCheckboxChange('safety_security_features', key)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`safety_${key}`} className="ml-2 block text-sm text-gray-700">
                          {formatFeatureName(key)}
                        </label>
                      </div>
                      {!protectedSafetyFeatures.includes(key) && (
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature('safety_security_features', key)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add New Safety Feature */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Add Safety Feature</label>
                  <div className="flex mt-1">
                    <input
                      type="text"
                      value={newSafetyFeature}
                      onChange={(e) => setNewSafetyFeature(e.target.value)}
                      placeholder="Enter new safety feature"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddSafetyFeature}
                      className="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
              </div>
{/* Image Upload */}
<div className="md:col-span-2">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Package Image *
  </label>
  <div className="flex flex-col sm:flex-row gap-6">
    {/* Image Preview Section */}
    {imagePreview ? (
      <div className="flex-shrink-0">
        <p className="text-sm text-gray-600 mb-1">Preview:</p>
        <div className="relative w-40 h-40 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
          <img
            src={imagePreview}
            alt="Package Preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400?text=Image+Error";
              e.target.onerror = null; // Prevent infinite loop
            }}
          />
          <button
            type="button"
            onClick={() => setImagePreview(null)}
            className="absolute top-1 right-1 bg-white/80 hover:bg-white rounded-full p-1 shadow-sm"
            aria-label="Remove image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-600"
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
      </div>
    ) : null}

    {/* Upload Area */}
    <div className="flex-1">
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors duration-200">
        <div className="space-y-2 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          
          <div className="flex items-center justify-center text-sm text-gray-600">
            <label
              htmlFor="package-image-upload"
              className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500"
            >
              <span>Click to upload</span>
              <input
                id="package-image-upload"
                name="image_upload"
                type="file"
                onChange={handleImageChange}
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="sr-only"
                required
              />
            </label>
            <span className="pl-1">or drag and drop</span>
          </div>
          
          <p className="text-xs text-gray-500">
            PNG, JPG, JPEG up to 5MB
          </p>
          
          {image && !imagePreview && (
            <p className="text-sm text-gray-600 mt-2">
              Selected: <span className="font-medium">{image.name}</span>
            </p>
          )}
        </div>
      </div>
      
      {errors.image_upload && (
        <p className="mt-2 text-sm text-red-600 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {errors.image_upload}
        </p>
      )}
    </div>
  </div>
</div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transition duration-300 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
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
                  'Create Package'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePackage;