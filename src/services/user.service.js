const ApiError = require('../utils/ApiError');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const Patient = require('../models/patient.model');
const Role = require('../models/role.model');
const generateId = require('../utils/idGenerator');

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
        emergencyContactPhone,
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
        emergencyContactName: userData.emergencyContactName,
        emergencyContactNumber: emergencyContactPhone,
    });

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
        emergencyContactNumber: patient.emergencyContactNumber,
    };
};
module.exports = {
    createPatientUser,
}