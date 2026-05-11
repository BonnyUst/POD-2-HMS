const Counter = require('../models/counter.model');
const Role = require('../models/role.model');

const generateId = async ({ roleId, roleCode, padding = 6 }) => {
    const role = await Role.findById(roleId);

    if (!role) throw new Error("Role Not Found");

    const counterName = `${role.code}_ID`;

    const counter = await Counter.findOneAndUpdate(
        { name: counterName },
        {
            $inc: { seq: 1 },
            $setOnInsert: {
                name: counterName,
                seq: 0,
            },
        },
        { new: true, upsert: true }
    );

    const formattedSeq = String(counter.seq).padStart(padding, "0");

    return `${roleCode}-${formattedSeq}`;
};

module.exports = generateId;