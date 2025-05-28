import React, { useState, useEffect, useCallback } from 'react';
import { packageService } from '../../../services/packageService';
import { Link } from 'react-router-dom';
import EditPackage from '../updatePackage/updatePackage';
import DeletePackage from '../deletePackage/deletePackage';
import ViewPackage from '../viewpackage/viewPackage';

const PackageList = () => {
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editOpen, setEditModalOpen] = useState(false);
  const [deleteOpen, setDeleteModalOpen] = useState(false);
  const [viewOpen, setViewModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('package_id'); // Default search by ID

  const fetchPackages = useCallback(async () => {
    try {
      const data = await packageService.getAllPackages();
      setPackages(Array.isArray(data) ? data : []);
      setFilteredPackages(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Error fetching packages');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  // Search functionality
  useEffect(() => {
    const filtered = packages.filter(pkg => {
      switch(searchField) {
        case 'package_id':
          return pkg.package_id.toString().includes(searchTerm.toLowerCase());
        case 'package_type':
          return pkg.package_type.toLowerCase().includes(searchTerm.toLowerCase());
        case 'price_per_day':
          return pkg.price_per_day.toString().includes(searchTerm);
        default:
          return true;
      }
    });
    setFilteredPackages(filtered);
  }, [searchTerm, searchField, packages]);

  const openEditModal = (pkg) => {
    setSelectedPackage(pkg);
    setEditModalOpen(true);
  };

  const openDeleteModal = (pkg) => {
    setSelectedPackage(pkg);
    setDeleteModalOpen(true);
  };

  const openViewModal = (pkg) => {
    setSelectedPackage(pkg);
    setViewModalOpen(true);
  };

  const handleEditSuccess = (updatedPackage) => {
    setPackages(prevPackages =>
      prevPackages.map(pkg =>
        pkg._id === updatedPackage._id ? updatedPackage : pkg
      )
    );
    setEditModalOpen(false);
    setSelectedPackage(null);
  };

  const handleDeleteSuccess = () => {
    setPackages(prevPackages =>
      prevPackages.filter(pkg => pkg._id !== selectedPackage._id)
    );
    setDeleteModalOpen(false);
    setSelectedPackage(null);
  };

  const renderFeatures = (features, customFeatures = [], featureType = 'additional') => {
    const featuresObj = typeof features === 'string' 
      ? JSON.parse(features) 
      : features || {};
    
    const processedCustomFeatures = Array.isArray(customFeatures) 
      ? customFeatures.filter(Boolean) 
      : [];

    if (Object.keys(featuresObj).length === 0 && processedCustomFeatures.length === 0) {
      return <span className="text-gray-400 text-sm">None</span>;
    }

    const colorClass = featureType === 'additional' ? 'text-blue-600' : 'text-green-600';
    const bgClass = featureType === 'additional' ? 'bg-blue-50' : 'bg-green-50';

    return (
      <div className="space-y-1 max-w-xs">
        {Object.entries(featuresObj)
          .filter(([_, value]) => value)
          .map(([key]) => (
            <div 
              key={key} 
              className={`flex items-center px-2 py-1 rounded-md ${bgClass}`}
            >
              <span className={`w-2 h-2 rounded-full ${colorClass} mr-2`}></span>
              <span className="capitalize text-sm text-gray-700 truncate">
                {key.replace(/_/g, ' ')}
              </span>
            </div>
          ))}
        
        {processedCustomFeatures.map((feat, index) => (
          <div 
            key={`custom-${index}`} 
            className="flex items-center px-2 py-1 rounded-md bg-purple-50 mt-1"
          >
            <span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
            <span className="text-sm text-purple-700 truncate">
              {feat}
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
        Package List
      </h2>

     
      <div className="flex flex-col sm:flex-row justify-between items-center mt-15 mb-8 gap-30">
        <div className="flex-1 w-full sm:w-auto">
          <div className="flex rounded-md shadow-sm">
            <select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              className="inline-flex items-center py-3 px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm"
            >
              <option value="package_id">By ID</option>
              <option value="package_type">By Type</option>
              <option value="price_per_day">By Price</option>
            </select>
            <input
              type="text"
              id="search"
              placeholder={`Search by ${searchField.replace('_', ' ')}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSearchField('package_id');
                }}
                className="ml-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-5 rounded-md shadow-sm transition duration-300"
              >
                Clear
              </button>
            )}
          </div>
        </div>
        
        <Link to="/create-package" className="w-full sm:w-auto">
          <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 px-20 rounded-lg shadow-md hover:from-green-600 hover:to-green-700 transition duration-300">
            + Add New Package
          </button>
        </Link>
      </div>

      {filteredPackages.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">
            {searchTerm ? 'No packages match your search criteria' : 'No packages found'}
          </p>
        </div>
      ) : (
        <div className="shadow-lg rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <colgroup>
                <col className="w-32" />
                <col className="w-48" />
                <col className="w-32" />
                <col className="w-24" />
                <col className="w-20" />
                <col className="w-20" />
                <col className="w-20" />
                <col className="w-60" />
                <col className="w-60" />
               {/* <col className="w-32" />*/}
                <col className="w-32" />
              </colgroup>
              <thead className="bg-gradient-to-r from-gray-800 to-gray-700 text-white">
                <tr>
                  <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider">Package ID</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider">Package Name</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider">Package Type</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider">Duration</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider">Price per Day</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider">Seat capacity</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider">Luggage capacity</th>
                  <th className="py-4 px-12 text-left text-sm font-semibold uppercase tracking-wider">Additional Features</th>
                  <th className="py-4 px-8 text-left text-sm font-semibold uppercase tracking-wider">Security Features</th>
                { /* <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider">Image</th>*/}
                  <th className="py-4 px-6 text-left text-sm font-semibold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPackages.map((pkg) => (
                  <tr key={pkg._id} className="hover:bg-gray-50 transition duration-200">
                    <td className="py-4 px-6 text-gray-900 font-medium">{pkg.package_id}</td>
                    <td className="py-4 px-6 text-gray-700">{pkg.package_name}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        pkg.package_type === 'Luxury' 
                          ? 'bg-purple-100 text-purple-800' 
                          : pkg.package_type === 'Premium'
                            ? 'bg-blue-100 text-blue-800'
                          : pkg.package_type === 'VIP'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                            
                      }`}>
                        {pkg.package_type}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-700">
                      {Array.isArray(pkg.duration) ? pkg.duration[0] : pkg.duration}
                    </td>
                    <td className="py-4 px-6 text-gray-700">${pkg.price_per_day}</td>
                    <td className="py-4 px-6 text-gray-700">{pkg.seating_capacity}</td>
                    <td className="py-4 px-6 text-gray-700">{pkg.luggage_capacity}</td>
                    <td className="py-4 px-6">
                      {renderFeatures(
                        pkg.additional_features, 
                        pkg.custom_additional_features,
                        'additional'
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {renderFeatures(
                        pkg.safety_security_features,
                        pkg.custom_safety_security_features,
                        'security'
                      )}
                    </td>
                   {/* <td className="py-4 px-6">
                      {pkg.image_upload ? (
                        <div className="flex justify-center items-center h-32 w-32">
                          <img
                            src={`http://localhost:3000/${pkg.image_upload}`}
                            alt={`${pkg.package_name} thumbnail`}
                            className="max-h-full max-w-full object-contain rounded-md shadow-sm border border-gray-200"
                            onError={(e) => {
                              e.target.src = '../../../assets/1.png';
                              e.target.onerror = null;
                            }}
                          />
                        </div>
                      ) : (
                        <span className="text-gray-400">No image</span>
                      )}
                    </td>*/}
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openViewModal(pkg)}
                          className="text-green-600 hover:text-green-800 font-medium transition duration-200"
                          title="View"
                        >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        </button>
                        <button
                        onClick={() => {
                          setSelectedPackage(pkg);
                          setEditModalOpen(true);
                        }}
                        className="text-yellow-600 hover:text-yellow-900"
                        title="Edit"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPackage(pkg);
                          setDeleteModalOpen(true);
                        }}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedPackage && (
        <EditPackage
          isOpen={editOpen}
          onClose={() => setEditModalOpen(false)}
          pkg={selectedPackage}
          onSuccess={handleEditSuccess}
        />
      )}

      {selectedPackage && (
        <DeletePackage
          isOpen={deleteOpen}
          onClose={() => setDeleteModalOpen(false)}
          pkg={selectedPackage}
          onSuccess={handleDeleteSuccess}
        />
      )}

      {selectedPackage && (
        <ViewPackage
          isOpen={viewOpen}
          onClose={() => setViewModalOpen(false)}
          pkg={selectedPackage}
        />
      )}
    </div>
  );
};

export default React.memo(PackageList);