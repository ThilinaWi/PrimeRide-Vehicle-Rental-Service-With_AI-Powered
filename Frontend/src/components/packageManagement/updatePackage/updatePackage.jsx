import React, { useState, useEffect } from "react";
import { packageService } from '../../../services/packageService';

const UpdatePackage = ({ isOpen, onClose, pkg, onSuccess }) => {
    const [formData, setFormData] = useState({
        package_id: '',
        package_name: '',
        package_type: '',
        price_per_day: '',
        duration: '',
        description: '',
        vehicle_model: '',
        vehicle_number:'',
        seating_capacity: '',
        luggage_capacity: '',
        additional_features: {},
        safety_security_features: {}
    });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [newAdditionalFeature, setNewAdditionalFeature] = useState('');
    const [newSafetyFeature, setNewSafetyFeature] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (pkg) {
            setFormData({
                package_id: pkg.package_id || '',
                package_name: pkg.package_name || '',
                package_type: pkg.package_type || '',
                price_per_day: pkg.price_per_day || '',
                duration: pkg.duration || '',
                description: pkg.description || '',
                vehicle_model: pkg.vehicle_model || '',
                vehicle_number:pkg.vehicle_number ||'',
                seating_capacity: pkg.seating_capacity || '',
                luggage_capacity: pkg.luggage_capacity || '',
                additional_features: pkg.additional_features || {},
                safety_security_features: pkg.safety_security_features || {}
            });
            setImage(null);
            setImagePreview(
                pkg.image_upload
                    ? `http://localhost:3000/${pkg.image_upload}`
                    : ""
            );
        }
    }, [pkg]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "package_id" && value && (isNaN(value) || value < 0)) return;

        setFormData({ ...formData, [name]: value });

        if (fieldErrors[name]) {
            setFieldErrors((prev) => ({ ...prev, [name]: "" }));
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
        if (file && ["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
            setFieldErrors((prev) => ({ ...prev, image_upload: "" }));
        } else {
            setImage(null);
            setImagePreview(
                pkg.image_upload
                    ? `http://localhost:3000/${pkg.image_upload}`
                    : ""
            );
            setFieldErrors((prev) => ({
                ...prev,
                image_upload: "Please upload a valid image (JPEG, JPG, PNG)",
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.package_id) {
            newErrors.package_id = 'Package ID is required';
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
        if (!formData.vehicle_number) {
            newErrors.vehicle_number = 'Vehicle number is required';
        } else if (!/^[a-zA-Z0-9-]+$/.test(formData.vehicle_number)) {
            newErrors.vehicle_number = 'Number can only contain letters, numbers, and hyphens';
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

        setFieldErrors(newErrors);
        return Object.keys(newErrors).length === 0;
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
            const formDataToSend = new FormData();
            
            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'additional_features' || key === 'safety_security_features') {
                    formDataToSend.append(key, JSON.stringify(value));
                } else {
                    formDataToSend.append(key, value);
                }
            });
            
            if (image) {
                formDataToSend.append('image_upload', image);
            }

            const response = await packageService.updatePackage(pkg._id, formDataToSend);
            const updatedPackage = {
                ...pkg,
                ...formData,
                image_upload: image ? image.name : pkg.image_upload,
            };
            onSuccess(updatedPackage);
            onClose();
        } catch (err) {
            setError(err.message || "Error updating package");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

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

    const featureIcons = {
        professional_driver: '',
        floral_decorations: '',
        unlimited_mileage: '',
        luxury_vehicle: '',
        gps_tracking: '',
        roadside_assistance: '',
        traction_control: '',
        anti_lock_braking_system: '',
        default: ''
    };

    return (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out">
                {/* Modal Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 z-10 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-white">Update Package</h2>
                        <p className="text-blue-100 text-sm">{pkg?.package_name || 'Package Details'}</p>
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
                <div className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Package ID */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Package ID <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="package_id"
                                    value={formData.package_id}
                                    onChange={handleChange}
                                    className={`block w-full px-3 py-2 border ${fieldErrors.package_id ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                    required
                                />
                                {fieldErrors.package_id && (
                                    <p className="mt-1 text-sm text-red-600">{fieldErrors.package_id}</p>
                                )}
                            </div>

                            {/* Package Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Package Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="package_name"
                                    value={formData.package_name}
                                    onChange={handleChange}
                                    className={`block w-full px-3 py-2 border ${fieldErrors.package_name ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                    required
                                />
                                {fieldErrors.package_name && (
                                    <p className="mt-1 text-sm text-red-600">{fieldErrors.package_name}</p>
                                )}
                            </div>

                            {/* Package Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Package Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="package_type"
                                    value={formData.package_type}
                                    onChange={handleChange}
                                    className={`block w-full px-3 py-2 border ${fieldErrors.package_type ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                    required
                                >
                                    <option value="">Select Package Type</option>
                                    <option value="Standard">Standard</option>
                                    <option value="Premium">Premium</option>
                                    <option value="Luxury">Luxury</option>
                                    <option value="VIP">VIP</option>
                                </select>
                                {fieldErrors.package_type && (
                                    <p className="mt-1 text-sm text-red-600">{fieldErrors.package_type}</p>
                                )}
                            </div>

                            {/* Price per Day */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Price per Day <span className="text-red-500">*</span>
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">$</span>
                                    </div>
                                    <input
                                        type="number"
                                        name="price_per_day"
                                        value={formData.price_per_day}
                                        onChange={handleChange}
                                        className={`block w-full pl-7 pr-12 py-2 border ${fieldErrors.price_per_day ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                        required
                                    />
                                </div>
                                {fieldErrors.price_per_day && (
                                    <p className="mt-1 text-sm text-red-600">{fieldErrors.price_per_day}</p>
                                )}
                            </div>

                            {/* Duration */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Duration (Days) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    className={`block w-full px-3 py-2 border ${fieldErrors.duration ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                    required
                                />
                                {fieldErrors.duration && (
                                    <p className="mt-1 text-sm text-red-600">{fieldErrors.duration}</p>
                                )}
                            </div>

                            {/* Vehicle Model */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Vehicle Model <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="vehicle_model"
                                    value={formData.vehicle_model}
                                    onChange={handleChange}
                                    className={`block w-full px-3 py-2 border ${fieldErrors.vehicle_model ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                    required
                                />
                                {fieldErrors.vehicle_model && (
                                    <p className="mt-1 text-sm text-red-600">{fieldErrors.vehicle_model}</p>
                                )}
                            </div>

                            {/* Seating Capacity */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Seating Capacity <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="seating_capacity"
                                    value={formData.seating_capacity}
                                    onChange={handleChange}
                                    className={`block w-full px-3 py-2 border ${fieldErrors.seating_capacity ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                    required
                                />
                                {fieldErrors.seating_capacity && (
                                    <p className="mt-1 text-sm text-red-600">{fieldErrors.seating_capacity}</p>
                                )}
                            </div>

                            {/* Luggage Capacity */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Luggage Capacity <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="luggage_capacity"
                                    value={formData.luggage_capacity}
                                    onChange={handleChange}
                                    className={`block w-full px-3 py-2 border ${fieldErrors.luggage_capacity ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                    required
                                />
                                {fieldErrors.luggage_capacity && (
                                    <p className="mt-1 text-sm text-red-600">{fieldErrors.luggage_capacity}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={3}
                                    className={`block w-full px-3 py-2 border ${fieldErrors.description ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                    required
                                />
                                {fieldErrors.description && (
                                    <p className="mt-1 text-sm text-red-600">{fieldErrors.description}</p>
                                )}
                            </div>

                            {/* Additional Features */}
                            <div className="md:col-span-2">
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                                        Additional Features
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3">
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
                                                        {featureIcons[key] || featureIcons.default} {formatFeatureName(key)}
                                                    </label>
                                                </div>
                                                {!protectedAdditionalFeatures.includes(key) && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveFeature('additional_features', key)}
                                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Add New Additional Feature */}
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Add New Additional Feature
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newAdditionalFeature}
                                                onChange={(e) => setNewAdditionalFeature(e.target.value)}
                                                placeholder="Enter feature name"
                                                className="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddAdditionalFeature}
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Safety & Security Features */}
                            <div className="md:col-span-2">
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                                        Safety & Security Features
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3">
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
                                                        {featureIcons[key] || featureIcons.default} {formatFeatureName(key)}
                                                    </label>
                                                </div>
                                                {!protectedSafetyFeatures.includes(key) && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveFeature('safety_security_features', key)}
                                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Add New Safety Feature */}
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Add New Safety Feature
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newSafetyFeature}
                                                onChange={(e) => setNewSafetyFeature(e.target.value)}
                                                placeholder="Enter safety feature"
                                                className="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddSafetyFeature}
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
                                    Package Image
                                </label>
                                <div className="flex flex-col sm:flex-row gap-6">
                                    {imagePreview && (
                                        <div className="flex-shrink-0">
                                            <p className="text-sm text-gray-600 mb-1">Current Image:</p>
                                            <div className="relative w-50 h-25 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                                <img
                                                    src={imagePreview}
                                                    alt="Package Preview"
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = "https://via.placeholder.com/400?text=No+Image";
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                            <div className="space-y-1 text-center">
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
                                                <div className="flex text-sm text-gray-600">
                                                    <label
                                                        htmlFor="file-upload"
                                                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                                                    >
                                                        <span>Upload a file</span>
                                                        <input
                                                            id="file-upload"
                                                            name="image_upload"
                                                            type="file"
                                                            onChange={handleImageChange}
                                                            accept="image/jpeg,image/jpg,image/png"
                                                            className="sr-only"
                                                        />
                                                    </label>
                                                    <p className="pl-1">or drag and drop</p>
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    PNG, JPG, JPEG up to 5MB
                                                </p>
                                            </div>
                                        </div>
                                        {fieldErrors.image_upload && (
                                            <p className="mt-1 text-sm text-red-600">{fieldErrors.image_upload}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Updating...
                                    </>
                                ) : 'Update Package'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdatePackage;