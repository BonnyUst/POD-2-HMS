const mongoose = require('mongoose');

const patient = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true
        },
        UHID: {
            type: String,
            unique: true,
            required: true
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
        },
        address: {
            type: String,
            trim: true
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
    }
);

module.exports = mongoose.model('Patient', patient);