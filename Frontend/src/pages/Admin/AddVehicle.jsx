import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../common/SidebarVehiclePred";

const AddVehicle = () => {
    const navigate = useNavigate();
    const [vehicle, setVehicle] = useState({
        name: "",
        lastServiceDate: "",
        mileage: "",
        tireWear: "",
        engineHealth: "",
        brakeWear: "",
        oilViscosity: "",
        coolantLevel: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Check for negative or invalid values for Mileage (km) and other percentage fields
        if (name === "mileage" && value < 0) {
            setError("Mileage cannot be negative.");
            return;
        }

        if (name !== "mileage" && (value < 0 || value > 100)) {
            setError(`${name.replace(/([A-Z])/g, ' $1')} must be between 0 and 100.`);
            return;
        } else {
            setError("");
        }

        setVehicle({ ...vehicle, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await axios.post("http://localhost:3000/api/vehiclesPred", vehicle);
            navigate("/admin/predictions");
        } catch (err) {
            setError("Failed to add vehicle. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="max-w-2xl mx-auto mt-10 bg-white p-6 shadow-xl rounded-xl w-full">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">➕ Add Vehicle for Prediction</h2>

                {error && <p className="text-red-600 text-sm font-medium mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Vehicle Name</label>
                            <input type="text" name="name" value={vehicle.name} onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md" required />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Last Service Date</label>
                            <input type="date" name="lastServiceDate" value={vehicle.lastServiceDate} onChange={handleChange}
                                max={new Date().toISOString().split('T')[0]}
                                className="w-full p-2 border border-gray-300 rounded-md" required />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Mileage (km)</label>
                            <input type="number" name="mileage" value={vehicle.mileage} onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md" required />
                        </div>

                        {['tireWear', 'engineHealth', 'brakeWear', 'oilViscosity', 'coolantLevel'].map(field => (
                            <div key={field}>
                                <label className="block text-sm font-medium mb-1">
                                    {field.replace(/([A-Z])/g, ' $1').trim()} (%)
                                </label>
                                <input type="number" name={field} value={vehicle[field]} onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md" required />
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end space-x-3 mt-4">
                        <button type="submit" className="bg-green-500 text-white px-4 py-2 text-sm rounded-md hover:bg-green-600 transition duration-300">
                            {loading ? "Adding..." : "✅ Add Vehicle"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddVehicle;



// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Sidebar from "../../../common/SidebarVehiclePred";

// const AddVehicle = () => {
//     const navigate = useNavigate();

//     const [vehicle, setVehicle] = useState({
//         vehicleName: "",
//         lastServiceDate: "",
//         mileage: "",
//         tireWear: "",
//         engineHealth: "",
//         brakeWear: "",
//         oilViscosity: "",
//         coolantLevel: "",
//     });

//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");
//     const [success, setSuccess] = useState("");

//     const handleChange = (e) => {
//         const { name, value } = e.target;

//         // Convert to number for validation
//         const numericValue = parseFloat(value);

//         if (name === "mileage" && numericValue < 0) {
//             setError("Mileage cannot be negative.");
//             return;
//         }

//         const percentageFields = ["tireWear", "engineHealth", "brakeWear", "oilViscosity", "coolantLevel"];
//         if (percentageFields.includes(name) && (numericValue < 0 || numericValue > 100)) {
//             setError(`${name.replace(/([A-Z])/g, ' $1')} must be between 0 and 100.`);
//             return;
//         }

//         setError("");
//         setVehicle({ ...vehicle, [name]: value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError("");
//         setSuccess("");

//         try {
//             await axios.post("http://localhost:3000/api/vehiclesPred", vehicle);
//             setSuccess("Vehicle added successfully!");
//             setTimeout(() => navigate("/admin/predictions"), 1500);
//         } catch (err) {
//             console.error(err);
//             setError("Failed to add vehicle. Please check the input and try again.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const resetForm = () => {
//         setVehicle({
//             vehicleName: "",
//             lastServiceDate: "",
//             mileage: "",
//             tireWear: "",
//             engineHealth: "",
//             brakeWear: "",
//             oilViscosity: "",
//             coolantLevel: "",
//         });
//         setError("");
//         setSuccess("");
//     };

//     return (
//         <div className="flex">
//             <Sidebar />
//             <div className="max-w-3xl mx-auto mt-10 bg-white p-8 shadow-xl rounded-xl w-full">
//                 <h2 className="text-2xl font-bold text-gray-800 mb-6">➕ Add Vehicle for Prediction</h2>

//                 {error && <p className="text-red-600 text-sm font-medium mb-4">{error}</p>}
//                 {success && <p className="text-green-600 text-sm font-medium mb-4">{success}</p>}

//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                             <label className="block text-sm font-medium mb-1">Vehicle Name</label>
//                             <input
//                                 type="text"
//                                 name="vehicleName"
//                                 value={vehicle.vehicleName}
//                                 onChange={handleChange}
//                                 className="w-full p-2 border border-gray-300 rounded-md"
//                                 placeholder="e.g., Toyota Prius 2020"
//                                 required
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium mb-1">Last Service Date</label>
//                             <input
//                                 type="date"
//                                 name="lastServiceDate"
//                                 value={vehicle.lastServiceDate}
//                                 onChange={handleChange}
//                                 max={new Date().toISOString().split('T')[0]}
//                                 className="w-full p-2 border border-gray-300 rounded-md"
//                                 required
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium mb-1">Mileage (km)</label>
//                             <input
//                                 type="number"
//                                 name="mileage"
//                                 value={vehicle.mileage}
//                                 onChange={handleChange}
//                                 className="w-full p-2 border border-gray-300 rounded-md"
//                                 placeholder="e.g., 45000"
//                                 required
//                             />
//                         </div>

//                         {[
//                             { name: "tireWear", label: "Tire Wear" },
//                             { name: "engineHealth", label: "Engine Health" },
//                             { name: "brakeWear", label: "Brake Wear" },
//                             { name: "oilViscosity", label: "Oil Viscosity" },
//                             { name: "coolantLevel", label: "Coolant Level" },
//                         ].map((field) => (
//                             <div key={field.name}>
//                                 <label className="block text-sm font-medium mb-1">{field.label} (%)</label>
//                                 <input
//                                     type="number"
//                                     name={field.name}
//                                     value={vehicle[field.name]}
//                                     onChange={handleChange}
//                                     className="w-full p-2 border border-gray-300 rounded-md"
//                                     placeholder={`Enter ${field.label.toLowerCase()}`}
//                                     min="0"
//                                     max="100"
//                                     required
//                                 />
//                             </div>
//                         ))}
//                     </div>

//                     <div className="flex justify-between items-center mt-6">
//                         <button
//                             type="button"
//                             onClick={resetForm}
//                             className="px-4 py-2 border border-gray-400 rounded-md text-sm text-gray-600 hover:bg-gray-100"
//                         >
//                             🔄 Reset
//                         </button>
//                         <button
//                             type="submit"
//                             className="px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition duration-300"
//                         >
//                             {loading ? "Adding..." : "✅ Add Vehicle"}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default AddVehicle;
