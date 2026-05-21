const ApiError = require('../utils/ApiError')
const generateId = require('../utils/idGenerator');
const User = require('../models/User');
const Patient = require('../models/Patient')
const Roles = require('../models/Roles')
const ROLE_PERMISSIONS = require('../constants/rolePermissions')
const sendEmail = require('../utils/sendEmail');
const bcrypt = require('bcrypt')
const jwt = require('../utils/jwt');
const crypto = require("crypto");
const ApiResponse = require('../utils/ApiResponse');
const {STATUS} = require('../constants/basic.constant')
const patientService = require('./patient.services');
const ROLES = require('../constants/role.constant');
const verifyUserByToken = async (token) => {

    if (!token) {
        throw new ApiError(400, "Verification token is required");
    }

    const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

    const user = await User.findOne({
        verificationToken: hashedToken,
        verificationTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
        throw new ApiError(400, 'Invalid or Expired verification token');
    }

    if (user.isVerified) {
        return {
            alreadyVerified: true,
            user
        };
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiry = null;
    user.status = STATUS.ACTIVE;

    const savedUser = await user.save();
    const patient = await patientService.createPatientByUserId(user._id);

    return {
        alreadyVerified: false,
        user: savedUser,
        patient
    };
};

const loginUser = async({email,password})=>{
    const user = await User.findOne({email}).select("+passwordHash");
    if(!user){
        throw new ApiError(401,"Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password,user.passwordHash);
    if(!isMatch){
        throw new ApiError(401,"Invalid credentials");
    }
    if(!user.isVerified){
        throw new ApiError(403,'Verify email before logging in');
    }
    user.lastLoginAt = new Date();
    
    const role = await Roles.findById(user.roleId);
    const permissions = role.roleName === ROLES.OWNER.roleName?["*"]:ROLE_PERMISSIONS[role.roleName];

    const token = jwt.generateToken({
        payload : {
            userId : user._id,
            roleName : role.roleName,
            permissions
        },
        type : jwt.tokenType.ACCESS,
    });
    await user.save();
    return {token : token,roleName: role.roleName, permissions : permissions};
}

module.exports = {verifyUserByToken, loginUser};