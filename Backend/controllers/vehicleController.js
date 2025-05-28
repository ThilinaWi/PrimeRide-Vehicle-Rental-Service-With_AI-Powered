const Vehicle = require("../models/vehicleModel");
const axios = require("axios");

// 📌 Create a New Vehicle
exports.createVehiclePred = async (req, res) => {
    try {
        const { name, lastServiceDate, mileage, tireWear, engineHealth, brakeWear, oilViscosity, coolantLevel } = req.body;

        const vehicle = new Vehicle({
            name,
            lastServiceDate,
            mileage,
            tireWear,
            engineHealth,
            brakeWear,
            oilViscosity,
            coolantLevel
        });

        await vehicle.save();
        res.status(201).json({ message: "✅ Vehicle added successfully!", vehicle });
    } catch (error) {
        res.status(500).json({ message: "❌ Failed to add vehicle", error: error.message });
    }
};

// 📌 Get All Vehicles
exports.getAllVehiclesPred = async (req, res) => {
    try {
        const vehicles = await Vehicle.find();
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ message: "❌ Failed to fetch vehicles", error: error.message });
    }
};

// 📌 Get a Single Vehicle by ID
exports.getVehicleByIdPred = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ message: "❌ Vehicle not found" });
        }
        res.json(vehicle);
    } catch (error) {
        res.status(500).json({ message: "❌ Invalid Vehicle ID Format" });
    }
};

// 📌 Update Vehicle by ID
exports.updateVehiclePred = async (req, res) => {
    try {
        const updatedVehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedVehicle) {
            return res.status(404).json({ message: "❌ Vehicle not found" });
        }
        res.json({ message: "✅ Vehicle updated successfully!", updatedVehicle });
    } catch (error) {
        res.status(500).json({ message: "❌ Failed to update vehicle", error: error.message });
    }
};

// 📌 Delete Vehicle by ID
exports.deleteVehiclePred = async (req, res) => {
    try {
        const deletedVehicle = await Vehicle.findByIdAndDelete(req.params.id);
        if (!deletedVehicle) {
            return res.status(404).json({ message: "❌ Vehicle not found" });
        }
        res.json({ message: "✅ Vehicle deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "❌ Failed to delete vehicle", error: error.message });
    }
};

// 📌 Generate AI Prediction & Save in MongoDB
exports.predictMaintenance = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ message: "❌ Vehicle not found" });
        }

        // Send request to AI Model
        const response = await axios.post("http://127.0.0.1:8000/predict", {
            lastServiceDate: vehicle.lastServiceDate,
            mileage: vehicle.mileage,
            tireWear: vehicle.tireWear,
            engineHealth: vehicle.engineHealth,
            brakeWear: vehicle.brakeWear,
            oilViscosity: vehicle.oilViscosity,
            coolantLevel: vehicle.coolantLevel
        });

        // Save prediction inside vehicle document
        vehicle.prediction = response.data;
        await vehicle.save();

        res.json({ message: "✅ Prediction saved successfully!", prediction: response.data });
    } catch (error) {
        res.status(500).json({ message: "❌ Failed to generate prediction", error: error.message });
    }
};
