const Driver = require("../models/driverModel");
const fs = require("fs");
const path = require("path");

// Helper function to handle file uploads
const handleFileUpload = (file) => {
  if (!file) return null;
  const uploadDir = path.join(__dirname, "../uploads/drivers");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const filename = `driver-${Date.now()}${path.extname(file.originalname)}`;
  const filepath = path.join(uploadDir, filename);
  fs.writeFileSync(filepath, file.buffer);
  return `/uploads/drivers/${filename}`;
};

// Create a new driver
const createDriver = async (req, res) => {
  try {
    const driverData = req.body;

    // Handle file upload if exists
    if (req.file) {
      driverData.image_upload = handleFileUpload(req.file);
    }

    // Convert stringified fields back to objects if needed
    if (typeof driverData.driver_qualifications === "string") {
      driverData.driver_qualifications = JSON.parse(
        driverData.driver_qualifications
      );
    }
    if (typeof driverData.custom_qualifications === "string") {
      driverData.custom_qualifications = JSON.parse(
        driverData.custom_qualifications
      );
    }

    const driver = new Driver(driverData);
    const savedDriver = await driver.save();

    res.status(201).json({
      success: true,
      message: "Driver created successfully",
      data: savedDriver,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      errors: error.errors,
    });
  }
};

// Get all drivers with pagination and search
const getAllDrivers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (search) {
      query.$or = [
        { full_name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { driver_id: isNaN(search) ? 0 : parseInt(search) },
      ];
    }

    const drivers = await Driver.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Driver.countDocuments(query);

    res.status(200).json({
      success: true,
      data: drivers,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get driver by ID
const getDriverById = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }
    res.status(200).json({
      success: true,
      data: driver,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update driver
const updateDriver = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    const updates = req.body;

    // Handle file upload if exists
    if (req.file) {
      // Delete old image if exists
      if (driver.image_upload) {
        const oldImagePath = path.join(__dirname, "..", driver.image_upload);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updates.image_upload = handleFileUpload(req.file);
    }

    // Convert stringified fields back to objects if needed
    if (typeof updates.driver_qualifications === "string") {
      updates.driver_qualifications = JSON.parse(updates.driver_qualifications);
    }
    if (typeof updates.custom_qualifications === "string") {
      updates.custom_qualifications = JSON.parse(updates.custom_qualifications);
    }

    Object.assign(driver, updates);
    const updatedDriver = await driver.save();

    res.status(200).json({
      success: true,
      message: "Driver updated successfully",
      data: updatedDriver,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      errors: error.errors,
    });
  }
};

// Delete driver
const deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    // Delete associated image if exists
    if (driver.image_upload) {
      const imagePath = path.join(__dirname, "..", driver.image_upload);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.status(200).json({
      success: true,
      message: "Driver deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createDriver,
  getAllDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
};
