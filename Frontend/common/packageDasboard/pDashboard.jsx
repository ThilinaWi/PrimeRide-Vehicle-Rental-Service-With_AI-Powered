import { useEffect, useState } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const PackDashboard = ({ packages }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (packages.length) setLoading(false);
  }, [packages]);

  // Package Type Distribution
  const packageTypeData = {
    labels: [...new Set(packages.map(pkg => pkg.package_type))],
    datasets: [
      {
        label: "Package Count",
        data: [...new Set(packages.map(pkg => pkg.package_type))].map(
          type => packages.filter(pkg => pkg.package_type === type).length
        ),
        backgroundColor: [
          'rgba(99, 255, 234, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(247, 123, 195, 0.7)',
          'rgba(204, 135, 231, 0.7)',
        ],
        borderColor: [
          'rgb(144, 232, 243)',
          'rgba(54, 162, 235, 1)',
          'rgb(250, 152, 242)',
          'rgb(193, 128, 236)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Price Range Distribution
  const priceRanges = ['0-50', '51-100', '101-150', '151-200', '200+'];
  const priceDistributionData = {
    labels: priceRanges,
    datasets: [
      {
        label: "Packages by Price Range (per day)",
        data: [
          packages.filter(pkg => pkg.price_per_day <= 50).length,
          packages.filter(pkg => pkg.price_per_day > 50 && pkg.price_per_day <= 100).length,
          packages.filter(pkg => pkg.price_per_day > 100 && pkg.price_per_day <= 150).length,
          packages.filter(pkg => pkg.price_per_day > 150 && pkg.price_per_day <= 200).length,
          packages.filter(pkg => pkg.price_per_day > 200).length,
        ],
        backgroundColor: 'rgba(79, 70, 229, 0.7)',
        borderColor: 'rgba(79, 70, 229, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Popular Features Analysis
  const analyzeFeatures = () => {
    const featureCounts = {};

    packages.forEach(pkg => {
      const features = typeof pkg.additional_features === 'string'
        ? JSON.parse(pkg.additional_features)
        : pkg.additional_features || {};

      Object.entries(features).forEach(([feature, enabled]) => {
        if (enabled) {
          featureCounts[feature] = (featureCounts[feature] || 0) + 1;
        }
      });

      const customFeatures = Array.isArray(pkg.custom_additional_features)
        ? pkg.custom_additional_features.filter(Boolean)
        : [];

      customFeatures.forEach(feature => {
        featureCounts[feature] = (featureCounts[feature] || 0) + 1;
      });
    });

    const sortedFeatures = Object.entries(featureCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      labels: sortedFeatures.map(([feature]) => feature.replace(/_/g, ' ')),
      counts: sortedFeatures.map(([_, count]) => count),
    };
  };

  // Duration vs Price Analysis
  const durationPriceData = {
    labels: packages.map(pkg => `${pkg.duration} days`),
    datasets: [
      {
        label: "Price per Day ($)",
        data: packages.map(pkg => pkg.price_per_day),
        borderColor: 'rgba(245, 158, 11, 1)',
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
        tension: 0.1,
      },
      {
        label: "Total Price ($)",
        data: packages.map(pkg => pkg.price_per_day * (Array.isArray(pkg.duration) ? pkg.duration[0] : pkg.duration)),
        borderColor: 'rgba(220, 38, 38, 1)',
        backgroundColor: 'rgba(220, 38, 38, 0.2)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { color: "#1F2937", font: { size: 14 } },
      },
      title: { display: true, text: "", color: "#1F2937", font: { size: 18 } },
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

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-xl animate-pulse">
        Loading package data...
      </div>
    );

  return (
    <div className="space-y-10 mt-8 p-6">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 tracking-tight">
        Package Analytics Dashboard
      </h1>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* PIE CHART WITH SIZE */}
        <div className="bg-white p-10 rounded-2xl shadow-xl transform hover:scale-105 transition duration-300">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Package Type Distribution</h2>
          <div className="flex justify-center items-center" style={{ height: "350px", width: "100%" }}>
            <Pie
              data={packageTypeData}
              options={{ ...chartOptions, title: { text: "Package Types" } }}
            />
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-xl transform hover:scale-105 transition duration-300">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Price Range Analysis</h2>
          <div style={{ height: "350px", width: "100%" }}>
            <Bar
              data={priceDistributionData}
              options={{ ...chartOptions, title: { text: "Price Distribution" } }}
            />
          </div>
        </div>
      </div>

      {/* Line Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-xl transform hover:scale-105 transition duration-300 col-span-2">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Duration vs Price Analysis</h2>
          <div style={{ height: "400px", width: "100%" }}>
            <Line
              data={durationPriceData}
              options={{ ...chartOptions, title: { text: "Price Trends" } }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackDashboard;
