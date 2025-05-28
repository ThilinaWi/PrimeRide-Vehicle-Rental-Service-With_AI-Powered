import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../SidebarVehiclePred";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

const DashboardPred = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

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
        const interval = setInterval(fetchVehicles, 5000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div className="flex justify-center items-center h-screen text-gray-600 text-xl animate-pulse">Loading charts...</div>;

    const vehicleHealthData = [
        { name: "Good Condition ✅", value: vehicles.filter(v => v.prediction?.status.includes("✅")).length },
        { name: "Needs Attention ⚠", value: vehicles.filter(v => v.prediction?.status.includes("⚠")).length },
    ];

    const predictedRepairs = vehicles.reduce((acc, v) => {
        const issue = v.prediction?.predictedIssue || "Unknown";
        acc[issue] = (acc[issue] || 0) + 1;
        return acc;
    }, {});

    const predictedRepairsData = Object.entries(predictedRepairs).map(([key, value]) => ({
        name: key,
        count: value
    }));

    const colors = ["#10B981", "#EF4444"];

    return (
        <div className="flex min-h-screen bg-gradient-to-r from-gray-100 to-gray-200">
            <Sidebar vehicles={vehicles} />
            
            <div className="flex-1 p-8 ml-72 space-y-8">
                <h1 className="text-5xl font-extrabold text-gray-800 tracking-tight text-center">Prediction Dashboard</h1>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition duration-500">
                        <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">🚗 Vehicle Health Distribution</h2>
                        <div className="flex justify-center">
                            <ResponsiveContainer width={400} height={300}>
                                <PieChart>
                                    <Pie 
                                        data={vehicleHealthData} 
                                        dataKey="value" 
                                        nameKey="name" 
                                        cx="50%" 
                                        cy="50%" 
                                        outerRadius={120} 
                                        label 
                                        animationDuration={800}
                                    >
                                        {vehicleHealthData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={colors[index]} />
                                        ))}
                                    </Pie>
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition duration-500">
                        <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">🛠 Predicted Repairs Breakdown</h2>
                        <div className="flex justify-center">
                            <ResponsiveContainer width="95%" height={300}>
                                <BarChart data={predictedRepairsData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" tick={{ fill: "#374151", fontSize: 14 }} />
                                    <YAxis tick={{ fill: "#374151", fontSize: 14 }} />
                                    <Tooltip contentStyle={{ backgroundColor: "#f9fafb", borderRadius: "8px", borderColor: "#e5e7eb" }} />
                                    <Legend />
                                    <Bar 
                                        dataKey="count" 
                                        fill="#3B82F6" 
                                        barSize={50} 
                                        radius={[10, 10, 0, 0]} 
                                        animationDuration={1000}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPred;
