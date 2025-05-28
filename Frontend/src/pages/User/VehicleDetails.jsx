

import { useState } from "react";
import { getVehiclePrediction } from "../../pages/api";

const VehicleDetails = () => {
    const [vehicleId, setVehicleId] = useState("");
    const [vehicleData, setVehicleData] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchPrediction = async () => {
        setLoading(true);
        const data = await getVehiclePrediction(vehicleId);
        setVehicleData(data);
        setLoading(false);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold mb-6 text-blue-600">Vehicle AI Prediction</h1>

            <input
                type="text"
                placeholder="Enter Vehicle ID"
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
                className="p-3 w-96 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <button
                onClick={fetchPrediction}
                className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
                Get Prediction
            </button>

            {loading && <p className="mt-4 text-lg font-semibold text-gray-600">Loading...</p>}

            {vehicleData && (
                <div className="mt-6 p-6 bg-white shadow-lg rounded-xl w-full max-w-lg">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">{vehicleData.name}</h2>
                    <p><strong>Next Service Date:</strong> {vehicleData.prediction?.nextServiceDate}</p>
                    <p><strong>Predicted Issue:</strong> {vehicleData.prediction?.predictedIssue}</p>
                    <p><strong>Status:</strong> {vehicleData.prediction?.status}</p>
                    <p><strong>Recommendation:</strong> {vehicleData.prediction?.recommendation}</p>
                    <p className="mt-4 text-sm text-red-600 font-medium">⚠️ Warning: The maintenance predictions provided are based on AI analysis. Actual vehicle performance may vary.</p>
                </div>
            )}
        </div>
    );
};

export default VehicleDetails;

