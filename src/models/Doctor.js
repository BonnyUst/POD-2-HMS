const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
    {
        employeeId : {
            type : String,
            required : true,
            unique : true,
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
            min : 0,
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

doctorSchema.pre('save', async function () {
  if (this.isNew) {
    this.employeeCode = await generateId('Doctor', 'DOC');
  }
});