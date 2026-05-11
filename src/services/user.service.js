const ApiError = require('../utils/ApiError');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const Patient = require('../models/patient.model')
const Role = require('../models/role.model');
const generateId = require('../utils/idGenerator');
const jwt = require('../utils/jwt');
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
        emergencyContactPhone
    } = userData;
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
        throw new ApiError(409, 'User already exists with this email');
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const role = await Role.findOne({ name: 'Patient' });
    const roleId = role._id;
    const user = await User.create({
        firstName,
        lastName,
        email,
        phone,
        passwordHash,
        roleId
    });
    const UHID = `${role.roleCode}-${generateId()}`;
    const patient = await Patient.create({
        userId: user._id,
        gender,
        dob,
        UHID,
        bloodGroup,
        address,
        emergencyContactName,
        emergencyContactPhone
    });
    const token = jwt.generateToken({
        payload: {
            userId: user._id,
        },
        type: jwt.tokenType.VERIFY_EMAIL,
    }
    );
    const verifyUrl = `http://localhost:3000/api/auth/verify?token=${token}`;
    console.log(`click this link to verify ${verifyUrl}`);
    return {
        UHID: patient.UHID,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        gender: patient.gender,
        dob: patient.dob,
        bloodGroup: patient.bloodGroup,
        address: patient.address,
        emergencyContactName: patient.emergencyContactName,
        emergencyContactPhone: patient.emergencyContactPhone,
    };
}
module.exports = {
    createPatientUser,
}