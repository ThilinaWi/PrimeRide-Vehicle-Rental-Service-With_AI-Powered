import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const PackageSidebar = ({ packages = [] }) => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    { path: "/package-management-dashboard", label: "Dashboard", icon: "🏠" },
    { path: "/package-table", label: "Rental Packages", icon: "📦" },
    { path: "/create-package", label: "Add Rental Package", icon: "➕" },
    { path: "/package-report", label: "Packages Report", icon: "📊" },
  ];

  // Calculate metrics
  const totalPackages = packages.length;
  const packageTypes = [...new Set(packages.map(pkg => pkg.package_type))].length;
  const avgPrice = (packages.reduce((sum, pkg) => sum + pkg.price_per_day, 0) / (packages.length || 1)).toFixed(2);

  return (
    <div
      className={`bg-gradient-to-b from-blue-800 to-blue-600 text-white fixed left-0 z-5 transition-all duration-300 ${
        isOpen ? "w-72" : "w-20"
      } top-16 bottom-0`}
    >
      <div className="p-4 flex justify-between items-center">
        {isOpen && (
          <span className="text-2xl font-extrabold tracking-tight">
            Admin Panel
          </span>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-blue-800 transition duration-200 focus:outline-none"
          aria-label="Toggle sidebar"
        >
          <span className="text-xl">{isOpen ? "◄" : "►"}</span>
        </button>
      </div>

      <nav className="mt-6">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center p-4 hover:bg-blue-700 transition duration-200 ${
              location.pathname === item.path ? "bg-blue-900 shadow-inner" : ""
            }`}
          >
            <span className="text-2xl mr-4">{item.icon}</span>
            {isOpen && (
              <span className="text-lg font-medium">{item.label}</span>
            )}
          </Link>
        ))}
      </nav>

      {/* Summary Cards */}
      {isOpen ? (
        <div className="p-4 mt-8">
          <div className="bg-blue-800/50 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-blue-700/30">
            <h3 className="text-xs uppercase tracking-wider text-blue-200 mb-4 font-semibold">
              Package Statistics
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-900/30 rounded-lg hover:bg-blue-900/50 transition duration-200">
                <div className="flex items-center">
                  <span className="bg-blue-600 p-2 rounded-lg mr-3">📦</span>
                  <div>
                    <p className="text-xs text-blue-200">Total Packages</p>
                    <p className="text-xl font-bold">{totalPackages}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-900/30 rounded-lg hover:bg-blue-900/50 transition duration-200">
                <div className="flex items-center">
                  <span className="bg-blue-600 p-2 rounded-lg mr-3">🏷️</span>
                  <div>
                    <p className="text-xs text-blue-200">Package Types</p>
                    <p className="text-xl font-bold">{packageTypes}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-900/30 rounded-lg hover:bg-blue-900/50 transition duration-200">
                <div className="flex items-center">
                  <span className="bg-blue-600 p-2 rounded-lg mr-3">💰</span>
                  <div>
                    <p className="text-xs text-blue-200">Avg. Price/Day</p>
                    <p className="text-xl font-bold">${avgPrice}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-2 mt-8 flex flex-col items-center space-y-3">
          <div className="bg-blue-800/70 p-3 rounded-lg shadow-md w-14 h-14 flex flex-col items-center justify-center group hover:bg-blue-800 transition duration-200">
            <span className="text-xs text-blue-200 group-hover:text-white">📦</span>
            <span className="text-sm font-bold mt-1">{totalPackages}</span>
          </div>
          <div className="bg-blue-800/70 p-3 rounded-lg shadow-md w-14 h-14 flex flex-col items-center justify-center group hover:bg-blue-800 transition duration-200">
            <span className="text-xs text-blue-200 group-hover:text-white">🏷️</span>
            <span className="text-sm font-bold mt-1">{packageTypes}</span>
          </div>
          <div className="bg-blue-800/70 p-3 rounded-lg shadow-md w-14 h-14 flex flex-col items-center justify-center group hover:bg-blue-800 transition duration-200">
            <span className="text-xs text-blue-200 group-hover:text-white">💰</span>
            <span className="text-sm font-bold mt-1">${avgPrice}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageSidebar;