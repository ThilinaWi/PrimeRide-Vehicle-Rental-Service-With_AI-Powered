import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ProfileInfo from "../pages/User/ProfileInfo";
import axiosInstance from "../utils/axiosInstance";

const MainNavbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [userInfo, setUserInfo] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "token") {
        checkAuthStatus();
      }
    };

    const checkAuthStatus = () => {
      const tokenExists = !!localStorage.getItem("token");
      setIsLoggedIn(tokenExists);
      if (tokenExists) {
        fetchUserInfo();
      } else {
        setIsAdmin(false);
      }
    };

    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get("/get-user");
        if (response.data?.user) {
          setUserInfo(response.data.user);
          setIsAdmin(response.data.user.role === "admin"); // Adjust based on your role field
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    checkAuthStatus();

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate("/login");
  };

  // Admin navigation items
  const adminNavItems = [
    { path: "/admin/dashboard", label: "Admin Dashboard" },
    { path: "/package-management-dashboard", label: "Rental Package Management" },
    { path: "/vehicle-management-dashboard", label: "Vehicle Management" },
    { path: "/dashboardPred", label: "Health Report Generation" },
  ];

  // Regular user navigation items
  const userNavItems = [
    { path: "/", label: "Home" },
    { path: "/rent-package", label: "Rental Packages" },
    { path: "/vehicle-rent", label: "Vehicle Rent" },
    { path: "/predictions", label: "AI Prediction" },
    { path: "/view/about", label: "About Us" },
    { path: "/view/contact", label: "Contact Us" },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      {/* Top Bar - Logo and Profile */}
      <div className="container mx-auto px-6 py-3 flex justify-between items-center border-b border-gray-100">
        <Link
          to={isAdmin ? "/admin/dashboard" : "/"}
          className="text-3xl font-bold text-blue-600"
        >
          PrimeRide
        </Link>

        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <ProfileInfo
              userInfo={userInfo}
              onLogout={handleLogout}
              isAdmin={isAdmin}
            />
          ) : (
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
              onClick={() => navigate("/login")}
            >
              Login / Register
            </button>
          )}
        </div>
      </div>

      {/* Main Navigation - Different for Admin vs Regular Users */}
      <div className="bg-white py-4">
        <div className="container mx-auto px-6">
          <ul className="flex justify-center items-center space-x-8">
            {(isAdmin ? adminNavItems : userNavItems).map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="text-gray-700 hover:text-blue-600 font-medium text-lg px-4 py-2 transition duration-300"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default MainNavbar;
