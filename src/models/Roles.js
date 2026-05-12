const mongoose = require('mongoose')

const roleSchema = new mongoose.Schema(
    {
        roleId : {
            type:String,
            required : true,
            unique : true,
            trim : true,
            uppercase : true,
        },
        roleName : {
            type : String,
            required : true,
            trim : true,
            unique : true,
            uppercase : true,
        }
    },
    {
        timestamps : {
            createdAt : 'created_at',
            updatedAt : 'updated_at',
        },
    }
);

module.exports = mongoose.model('Roles',roleSchema);