const express = require("express");
const {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
  generatePackageReport,
} = require("../controllers/packageController"); 

const router = express.Router();

// Routes
router.post("/", createPackage);
router.get("/", getAllPackages);
router.get("/report", generatePackageReport);
router.get("/:id", getPackageById);
router.put("/:id", updatePackage);
router.delete("/:id", deletePackage);


module.exports = router;
