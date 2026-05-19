const mongoose = require('mongoose')

const departmentSchema = new mongoose.Schema(
    {
        deptId : {
            type : String,
            required : true,
            unique : true,
            trim : true,
            uppercase : true,
        },
        deptName : {
            type : String,
            required : true,
            unique : true,
            trim : true,
            uppercase : true,
        },
        adminIds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
    },
    {
        timestamps : true,
    },
);

module.exports = mongoose.model("Departments", departmentSchema);
