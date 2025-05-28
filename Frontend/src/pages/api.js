import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api"; // Adjust based on your backend

// export const getVehiclePrediction = async (vehicleId) => {
//     try {
//         const response = await axios.get(`${API_BASE_URL}/vehicles/${vehicleId}`);
//         return response.data;
//     } catch (error) {
//         console.error("Error fetching vehicle data:", error);
//         return null;
//     }
// };
export const getVehiclePrediction = async (vehicleId) => {
    const response = await fetch(`http://localhost:3000/api/vehiclesPred/${vehicleId}`);
    return response.json();
};

export const getAllPredictions = async () => {
    const response = await fetch("http://localhost:3000/api/vehiclesPred");
    return response.json();
};


export const getAllVehicles = async () => {
    try {
        const response = await axios.get("/api/vehiclesPred");
        return response.data;
    } catch (error) {
        console.error("Failed to fetch vehicles", error);
        return [];
    }
};