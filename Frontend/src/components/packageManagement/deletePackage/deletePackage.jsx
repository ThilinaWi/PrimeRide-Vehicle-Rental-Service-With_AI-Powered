import React, { useState } from 'react';
import { packageService } from '../../../services/packageService';

const DeletePackage = ({ isOpen, onClose, pkg, onSuccess }) => {
  const [error, setError] = useState('');

  const handleDeleteConfirm = async () => {
    try {
      await packageService.deletePackage(pkg._id);
      onSuccess(); // Notify parent of success
    } catch (err) {
      setError(err.message || 'Error deleting package');
    }
  };

  if (!isOpen || !pkg) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
        <p className="mb-4">
          Are you sure you want to delete package "{pkg.package_name}" (ID: {pkg.package_id})?
        </p>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteConfirm}
            className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePackage;
