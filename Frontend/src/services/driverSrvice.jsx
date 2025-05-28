import axios from "axios";
import { toast } from "react-toastify";

// Configuration
const API_BASE_URL = "http://localhost:3000/api/driver";
const API_TIMEOUT = 10000; // 10 seconds

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for logging and auth tokens
api.interceptors.request.use(
  (config) => {
    console.log("Request:", config.method?.toUpperCase(), config.url);
    // Add auth token if available
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    console.log("Response:", response.status, response.data);
    return response;
  },
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

/**
 * Enhanced error handler with toast notifications
 */
const handleServiceError = (error) => {
  let errorMessage = "An unexpected error occurred";
  let errorDetails = null;
  let statusCode = null;

  if (error.response) {
    // Server responded with error status
    statusCode = error.response.status;
    errorDetails = error.response.data?.errors;
    errorMessage =
      error.response.data?.message ||
      `Request failed with status ${statusCode}`;

    // Specific status code handling
    if (statusCode === 401) {
      errorMessage = "Authentication required";
      // Optionally redirect to login
    } else if (statusCode === 404) {
      errorMessage = "Resource not found";
    } else if (statusCode >= 500) {
      errorMessage = "Server error occurred";
    }
  } else if (error.request) {
    // Request was made but no response received
    errorMessage = "No response from server. Network error?";
  } else {
    // Something happened in setting up the request
    errorMessage = error.message || errorMessage;
  }

  console.error("Service Error:", {
    message: errorMessage,
    details: errorDetails,
    status: statusCode,
    originalError: error,
  });

  // Show user-friendly toast notification
  toast.error(errorMessage, {
    position: "top-right",
    autoClose: 5000,
  });

  return {
    success: false,
    message: errorMessage,
    errors: errorDetails,
    status: statusCode,
    data: null,
  };
};

/**
 * GET all drivers with optional query parameters
 * @param {Object} params - Query parameters (e.g., { page: 1, limit: 10 })
 * @returns {Promise<{success: boolean, data: Array, message: string}>}
 */
export const getAllDrivers = async (params = {}) => {
  try {
    const response = await api.get("/", { params });

    // Normalize response data to ensure array
    const driversData = Array.isArray(response.data?.data)
      ? response.data.data
      : Array.isArray(response.data)
      ? response.data
      : [];

    return {
      success: true,
      data: driversData,
      message: "Drivers fetched successfully",
      pagination: response.data?.pagination || null,
    };
  } catch (error) {
    return handleServiceError(error);
  }
};

/**
 * GET a single driver by ID
 * @param {string} id - Driver ID
 * @returns {Promise<{success: boolean, data: Object|null, message: string}>}
 */
export const getDriverById = async (id) => {
  if (!id) {
    console.error("No ID provided to getDriverById");
    return {
      success: false,
      data: null,
      message: "No driver ID provided",
    };
  }

  try {
    const response = await api.get(`/${id}`);
    return {
      success: true,
      data: response.data,
      message: "Driver fetched successfully",
    };
  } catch (error) {
    return handleServiceError(error);
  }
};

/**
 * POST create a new driver
 * @param {Object|FormData} driverData - Driver data to create
 * @returns {Promise<{success: boolean, data: Object|null, message: string}>}
 */
export const createDriver = async (driverData) => {
  if (!driverData) {
    console.error("No data provided to createDriver");
    return {
      success: false,
      data: null,
      message: "No driver data provided",
    };
  }

  try {
    // Handle FormData for file uploads
    const config =
      driverData instanceof FormData
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : {};

    const response = await api.post("/", driverData, config);

    toast.success("Driver created successfully");
    return {
      success: true,
      data: response.data,
      message: "Driver created successfully",
    };
  } catch (error) {
    return handleServiceError(error);
  }
};

/**
 * PUT update an existing driver
 * @param {string} id - Driver ID
 * @param {Object|FormData} driverData - Updated driver data
 * @returns {Promise<{success: boolean, data: Object|null, message: string}>}
 */
export const updateDriver = async (id, driverData) => {
  if (!id || !driverData) {
    console.error("Missing ID or data in updateDriver");
    return {
      success: false,
      data: null,
      message: !id ? "No driver ID provided" : "No update data provided",
    };
  }

  try {
    // Handle FormData for file uploads
    const config =
      driverData instanceof FormData
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : {};

    const response = await api.put(`/${id}`, driverData, config);

    toast.success("Driver updated successfully");
    return {
      success: true,
      data: response.data,
      message: "Driver updated successfully",
    };
  } catch (error) {
    return handleServiceError(error);
  }
};

/**
 * DELETE a driver
 * @param {string} id - Driver ID
 * @returns {Promise<{success: boolean, data: Object|null, message: string}>}
 */
export const deleteDriver = async (id) => {
  if (!id) {
    console.error("No ID provided to deleteDriver");
    return {
      success: false,
      data: null,
      message: "No driver ID provided",
    };
  }

  try {
    const response = await api.delete(`/${id}`);

    toast.success("Driver deleted successfully");
    return {
      success: true,
      data: response.data,
      message: "Driver deleted successfully",
    };
  } catch (error) {
    return handleServiceError(error);
  }
};

/**
 * Search drivers with filters
 * @param {Object} filters - Search filters { name, licenseClass, status, etc. }
 * @returns {Promise<{success: boolean, data: Array, message: string}>}
 */
export const searchDrivers = async (filters = {}) => {
  try {
    const response = await api.get("/search", { params: filters });
    return {
      success: true,
      data: response.data,
      message: "Search completed successfully",
    };
  } catch (error) {
    return handleServiceError(error);
  }
};

// Export all functions
export default {
  getAllDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
  searchDrivers,
};
