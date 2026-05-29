const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
    {
        employeeId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Employee",
            required : true,
        },
        medRegNo : {
            type : String,
            required : true,
            unique : true,
            trim : true,
            uppercase:true,
        },
        specialization : {
            type : String,
            required : true,
            trim : true,
        },
        qualification : {
            type : String,
            required : true,
            trim : true,
        },
        consultationFee : {
            type : Number,
            required : true,
            min : 300,
        },
        avlblStartTime : {
            type : String,
            default : null,
        },
        avlblEndTime : {
            type : String,
            default : null,
        },
        expYears : {
            type : Number,
            required : true,
            min : 0,
        },
    },
    {
        timestamps : true,
    }
);

module.exports = mongoose.model('Doctor', doctorSchema);
