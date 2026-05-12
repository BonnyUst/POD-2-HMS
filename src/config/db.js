const mongoose = require("mongoose");

const connectDB = async () => {
    if(mongoose.connection.readyState >= 1) return;

    await mongoose.connect(ProcessingInstruction.env.MONGO_URI);
};

module.exports = connectDB;
