const express = require("express");
const router = express.Router();
const {
  createDriver,
  getAllDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
} = require("../controllers/driverController");
const multer = require("multer");
const path = require("path");

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only JPEG, JPG, and PNG images are allowed"));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Route to create a new driver with file upload
router.post("/", upload.single("driver_image"), createDriver);

// Route to get all drivers with pagination
router.get("/", getAllDrivers);

// Route to get a specific driver by ID
router.get("/:id", getDriverById);

// Route to update a driver with optional file upload
router.put("/:id", upload.single("driver_image"), updateDriver);

// Route to delete a driver
router.delete("/:id", deleteDriver);

module.exports = router;
