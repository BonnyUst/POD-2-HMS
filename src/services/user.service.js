const ApiError = require('../utils/ApiError');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const Patient = require('../models/patient.model');
const Role = require('../models/role.model');
const generateId = require('../utils/idGenerator');
const { generateToken, tokenType } = require('../utils/jwt');

//SIGNUP PATIENT

const createPatientUser = async (userData) => {
    const {
        firstName,
        lastName,
        email,
        password,
        phone,
        gender,
        dob,
        bloodGroup,
        address,
        emergencyContactName,
        emergencyContactNumber,
    } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(409, 'User already exists with this email');
    }

    const role = await Role.findOne({ name: 'Patient' });
    if (!role) {
        throw new ApiError(500, 'Patient role not found in database');
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
        firstName,
        lastName,
        email,
        phone,
        passwordHash,
        roleId: role._id,
    });

    const UHID = await generateId({
        roleId: role._id,
        roleCode: role.code,
    });

    const patient = await Patient.create({
        userId: user._id,
        gender,
        dob,
        UHID,
        bloodGroup,
        address,
        emergencyContactName,
        emergencyContactNumber,
    });


    return {
        user: {
            id: user._id,
            UHID: patient.UHID,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            role: role.name,
        },
    };
};

//   LOGIN USER

const loginUser = async (email, password) => {
    const user = await User.findOne({ email }).populate('roleId');

    if (!user) {
        throw new ApiError(401, 'Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
        throw new ApiError(401, 'Invalid email or password');
    }

    const role = user.roleId;

    const accessToken = generateToken({
        payload: {
            userId: user._id,
            email: user.email,
            role: role.name,
        },
        type: tokenType.ACCESS,
    });

    return {
        accessToken,
        user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: role.name,
        },
    };
};

//   GET PROFILE

   
const getUserInfo = async (userId, role) => {
    const user = await User.findById(userId).populate('roleId');

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    let patientData = null;

    if (role === 'Patient') {
        patientData = await Patient.findOne({ userId });
    }

    return {
        user,
        patient: patientData,
    };
};

module.exports = {
    createPatientUser,
    loginUser,
    getUserInfo,
};