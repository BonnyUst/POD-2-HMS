const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
    {
        deptId: {
            type: String,
            required: true,
            uppercase: true,
            unique: true,
            trim: true,
        },
        deptName: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
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

module.exports = mongoose.model("Dept",departmentSchema);