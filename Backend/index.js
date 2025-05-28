// Import necessary packages
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const vehicleManagementRoutes = require("./routes/vehicleManagementRoute"); // Added vehicle routes
const driverRoutes = require("./routes/driverManagementRoute"); // Added driver routes
const packageRoutes = require("./routes/packageRoute"); // Added package routes
const connectDB = require("./config/database"); // Your DB connection function
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes"); // Added vehicle prediction routes

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

// Connect to MongoDB using connectDB function
connectDB(); // This will call the function to establish the DB connection

// Use routes
app.use("/", authRoutes); // Authentication routes
app.use("/", userRoutes); // User routes
app.use("/api/vehicles", vehicleManagementRoutes); // Vehicle management routes
app.use("/api/driver", driverRoutes); // Driver management routes
app.use("/api/vehiclesPred", vehicleRoutes); // Vehicle pedict routes
app.use("/api/packages", packageRoutes); // Package management routes

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export the Express app for testing
module.exports = app;
