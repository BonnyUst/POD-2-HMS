const mongoose = require("mongoose");

const doctorSchema = new mongoose.schema(
    {
        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            required: true,
        },
        medicalRegistrationNo: {
            type: String,
            unique: true,
            trim: true,
            uppercase: true,
            required: true,
        },
        specialization: {
            type: String,
            required: true,
            trim: true,
        },
        qualification: {
            type: String,
            required: true,
            trim: true,
        },
        consultationFee: {
            type: Number,
            required: true,
        },
        availabilityStartTime: {
            type: String,
            required: [true, "Availability start time is required"],
            trim: true,
            match: [/^([01]\d|2[0-3]):([0-5]\d)$/,"Invalid start time format"]
        },
        availabilityEndTime: {
            type: String,
            required: [true, "Availability end time is required"],
            trim: true,
            match: [/^([01]\d|2[0-3]):([0-5]\d)$/,"Invalid end time format"]
        },
        experienceYears: {
            type: String,
            required: true,
            trim: true,
        }
    },
    {
        timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at",
        },
    },
);

module.exports = mongoose.model('Doctor',doctorSchema);