const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
        },
        name: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
        }
    },
    {
        timestamps: {
            createdAt: "created_at",
        },
    },
);

module.exports = mongoose.model('Role', roleSchema);