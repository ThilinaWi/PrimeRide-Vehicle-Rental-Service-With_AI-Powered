import axios from "axios";

const API_URL = "http://localhost:3000/api/vehicles";

export const vehicleService = {
  // Create a new vehicle - enhanced version
  async createVehicle(formData) {
    try {
      // Ensure we're not sending any vehicle_id field
      if (formData instanceof FormData) {
        // If using FormData, ensure no vehicle_id is appended
        if (formData.has("vehicle_id")) {
          formData.delete("vehicle_id");
        }
      } else if (formData.vehicle_id) {
        // If regular object, remove vehicle_id
        const { vehicle_id, ...cleanData } = formData;
        formData = cleanData;
      }

      const response = await axios.post(`${API_URL}/`, formData, {
        headers: {
          "Content-Type":
            formData instanceof FormData
              ? "multipart/form-data"
              : "application/json",
        },
        transformRequest:
          formData instanceof FormData
            ? [(data) => data] // Skip transformation for FormData
            : [JSON.stringify], // Stringify JSON data
      });

      return response.data;
    } catch (error) {
      console.error("Vehicle creation error:", error);
      throw (
        error.response?.data || {
          message: error.message || "Failed to create vehicle",
          error: error.toString(),
        }
      );
    }
  },

  // Get all vehicles
  async getAllVehicles() {
    try {
      const response = await axios.get(`${API_URL}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get vehicle by ID
  async getVehicleById(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update vehicle
  async updateVehicle(id, formData) {
    try {
      // Ensure we're not sending any vehicle_id field for updates either
      if (formData instanceof FormData) {
        if (formData.has("vehicle_id")) {
          formData.delete("vehicle_id");
        }
      } else if (formData.vehicle_id) {
        const { vehicle_id, ...cleanData } = formData;
        formData = cleanData;
      }

      const response = await axios.put(`${API_URL}/${id}`, formData, {
        headers: {
          "Content-Type":
            formData instanceof FormData
              ? "multipart/form-data"
              : "application/json",
        },
        transformRequest:
          formData instanceof FormData ? [(data) => data] : [JSON.stringify],
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete vehicle
  async deleteVehicle(id) {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
