const mongoose = require('mongoose')
const {STATUS } = require('../constants/basic.constant')

const userSchema = new mongoose.Schema(
    {
        firstName : {
            type : String,
            required : true,
            trim : true,
        },
        lastName : {
            type : String,
            required : true,
            trim : true,
        },
        email : {
            type : String,
            required : true,
            trim : true,
            lowercase : true,
            unique : true,
        },
        phone : {
            type : String,
            unique : true,
            required : true,
            trim : true,
            match : [/^\d{10}$/, "Invalid phone number"],
        },
        passwordHash : {
            type: String,
            required : true,
            select:false,
        },
        roleId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Roles',
        },
        status : {
            type : String,
            enum : Object.values(STATUS),
            required : true,
        },
        isVerified : {
            type : Boolean,
            default : false,
        },
        resetToken: { type: String, default: null },
        resetTokenExpiry: { type: Date, default: null },
        isVerified: { type: Boolean, default: false },
        verificationToken: { type: String, default: null },
        verificationTokenExpiry: { type: Date, default: null },
        lastLoginAt : {
            type : Date,
            default : null,
        },
    },{
       timestamps : true, 
    }
);

module.exports = mongoose.model('User',userSchema);