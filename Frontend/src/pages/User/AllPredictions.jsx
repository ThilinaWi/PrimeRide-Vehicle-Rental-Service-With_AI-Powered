// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const AllPredictions = () => {
//   const [vehicles, setVehicles] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchVehicles = async () => {
//       try {
//         const response = await axios.get("http://localhost:3000/api/vehiclesPred");
//         setVehicles(response.data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching vehicle predictions:", error);
//         setLoading(false);
//       }
//     };

//     fetchVehicles();
//   }, []);

//   if (loading) return <p className="text-center text-gray-600">Loading predictions...</p>;

//   return (
//     <div className="max-w-5xl mx-auto p-6">
//       <h2 className="text-2xl font-bold text-center mb-6">Vehicle Maintenance Predictions</h2>

//       {vehicles.length === 0 && (
//         <p className="text-center text-gray-500">No vehicles found.</p>
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {vehicles.map(vehicle => (
//           <div key={vehicle._id} className="bg-white rounded-lg shadow-md p-4">
//             <h3 className="text-xl font-semibold mb-2">{vehicle.name}</h3>
//             {vehicle.prediction ? (
//               <>
//                 <p><strong>🔧 Predicted Issue:</strong> {vehicle.prediction.predictedIssue}</p>
//                 <p><strong>📅 Next Service:</strong> {vehicle.prediction.nextServiceDate}</p>
//                 <p><strong>📋 Status:</strong> {vehicle.prediction.status}</p>
//                 <p><strong>💡 Recommendation:</strong> {vehicle.prediction.recommendation}</p>
//               </>
//             ) : (
//               <p className="text-gray-500">No prediction available.</p>
//             )}
//             <p className="text-red-500 text-sm mt-2">⚠️ AI-based prediction. Actual condition may vary.</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AllPredictions;



import React, { useEffect, useState } from "react";
import axios from "axios";

const AllPredictions = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/vehiclesPred");
        const sorted = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setVehicles(sorted);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching vehicle predictions:", error);
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg animate-pulse">Loading predictions...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
        Vehicle Maintenance Predictions
      </h2>

      {vehicles.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No vehicles found.</p>
      ) : (
        // <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-9">

          {vehicles.map(vehicle => (
            <div
              key={vehicle._id}
              className="bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">{vehicle.name}</h3>
              {vehicle.prediction ? (
                <div className="space-y-2 text-gray-700 text-sm">
                  <p><span className="font-medium">🔧 Predicted Issue:</span> {vehicle.prediction.predictedIssue}</p>
                  <p><span className="font-medium">📅 Next Service:</span> {vehicle.prediction.nextServiceDate}</p>
                  <p><span className="font-medium">📋 Status:</span> {vehicle.prediction.status}</p>
                  <p><span className="font-medium">💡 Recommendation:</span> {vehicle.prediction.recommendation}</p>
                </div>
              ) : (
                <p className="text-gray-400 italic">No prediction available.</p>
              )}
              <p className="mt-4 text-xs text-red-500 italic">
                ⚠️ AI-based prediction. Actual condition may vary.
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllPredictions;
