const Counter = require('../models/Counter');

const generateId = async (roleCode) => {
    const year = new Date().getFullYear();
    const shortYear = String(year).slice(-2);

    const counter = await Counter.findOneAndUpdate(
        { name: roleCode, year },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );

    return `${roleCode}-${shortYear}${String(counter.seq).padStart(4, '0')}`;
};

module.exports = generateId;