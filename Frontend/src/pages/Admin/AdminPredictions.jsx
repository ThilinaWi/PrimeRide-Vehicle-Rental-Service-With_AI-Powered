import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Sidebar from "../../../common/SidebarVehiclePred";

const AdminDashboard = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [loadingId, setLoadingId] = useState(null);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/vehiclesPred");
                setVehicles(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching vehicles:", error);
            }
        };

        fetchVehicles();
        const interval = setInterval(fetchVehicles, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleGeneratePrediction = async (vehicleId) => {
        setLoadingId(vehicleId);

        try {
            await axios.post(`http://localhost:3000/api/vehiclesPred/${vehicleId}/predict`);
            const response = await axios.get("http://localhost:3000/api/vehiclesPred");
            setVehicles(response.data);
        } catch (error) {
            console.error("Error generating prediction:", error);
        } finally {
            setLoadingId(null);
        }
    };

    if (loading) return <p className="text-center text-gray-500">Loading vehicles...</p>;

    const filteredVehicles = vehicles.filter(vehicle => {
        if (filter === "all") return true;
        if (filter === "attention") return vehicle.prediction?.status.includes("⚠");
        if (filter === "good") return vehicle.prediction?.status.includes("✅");
        return false;
    }).filter(vehicle => vehicle.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="flex">
            <Sidebar vehicles={vehicles} />

            <div className="flex-1 p-6 bg-white shadow-lg rounded-lg ml-72">
                <div className="mb-6 flex justify-between items-center">
    
                    <h2 className="text-5xl font-extrabold text-gray-800 tracking-tight text-center">Vehicle Prediction Details</h2>
                    <div className="flex items-center space-x-4">
                        <input
                            type="text"
                            placeholder="Search Vehicle..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border p-2 rounded-lg text-lg w-64"
                        />
                        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border p-2 rounded-lg text-lg">
                            <option value="all">All Vehicles</option>
                            <option value="attention">Needs Attention ⚠</option>
                            <option value="good">Good Condition ✅</option>
                        </select>
                        {/* <button>
                            <Link to="/addvehiclePred" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300 text-lg">
                                ➕ Add New Vehicle
                            </Link>
                        </button> */}
                    </div>
                </div>

                {/* <h6 className="text-lg font-semibold text-red-600 mb-2">⚠️ Warning: The maintenance predictions provided are based on AI analysis. Actual vehicle performance may vary.</h6> */}
                <h6 className="text-sm font-medium text-red-600 mb-4">⚠️ Warning: The maintenance predictions provided are based on AI analysis. Actual vehicle performance may vary.</h6>
                <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                    <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                        <thead className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
                            <tr>
                                <th className="p-4 text-left">Vehicle</th>
                                <th className="p-4 text-left">Next Service</th>
                                <th className="p-4 text-left">Predicted Issue</th>
                                <th className="p-4 text-left">Status</th>
                                <th className="p-4 text-left">Recommendation</th>
                                <th className="p-4 text-center">Prediction</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredVehicles.map(vehicle => (
                                <tr key={vehicle._id} className="hover:bg-gray-100 transition duration-200">
                                    <td className="p-4 text-gray-800 font-medium">{vehicle.name}</td>
                                    <td className="p-4 text-gray-600">{vehicle.prediction?.nextServiceDate || "N/A"}</td>
                                    <td className="p-4 text-gray-600">{vehicle.prediction?.predictedIssue || "N/A"}</td>
                                    <td className={`p-4 font-semibold ${vehicle.prediction?.status.includes("⚠") ? "text-red-500" : "text-green-500"}`}>
                                        {vehicle.prediction?.status || "N/A"}
                                    </td>
                                    <td className="p-4 text-gray-600">{vehicle.prediction?.recommendation || "N/A"}</td>
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => handleGeneratePrediction(vehicle._id)}
                                            className={`bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 shadow-md ${loadingId === vehicle._id ? "opacity-50 cursor-not-allowed" : ""}`}
                                            disabled={loadingId === vehicle._id}
                                        >
                                            {loadingId === vehicle._id ? "Generating..." : "🔄 Generate"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
