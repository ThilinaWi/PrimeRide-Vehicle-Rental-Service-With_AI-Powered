import React, { useState } from "react";
import Sidebar from "../../../common/Sidebar";
import VehicleTable from "../../components/vehicleManagement/vehicleManagementTableView/VehicleTable";
import CreateVehicle from "../../components/vehicleManagement/vehicleManagementCreate/CreateVehicle";

const VehicleDashboard = () => {
  const [activeTab, setActiveTab] = useState("vehicles");

  return (
    <div className="flex">
      {/* Sidebar (Fixed Position) */}
      <Sidebar setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-grow p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Vehicle Management</h1>

        {/* Conditionally Render Content Based on Active Tab */}
        {activeTab === "vehicles" && <VehicleTable />}
        {activeTab === "add-vehicle" && <CreateVehicle />}
      </div>
    </div>
  );
};

export default VehicleDashboard;
