const mongoose = require("mongoose");
const validator = require("validator");

const driverSchema = mongoose.Schema(
  {
    driver_id: {
      type: Number,
      required: [true, "Driver ID is required"],
      unique: true,
      min: [0, "Driver ID cannot be negative"],
    },
    full_name: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z\s]+$/.test(v);
        },
        message: "Full name can only contain letters",
      },
    },
    contact_number: {
      type: String,
      required: [true, "Contact number is required"],
      validate: {
        validator: function (v) {
          return /^0[1-9][0-9]{8}$/.test(v);
        },
        message: "Contact number must be 10 digits starting with 0",
      },
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    license_number: {
      type: String,
      required: [true, "License number is required"],
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9]{7}$|^[a-zA-Z0-9]{12}$/.test(v);
        },
        message: "License number must be 7 or 12 alphanumeric characters",
      },
    },
    license_class: {
      type: String,
      required: [true, "License class is required"],
      enum: ["light", "heavy", "motorcycle"],
      default: "light",
    },
    date_of_birth: {
      type: Date,
      required: [true, "Date of birth is required"],
      validate: {
        validator: function (v) {
          const minAgeDate = new Date();
          minAgeDate.setFullYear(minAgeDate.getFullYear() - 18);
          return v <= minAgeDate;
        },
        message: "Driver must be at least 18 years old",
      },
    },
    year_of_experience: {
      type: Number,
      required: [true, "Years of experience is required"],
      min: [0, "Years of experience cannot be negative"],
      max: [79, "Years of experience cannot be more than 79"],
    },
    availability_status: {
      type: String,
      required: [true, "Availability status is required"],
      enum: ["available", "unavailable"],
      default: "available",
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    emergency_contact: {
      type: String,
      required: [true, "Emergency contact is required"],
      validate: {
        validator: function (v) {
          return /^0[1-9][0-9]{8}$/.test(v);
        },
        message: "Emergency contact must be 10 digits starting with 0",
      },
    },
    driver_qualifications: {
      defensive_driving: { type: Boolean, default: false },
      first_aid: { type: Boolean, default: false },
      heavy_vehicle: { type: Boolean, default: false },
      passenger_endorsement: { type: Boolean, default: false },
    },
    custom_qualifications: [String],
    image_upload: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Driver = mongoose.model("Driver", driverSchema);
module.exports = Driver;
