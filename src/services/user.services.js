const ApiError = require('../utils/ApiError')
const generateId = require('../utils/idGenerator');
const User = require('../models/User');
const Patient = require('../models/Patient')
const Roles = require('../models/Roles')
const sendEmail = require('../utils/sendEmail');
const bcrypt = require('bcrypt')
const jwt = require('../utils/jwt');
const crypto = require("crypto");

const createUser = async (data) => {
    const {
        firstName,
        lastName,
        email,
        phone,
        password
    } = data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(409, 'User already exists with this email');
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const role = await Roles.findOne({ roleName: 'PATIENT' });
    if (!role) {
        throw new ApiError(404, 'Role not found');
    }

    const roleId = role._id;

    const verification_token = crypto.randomBytes(32).toString('hex');
    const verification_token_expiry = new Date(
        Date.now() + 60 * 60 * 1000,
    );
    const hashedToken = crypto
    .createHash('sha256')
    .update(verification_token)
    .digest('hex');

    const newUser = new User({
        firstName,
        lastName,
        email,
        phone,
        passwordHash,
        roleId,
        status: "INACTIVE",
        verification_token:hashedToken,
        verification_token_expiry,
    });
    //need to change hashed token in url 
    const verifyUrl = `${process.env.FRONTEND_URL}/api/auth/verify-email?token=${verification_token}`;
    console.log(`Click this link to veify ${verifyUrl}`);

    return await newUser.save();

}

const getMyInfo = async(userId,role)=>{

    const user = await User.findById(userId);
    if(!user){
        throw new ApiError(404,"User not found");
    }
    const profile = await Patient.findOne({userId});
    if(!profile){
        throw new ApiError(404,'Profile not found');
    }
    return {user,profile};
}

module.exports = { createUser, getMyInfo };