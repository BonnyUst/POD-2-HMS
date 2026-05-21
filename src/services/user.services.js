const ApiError = require('../utils/ApiError')
const generateId = require('../utils/idGenerator');
const User = require('../models/User');
const Patient = require('../models/Patient')
const Roles = require('../models/Roles')
const bcrypt = require('bcrypt')
const jwt = require('../utils/jwt');
const crypto = require("crypto");
const { STATUS } = require('../constants/basic.constant');
const ROLES = require('../constants/role.constant');
const sendEmail = require('../utils/sendEmail')

const createAuthUser = async (data) => {
    const {
        firstName,
        lastName,
        email,
        phone,
        password
    } = data;

    // 1. Create basic user
    const user = await createBasicUser({ firstName, lastName, email,phone, password });

    try {
        // 2. Get role
        const role = await Roles.findOne({ roleId: ROLES.PATIENT.roleId });
        if (!role) {
            throw new ApiError(404, 'Role not found');
        }

        // 3. Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        const hashedToken = crypto
            .createHash('sha256')
            .update(verificationToken)
            .digest('hex');

        const verificationTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

        // 4. UPDATE existing user (IMPORTANT FIX)
        user.phone = phone;
        user.roleId = role._id;
        user.verificationToken = hashedToken;
        user.verificationTokenExpiry = verificationTokenExpiry;

        await user.save();

        // 5. Verify URL
        const verifyUrl = `${process.env.FRONTEND_URL}/api/auth/verify-email?token=${verificationToken}`;
        console.log(`Click this link to verify ${verifyUrl}`);

        await sendEmail({
            to: email,
            subject: "HMS - Verify your email",
            html: `
                <h2>Welcome to HMS</h2>

                <p>Your account has been created and but not verified.</p>

                <p>Click this link to verify :${verifyUrl} </p>
            `,
        });


        return user;

    } catch (err) {
        // 🔥 rollback
        await User.findByIdAndDelete(user._id);
        throw err;
    }
};

const createBasicUser = async(userDetails)=>{
    const {
        firstName,
        lastName,
        email,
        phone,
        password,
    } = userDetails;
    const existingUser = await User.findOne({email});
    if(existingUser){
        throw new ApiError(409,"User already exists with this email");
    }
    const passwordHash = await bcrypt.hash(password,12);
    const newUser = new User({
        firstName,
        lastName,
        email,
        phone,
        passwordHash,
        status : STATUS.INACTIVE
    });
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

module.exports = { createAuthUser,createBasicUser, getMyInfo };