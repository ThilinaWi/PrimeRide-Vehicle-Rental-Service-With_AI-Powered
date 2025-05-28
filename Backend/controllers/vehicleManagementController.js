const VehicleManagement = require("../models/vehicleManagementModel");
const multer = require("multer");
const path = require("path");

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb("Error: Images only (jpeg, jpg, png)");
  },
}).single("image_upload");

// Create a new vehicle
exports.createVehicle = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err });
    }

    try {
      const {
        vehicle_number,
        vehicle_type,
        brand,
        year_of_manufacture,
        seating_capacity,
        fuel_type,
        transmission_type,
        daily_rate,
        additional_features,
        safety_features,
        custom_additional_features,
        custom_safety_features,
      } = req.body;

      // Parse JSON strings if they come as strings
      const additionalFeatures =
        typeof additional_features === "string"
          ? JSON.parse(additional_features)
          : additional_features;
      const safetyFeatures =
        typeof safety_features === "string"
          ? JSON.parse(safety_features)
          : safety_features;
      const customAdditionalFeatures =
        typeof custom_additional_features === "string"
          ? JSON.parse(custom_additional_features)
          : custom_additional_features;
      const customSafetyFeatures =
        typeof custom_safety_features === "string"
          ? JSON.parse(custom_safety_features)
          : custom_safety_features;

      // Check if vehicle_number already exists
      const existingVehicle = await VehicleManagement.findOne({
        vehicle_number,
      });
      if (existingVehicle) {
        return res
          .status(400)
          .json({ message: "Vehicle number already exists" });
      }

      const vehicleData = {
        vehicle_number,
        vehicle_type,
        brand,
        year_of_manufacture,
        seating_capacity,
        fuel_type,
        transmission_type,
        daily_rate,
        additional_features: additionalFeatures,
        safety_features: safetyFeatures,
        custom_additional_features: customAdditionalFeatures,
        custom_safety_features: customSafetyFeatures,
        image_upload: req.file ? req.file.path : "",
      };

      const newVehicle = new VehicleManagement(vehicleData);
      await newVehicle.save();

      return res.status(201).json({
        message: "Vehicle created successfully",
        vehicle: newVehicle,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  });
};

// Get all vehicles
exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await VehicleManagement.find().sort({ createdAt: -1 });
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get vehicle by ID
exports.getVehicleById = async (req, res) => {
  try {
    const vehicle = await VehicleManagement.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Update vehicle
exports.updateVehicle = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err });
    }

    try {
      const {
        additional_features,
        safety_features,
        custom_additional_features,
        custom_safety_features,
        ...updateData
      } = req.body;

      // Parse JSON strings if they come as strings
      if (additional_features) {
        updateData.additional_features =
          typeof additional_features === "string"
            ? JSON.parse(additional_features)
            : additional_features;
      }
      if (safety_features) {
        updateData.safety_features =
          typeof safety_features === "string"
            ? JSON.parse(safety_features)
            : safety_features;
      }
      if (custom_additional_features) {
        updateData.custom_additional_features =
          typeof custom_additional_features === "string"
            ? JSON.parse(custom_additional_features)
            : custom_additional_features;
      }
      if (custom_safety_features) {
        updateData.custom_safety_features =
          typeof custom_safety_features === "string"
            ? JSON.parse(custom_safety_features)
            : custom_safety_features;
      }

      if (req.file) {
        updateData.image_upload = req.file.path;
      }

      const vehicle = await VehicleManagement.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }

      res.status(200).json({
        message: "Vehicle updated successfully",
        vehicle,
      });
    } catch (error) {
      res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  });
};

// Delete vehicle
exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await VehicleManagement.findByIdAndDelete(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    res.status(200).json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
