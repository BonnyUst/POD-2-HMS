const User = require('../models/User.model')
const RoleModel = require('../models/Role.model');
const ApiResponse = require('../utils/ApiResponse');
const Patient = require('../models/Patient.model')
const bcrypt = require('bcrypt');
const generateId=require('../utils/idGenerator')
const ApiError=require('../utils/ApiError');

exports.createPatientUser = async (userData) => {
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

    const existingUser = await User.findOne({
        email
    });

    if (existingUser) {
       throw new ApiError(409, 'User already exists with this email');
    }

    const role = await RoleModel.findOne({ name: 'Patient' });
    
    if (!role) {
        throw new ApiError(404, 'Patient role Not Found');
    }
   
    // const passwordHash = await bcrypt.hash(password,32);
    const passwordHash = 'asdfsdfasdgasdgasdg';
    
    const user = await User.create({
        firstName,
        lastName,
        email,
        phone,
        passwordHash,
        roleId: role._id
    });

    const UHID = `${role.roleCode}-${generateId()}`;

    console.log("ROLE:", role);
console.log("ROLE CODE:", role.roleCode);
// console.log("GENERATED ID:", generateId());
console.log("UHID:", UHID);
    const patient = await Patient.create({
        userId: user._id,
        UHID,
        gender,
        dob,
        bloodGroup,
        address,
        emergencyContactName,
        emergencyContactPhone
    });

    return {
        UHID: patient.UHID,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        gender: patient.gender,
        bloodGroup: patient.bloodGroup,
        address: patient.address,
        emergencyContactName: patient.emergencyContactPhone,
        emergencyContactPhone: patient.emergencyContactPhone
    };
}
