const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        UHID: {
            type: String,
            unique: true,
            required: true,
        },
        gender: {
            type: String,
            uppercase: true,
            enum: ["MALE","FEMALE","OTHER"],
            required: true,
        },
        dob: {
            type: Date,
            required: true,
        },
        bloodGroup: {
            type: String,
            enum: [
                "A+",
                "A-",
                "B+",
                "B-",
                "AB+",
                "AB-",
                "O+",
                "O-",
            ],
            uppercase: true,
            required: true,
            trim: true
        },
        address: {
            city: {
                type: String,
                required: true,
                trim: true,
            },
            state: {
                type: String,
                required: true,
                trim:true,
            },
            pincode: {
                type: String,
                required: true,
                trim: true,
                match: [/^[0-9]{6}$/, "Invalid pincode format"],
            }
        },
        emergencyContactName: {
            type: String,
            required: true,
            trim: true,
        },
        emergencyContactNumber: {
            type: String,
            required: true,
            trim: true,
            match: [/^\d{10}$/, "Invalid phone number"] // 10-digit (India)
        },        
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    },
);

module.exports = mongoose.model('Patient',patientSchema);