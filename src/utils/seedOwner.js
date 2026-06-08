const bcrypt = require('bcrypt');
const User = require('../models/User')
const Roles = require('../models/Roles');
const ROLES = require('../constants/role.constant');
const ApiError = require('./ApiError');
const { STATUS } = require('../constants/basic.constant');
const seedOwner = async () => {
    try {
        const ownerRole = await Roles.findOne({roleId : ROLES.OWNER.roleId});
        
        if(!ownerRole){
            throw new ApiError(404,"Owner role not found");
        }
        const existingUser = await User.findOne({ email: 'owner@gmail.com' });
        if (existingUser) {        
            return;
        }
        const passwordHash = await bcrypt.hash('Owner@123', 12);
        const user = await User.create({
            firstName: 'Super',
            lastName: 'Owner',
            email: 'owner@gmail.com',
            phone: '9999999999',
            passwordHash,
            status:STATUS.ACTIVE,
            roleId: ownerRole._id,
            isVerified: true,
        });
    }
    catch (error) {
        if (error.code === 11000) {
            
        } else {
            throw error;
        }
    }
}
module.exports = seedOwner;