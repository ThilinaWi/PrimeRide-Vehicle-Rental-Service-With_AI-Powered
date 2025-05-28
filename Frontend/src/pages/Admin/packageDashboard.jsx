import React, { useState } from "react";
import Sidebar from "../../../common/Sidebar";
import PackageTable from "../../components/packageManagement/packageList/packageList";
import CreatePackage from "../../components/packageManagement/createPackage/createPackage";
import PackageReport from "../../components/packageManagement/packageReport/packageReport";

const PackageDashboard = () => {
  const [activeTab, setActiveTab] = useState("packages");

  return (
    <div className="flex">
      <Sidebar setActiveTab={setActiveTab} />
      <div className="flex-grow p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Package Management</h1>
        {activeTab === "packages" && <PackageTable />}
        {activeTab === "add-package" && <CreatePackage />}
        {activeTab === "report" && <PackageReport />}
      </div>
    </div>
  );
};

export default PackageDashboard;