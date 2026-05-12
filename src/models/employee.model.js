const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        employeeCode:{
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        deptId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Dept",
            required: true,
        },
        designation: {
            type: String,
            required: true,
            trim: true,
        },
        joiningDate: {
            type: Date,
            required: true,
        }
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    },
);

module.exports = mongoose.model('Employee',employeeSchema);