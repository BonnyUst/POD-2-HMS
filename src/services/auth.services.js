const ApiError = require('../utils/ApiError')
const generateId = require('../utils/idGenerator');
const User = require('../models/User');
const Patient = require('../models/Patient')
const Roles = require('../models/Roles')
const sendEmail = require('../utils/sendEmail');
const bcrypt = require('bcrypt')
const jwt = require('../utils/jwt');
const crypto = require("crypto");
const ApiResponse = require('../utils/ApiResponse');
const {STATUS} = require('../constants/basic.constant')
const patientService = require('./patient.services')
const verifyUserByToken = async (token) => {

    if (!token) {
        throw new ApiError(400, "Verification token is required");
    }

    const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

    const user = await User.findOne({
        verification_token: hashedToken,
        verification_token_expiry: { $gt: new Date() },
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

    user.is_verified = true;
    user.verification_token = null;
    user.verification_token_expiry = null;
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

    const token = jwt.generateToken({
        payload : {
            userId : user._id,
            role : role.roleName,
        },
        type : jwt.tokenType.ACCESS,
    });
    await user.save();
    return token;
}

module.exports = {verifyUserByToken, loginUser,}