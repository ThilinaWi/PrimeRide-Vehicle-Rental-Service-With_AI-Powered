const mongoose = require("mongoose");

const packageSchema = mongoose.Schema(
  {
    package_id: {
      type: Number,
      required: true,
      unique: true,
    },
    package_name: {
      type: String,
      required: true,
    },
    package_type: {
      type: String,
      enum: ['Standard', 'Premium', 'Luxury', 'VIP'],
      required: true
    },
    duration: {  // e.g., ["24h", "3d", "1w"]
      type: [String],
      default: ["24h"],
    },
    price_per_day: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    vehicle_model: {
      type: String,
      required: true,
    },
    vehicle_number:{
      type: String,
      required: true,
    },
    seating_capacity: {
      type: Number,
      required: true,
    },
    luggage_capacity: {
      type: Number,
      required: true,
    },
    additional_features: {
      type: Map,
      of: Boolean,
      default: {
        professional_driver: false,
        unlimited_mileage: false,
        wifi_connectivity: false,
        child_safety_seat: false,
        floral_decorations: false,
        luxury_vehicle: false,
        gps_navigation: false,
        tinted_windows: false,
      }
    },
    safety_security_features: {
      type: Map,
      of: Boolean,
      default: {
        traction_control: false,
        gps_tracking: false,
        emergency_kit: false,
        first_aid_kit: false,
        roadside_assistance: false,
        anti_lock_braking_system: false,
        rearview_camera_parking_sensors: false,
        tyre_pressure_monitoring_system: false,
      }
    },
    custom_additional_features: [{
      type: String
    }],
    custom_safety_security_features: [{
      type: String
    }],
    image_upload: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Package", packageSchema);
