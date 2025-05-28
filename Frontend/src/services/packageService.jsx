// src/services/packageService.js
import axios from "axios";

const API_URL = "http://localhost:3000/api/packages"; // Adjust the URL if necessary

export const packageService = {
  // Create a new package
  async createPackage(formData) {
    try {
      const formDataInstance = new FormData();
      
      // Append all regular fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'additional_features' && 
            key !== 'safety_security_features' && 
            key !== 'image') {
          formDataInstance.append(key, value);
        }
      });
  
      // Stringify feature objects
      formDataInstance.append('additional_features', JSON.stringify(formData.additional_features));
      formDataInstance.append('safety_security_features', JSON.stringify(formData.safety_security_features));
      
     
  
      // Append image with correct field name
      if (formData.image) {
        formDataInstance.append('image_upload', formData.image);
      }
  
      const response = await axios.post(`${API_URL}/`, formDataInstance, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error(
        "Create Package Error:",
        error.response?.data || error.message
      );
      throw error.response?.data || error.message;
    }
},

  // Get all packages
  async getAllPackages() {
    try {
      const response = await axios.get(`${API_URL}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get package by ID
  async getPackageById(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update package
  async updatePackage(id, formData) {
    try {
      console.log("Sending update for package ID:", id);
      console.log("FormData contents:", formData);
      
      const response = await axios.put(`${API_URL}/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      console.log("Update successful:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Update Package Error:",
        error.response?.data || error.message
      );
      throw error.response?.data || error.message;
    }
  },

  // Delete package
  async deletePackage(id) {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  async getPackageReport() {
    try {
      const response = await axios.get(`${API_URL}/report`);
      return response.data;
    } catch (error) {
      console.error(
        "Get Report Error:",
        error.response?.data || error.message
      );
      throw error.response?.data || error.message;
    }
  },
};
