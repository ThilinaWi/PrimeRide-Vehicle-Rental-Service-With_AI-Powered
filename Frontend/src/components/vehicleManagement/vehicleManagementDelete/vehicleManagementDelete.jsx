import React, { useState } from "react";
import { vehicleService } from "../../../services/vehicleService";

const DeleteVehicleModal = ({ isOpen, onClose, vehicle, onSuccess }) => {
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError("");

    try {
      await vehicleService.deleteVehicle(vehicle._id);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || "Error deleting vehicle");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-gray-800">
              Confirm Deletion
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
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

          <div className="mt-4 mb-6">
            <p className="text-gray-600">
              Are you sure you want to permanently delete this vehicle?
            </p>
            <div className="mt-4 bg-red-50 p-3 rounded-md">
              <p className="font-medium text-gray-800">
                {vehicle?.brand} - {vehicle?.vehicle_number}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {vehicle?.vehicle_type} • {vehicle?.seating_capacity} seats • $
                {vehicle?.daily_rate}/day
              </p>
            </div>
            <p className="mt-3 text-sm text-red-600">
              This action cannot be undone and will permanently remove all
              vehicle data.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 flex items-center"
            >
              {isDeleting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  Deleting...
                </>
              ) : (
                "Delete Vehicle"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteVehicleModal;
