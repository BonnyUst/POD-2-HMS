const mongoose = require('mongoose')
const generateId = require('../utils/idGenerator');

const employeeSchema = new mongoose.Schema(
    {
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true,
        },
        employeeId : {
            type : String,
            required : true,
            unique : true,
            trim : true,
            uppercase : true,
        },
        departmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Departments',
            required: true,
        },

        designation : {
            type : String,
            required : true,
            trim : true,
        },
        joiningDate : {
            type : Date,
            required : true,
        },
    },
    {
        timestamps : true,
    },
);
module.exports = mongoose.model("Employee", employeeSchema)





