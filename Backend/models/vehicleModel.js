const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lastServiceDate: { type: String, required: true },
    mileage: { type: Number, required: true },
    tireWear: { type: Number, required: true },
    engineHealth: { type: Number, required: true },
    brakeWear: { type: Number, required: true },
    oilViscosity: { type: Number, required: true },
    coolantLevel: { type: Number, required: true },
    prediction: { type: Object } // Stores AI Prediction
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);
module.exports = Vehicle;
