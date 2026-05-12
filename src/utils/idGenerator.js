const Counter = require('../models/counter.model');
const Role = require('../models/role.model');

const generateId = async ({ roleId, roleCode, padding = 6 }) => {

    const role = await Role.findById(roleId);

    if (!role) {
        throw new Error("Role not found");
    }

    const counter = await Counter.findOneAndUpdate(
        { roleId }, // find by roleId
        {
            $inc: { seq: 1 },
            $setOnInsert: {
                roleCode,
            },
        },
        {
            new: true,
            upsert: true,
        }
    );

    const formattedSeq = String(counter.seq).padStart(
        padding,
        "0"
    );

    return `${roleCode}-${formattedSeq}`;
};

module.exports = generateId;