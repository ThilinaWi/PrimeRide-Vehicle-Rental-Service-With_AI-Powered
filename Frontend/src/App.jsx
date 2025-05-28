import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import React, { useState, useEffect } from "react";
import Home from "./pages/Home/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import MainNavbar from "./components/MainNavbar";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ProfileStats from "./pages/User/ProfileStats";
import UserController from "./pages/User/UserController";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import NotFound from "./components/NotFound";
import Footer from "./components/footer";
import AdminPredictions from "./pages/Admin/AdminPredictions";
import AddVehicle from "./pages/Admin/AddVehicle";
import VehicleDetails from "./pages/User/VehicleDetails";
import CreateVehicle from "./components/vehicleManagement/vehicleManagementCreate/CreateVehicle";
import VehicleTable from "./components/vehicleManagement/vehicleManagementTableView/VehicleTable";
import DriverTable from "./components/driver/driverTableView/driverTableView";
import CreateDriver from "./components/driver/driverCreate/driverCreate";
import CreatePackage from "./components/packageManagement/createPackage/createPackage";
import PackageTable from "./components/packageManagement/packageList/packageList";
import PackageReport from "./components/packageManagement/packageReport/packageReport";
import PackageSidebar from "../common/packageSidebar";
import PackDashboard from "../common/packageDasboard/pDashboard";
import PackageDashboard from "./pages/Admin/packageDashboard";
import Sidebar from "../common/Sidebar";
import Dashboard from "../common/dashboard/dashboard";
import DashboardPred from "../common/dashboard/dashbordPred";
import VehicleDashboard from "./pages/Admin/VehicleDashboard";
import * as driverService from "./services/driverSrvice";
import { vehicleService } from "./services/vehicleService";
import { packageService } from "./services/packageService";
import UserVehicleDashboard from "./components/UserVehicleDashboard/UserVehicleDashboard";
import AllPredictions from "./pages/User/AllPredictions";
import UserPackageDashboard from "./components/UserPackageDashboard/UserPackage"


// Admin Layout Component with Sidebar
const AdminLayout = ({ children, drivers, vehicles }) => {
  return (
    <div className="flex">
      <Sidebar drivers={drivers} vehicles={vehicles} />
      <div className="flex-grow p-6 bg-gray-100 min-h-screen ml-72">
        {children}
      </div>
    </div>
  );
};
const AdminLayoutSidebar = ({ packages, children }) => {
  return (
    <div className="flex">
      <PackageSidebar packages={packages} />
      <div className="flex-grow p-6 bg-gray-100 min-h-screen ml-72">
        {children}
      </div>
    </div>
  );
};

function App() {
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [packages, setPackages] = useState([]);
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // For drivers - extract .data from response
        const driversRes = await driverService.getAllDrivers();
        setDrivers(driversRes.success ? driversRes.data : []);

        // For vehicles - direct array
        const vehiclesRes = await vehicleService.getAllVehicles();
        setVehicles(Array.isArray(vehiclesRes) ? vehiclesRes : []);

        // For packages - direct array
        const packagesRes = await packageService.getAllPackages();
        setPackages(Array.isArray(packagesRes) ? packagesRes : []);
      } catch (error) {
        console.error("Fetch error:", error);
        setDrivers([]);
        setVehicles([]);
        setPackages([]);
      }
    };

    fetchData();
  }, []);

  const login = (id) => {
    localStorage.setItem("userId", id);
    setUserId(id);
  };

  const logout = () => {
    localStorage.removeItem("userId");
    setUserId(null);
  };

  return (
    <Router>
      <div
        className="flex flex-col min-h-screen"
        style={{ backgroundColor: "#f7f7f7" }}
      >
        <MainNavbar userId={userId} logout={logout} />

        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route index element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/view/about" element={<About />} />
            <Route path="/view/contact" element={<Contact />} />
            <Route path="/login" element={<Login login={login} />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* Protected Routes */}
            <Route path="/profile-stats" element={<ProfileStats />} />
            <Route path="/profile-stats/:userId" element={<ProfileStats />} />
            <Route path="/admin/usercontroller" element={<UserController />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            {/* user pred Routes */}
            <Route path="/vehicledetails" element={<VehicleDetails />} />
            <Route path="/predictions" element={<AllPredictions />} />

            {/* Admin vehicle pred Routes with Sidebar */}
            <Route path="/addvehiclePred" element={<AddVehicle />} />
            <Route path="/dashboardPred" element={<DashboardPred />} />
            <Route path="/admin/predictions" element={<AdminPredictions />} />

            {/* Admin Management Routes with Sidebar */}
            <Route
              path="/vehicle-management-dashboard"
              element={
                <AdminLayout drivers={drivers} vehicles={vehicles}>
                  <Dashboard drivers={drivers} vehicles={vehicles} />
                </AdminLayout>
              }
            />
            <Route
              path="/admin-vehicles"
              element={
                <AdminLayout drivers={drivers} vehicles={vehicles}>
                  <VehicleDashboard />
                </AdminLayout>
              }
            />
            <Route
              path="/create-vehicle"
              element={
                <AdminLayout drivers={drivers} vehicles={vehicles}>
                  <CreateVehicle />
                </AdminLayout>
              }
            />
            <Route
              path="/driver-table"
              element={
                <AdminLayout drivers={drivers} vehicles={vehicles}>
                  <DriverTable />
                </AdminLayout>
              }
            />
            <Route
              path="/vehicle-table"
              element={
                <AdminLayout drivers={drivers} vehicles={vehicles}>
                  <VehicleTable />
                </AdminLayout>
              }
            />
            <Route
              path="/create-driver"
              element={
                <AdminLayout drivers={drivers} vehicles={vehicles}>
                  <CreateDriver />
                </AdminLayout>
              }
            />

            <Route path="/vehicle-rent" element={<UserVehicleDashboard />} />
            <Route path="/rent-package" element={<UserPackageDashboard />} />

            {/* Admin Management Routes with Sidebar */}
            <Route
              path="/package-management-dashboard"
              element={
                <AdminLayoutSidebar packages={packages}>
                  <PackDashboard packages={packages} />
                </AdminLayoutSidebar>
              }
            />
            <Route
              path="/admin-packages"
              element={
                <AdminLayoutSidebar packages={packages}>
                  <PackageDashboard />
                </AdminLayoutSidebar>
              }
            />
            <Route
              path="/create-package"
              element={
                <AdminLayoutSidebar packages={packages}>
                  <CreatePackage />
                </AdminLayoutSidebar>
              }
            />
            <Route
              path="/package-table"
              element={
                <AdminLayoutSidebar packages={packages}>
                  <PackageTable />
                </AdminLayoutSidebar>
              }
            />
            <Route
              path="/package-report"
              element={
                <AdminLayoutSidebar packages={packages}>
                  <PackageReport />
                </AdminLayoutSidebar>
              }
            />
            {/* Catch-all for 404 */}
            <Route path="*" element={<NotFound />} />

            <Route path="/vehicle-rent" element={<UserVehicleDashboard />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;