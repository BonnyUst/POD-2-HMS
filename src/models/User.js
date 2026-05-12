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
            required : true,
            unique : true,
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
            required : true,
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
        reset_token: { type: String, default: null },
        reset_token_expiry: { type: Date, default: null },
        is_verified: { type: Boolean, default: false },
        verification_token: { type: String, default: null },
        verification_token_expiry: { type: Date, default: null },
        lastLoginAt : {
            type : Date,
            default : null,
        },
    },{
       timestamps : true, 
    }
);

module.exports = mongoose.model('User',userSchema);