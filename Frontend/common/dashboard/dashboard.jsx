import { useEffect, useState, useMemo } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = ({ drivers = [], vehicles = [] }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Safe versions of props
  const safeDrivers = Array.isArray(drivers) ? drivers : drivers.data || [];

  const safeVehicles = Array.isArray(vehicles) ? vehicles : [];

  useEffect(() => {
    try {
      if (drivers !== undefined && vehicles !== undefined) {
        setLoading(false);
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [drivers, vehicles]);

  // Chart data with memoization
  const driverStatusData = useMemo(
    () => ({
      labels: ["Available", "Unavailable"],
      datasets: [
        {
          data: [
            safeDrivers.filter(
              (d) =>
                d.availability_status?.toString().toLowerCase() ===
                  "available" || d.availability_status === true
            ).length,
            safeDrivers.filter(
              (d) =>
                d.availability_status?.toString().toLowerCase() ===
                  "unavailable" || d.availability_status === false
            ).length,
          ],
          backgroundColor: ["#34D399", "#F87171"],
          hoverBackgroundColor: ["#2DD4BF", "#FCA5A5"],
        },
      ],
    }),
    [safeDrivers]
  );

  const vehicleTypeData = useMemo(() => {
    const types = [...new Set(safeVehicles.map((v) => v.vehicle_type))];
    return {
      labels: types,
      datasets: [
        {
          label: "Vehicles by Type",
          data: types.map(
            (type) => safeVehicles.filter((v) => v.vehicle_type === type).length
          ),
          backgroundColor: "rgba(59, 130, 246, 0.7)",
          borderColor: "#3B82F6",
          borderWidth: 1,
          hoverBackgroundColor: "#60A5FA",
        },
      ],
    };
  }, [safeVehicles]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: { color: "#1F2937", font: { size: 14 } },
      },
      title: { display: true, color: "#1F2937", font: { size: 18 } },
      tooltip: {
        backgroundColor: "#111827",
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
      },
    },
    scales: {
      y: { beginAtZero: true, ticks: { color: "#1F2937" } },
      x: { ticks: { color: "#1F2937" } },
    },
  };

  const getChartOptions = (title) => ({
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        ...chartOptions.plugins.title,
        text: title,
      },
    },
  });

  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );

  return (
    <div className="space-y-10 p-6">
      <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg transform hover:scale-[1.02] transition duration-300">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            Driver Availability
          </h2>
          <Pie
            data={driverStatusData}
            options={getChartOptions("Driver Status")}
            aria-label="Driver availability status chart"
          />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg transform hover:scale-[1.02] transition duration-300">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            Vehicle Distribution
          </h2>
          <Bar
            data={vehicleTypeData}
            options={getChartOptions("Vehicles by Type")}
            aria-label="Vehicle type distribution chart"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Summary cards remain the same */}
      </div>
    </div>
  );
};

export default Dashboard;
