const mongoose = require("mongoose");

const vehicleManagementSchema = mongoose.Schema(
  {
    vehicle_number: {
      type: String,
      required: [true, "Vehicle number is required"],
      unique: true, // This automatically creates an index, so no need for separate index()
      trim: true,
    },
    vehicle_type: {
      type: String,
      required: [true, "Vehicle type is required"],
      enum: ["Scooty", "CT100", "Car", "Van"],
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
      trim: true,
    },
    year_of_manufacture: {
      type: Number,
      required: [true, "Year of manufacture is required"],
      min: [1900, "Year must be after 1900"],
      max: [new Date().getFullYear(), `Year can't be in the future`],
    },
    seating_capacity: {
      type: Number,
      required: [true, "Seating capacity is required"],
      min: [1, "Seating capacity must be at least 1"],
    },
    fuel_type: {
      type: String,
      required: [true, "Fuel type is required"],
      enum: ["Petrol", "Diesel", "Electric", "Hybrid"],
    },
    transmission_type: {
      type: String,
      required: [true, "Transmission type is required"],
      enum: ["Manual", "Automatic"],
    },
    daily_rate: {
      type: Number,
      required: [true, "Daily rate is required"],
      min: [0, "Daily rate can't be negative"],
      max: [350, "Maximum daily rate is 350"],
    },
    image_upload: {
      type: String,
      required: [true, "Vehicle image is required"],
    },
    additional_features: {
      air_conditioning: { type: Boolean, default: false },
      navigation_system: { type: Boolean, default: false },
      bluetooth: { type: Boolean, default: false },
      sunroof: { type: Boolean, default: false },
    },
    safety_features: {
      abs: { type: Boolean, default: false },
      airbags: { type: Boolean, default: false },
      parking_sensors: { type: Boolean, default: false },
      stability_control: { type: Boolean, default: false },
    },
    custom_additional_features: [
      {
        type: String,
        trim: true,
      },
    ],
    custom_safety_features: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Only define indexes for fields that don't already have unique/other index options
vehicleManagementSchema.index({ vehicle_type: 1 });
vehicleManagementSchema.index({ brand: 1 });
vehicleManagementSchema.index({ daily_rate: 1 });

// Removed the duplicate index for vehicle_number since unique: true already creates it

module.exports = mongoose.model("VehicleManagement", vehicleManagementSchema);
