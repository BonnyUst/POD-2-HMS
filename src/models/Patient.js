const mongoose = require('mongoose')
const {GENDER } = require('../constants/basic.constant')
const {BLOOD_GROUP} = require('../constants/hms.constant')
const patientSchema = new mongoose.Schema(
    {
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User',
            required : true,
            unique : true,
        },
        UHID : {
            type : String,
            required : true,
            unique : true,
            trim : true,
            uppercase : true,
        },
        gender : {
            type : String,
            enum : Object.values(GENDER),
            default : null,
        },
        dob : {
            type : Date,
            default : null,
        },
        bloodGroup : {
            type : String,
            enum : Object.values(BLOOD_GROUP),
            default : null,
        },
        address : {
            street : {
                type : String,
                default : null,
            },
            city : {
                type : String,
                default : null,
            },
            state : {
                type : String,
                default : null,
            },
            pincode : {
                type:Number,
                default : null,
            },
        },
        emgContName : {
            type : String,
            default : null,
        },
        emgContPhone : {
            type : String,
            default : null,
        },
        isProfileCompleted : {
            type : Boolean,
            default : false,
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps : true,
    }
);

module.exports = mongoose.model('Patient',patientSchema);
