const express = require("express");
const { 
    createVehiclePred, 
    getAllVehiclesPred, 
    getVehicleByIdPred, 
    updateVehiclePred, 
    deleteVehiclePred, 
    predictMaintenance  
} = require("../controllers/vehicleController");

const router = express.Router();

// 📌 Create a New Vehicle
router.post("/", createVehiclePred);

// 📌 Get All Vehicles
router.get("/", getAllVehiclesPred);

// 📌 Get a Single Vehicle by ID
router.get("/:id", getVehicleByIdPred);

// 📌 Update Vehicle by ID
router.put("/:id", updateVehiclePred);

// 📌 Delete Vehicle by ID
router.delete("/:id", deleteVehiclePred);

// 📌 Generate AI Prediction for a Vehicle
router.post("/:id/predict", predictMaintenance);

module.exports = router;
