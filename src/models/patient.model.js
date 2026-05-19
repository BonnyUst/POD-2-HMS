const mongoose = require("mongoose");

const patient = mongoose.Schema(
  {
    UHID: {
      type: String,
      unique: true,
      required: true,
    },
    fullName: {
      type: String,
      required: [true, "patient name is required"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: [true, "phone is required"],
    },
    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHER"],
      required: true,
      uppercase: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    address: {
      type: String,
      trim: true,
    },
    emergencyContactName: {
      type: String,
      trim: true,
    },

    emergencyContactPhone: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Patient", patient);
