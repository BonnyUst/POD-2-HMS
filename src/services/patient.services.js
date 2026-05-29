const ApiError = require('../utils/ApiError')
const generateId = require('../utils/idGenerator');
const User = require('../models/User')
const Patient = require('../models/Patient')
const Roles = require('../models/Roles')
const userService = require('./user.services');
const { STATUS } = require('../constants/basic.constant');

const createPatientByUserId = async(userId)=>{
    const role = await Roles.findOne({roleName : "PATIENT"});
    if(!role){
        throw new ApiError(404,'Role not found');
    }

    const UHID = await generateId(role.roleId);
    const existingPatient = await Patient.findOne({userId})
    if(existingPatient){
        throw new ApiError(409,'Patient already exists');
    }

    const patient = new Patient({
        userId,
        UHID
    });

    return await patient.save();
}

const createPatientRecord = async (patientDetails) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    gender,
    dob,
    bloodGroup,
    street,
    city,
    state,
    pincode,
    emgContName,
    emgContPhone
  } = patientDetails;

  // ✅ Create User
  const newPatUser = await userService.createBasicUser({
    firstName,
    lastName,
    email,
    phone,
    password
  });

  // ✅ Create Patient Base
  const newPatient = await createPatientByUserId(newPatUser._id);

  // ✅ Assign Fields
  newPatient.gender = gender;
  newPatient.dob = dob;
  newPatient.bloodGroup = bloodGroup;

  // ✅ FIXED ADDRESS
  newPatient.address = {
    street,
    city,
    state,
    pincode
  };

  newPatient.emgContName = emgContName;
  newPatient.emgContPhone = emgContPhone;

  // ✅ Profile completed
  newPatient.isProfileCompleted = true;

  // ✅ Activate user
  newPatUser.status = STATUS.ACTIVE;
  await newPatUser.save();

  // ✅ Save patient
  await newPatient.save();

  return newPatient;
};


const getAllPatients = async () => {

  const patients = await Patient.find()
    .populate({
      path: 'userId',
      select: 'firstName lastName email phone status'
    })
    .lean();

  return patients.map(p => ({
    patientId: p._id,
    UHID: p.UHID,
    fullName: `${p.userId.firstName} ${p.userId.lastName}`,
    email: p.userId.email,
    phone: p.userId.phone,
    gender: p.gender,
    bloodGroup: p.bloodGroup,
    city: p.address?.city || '',
    state: p.address?.state || '',
    isProfileCompleted: p.isProfileCompleted,
    status: p.userId.status,
    userId: p.userId._id
  }));
};

const checkPatient = async (UHID) => {

  const patient = await Patient.findOne({ UHID });

  if (!patient) {
    throw new ApiError(404, "Patient not found");
  }

  return {
    UHID: patient.UHID,
    status : STATUS.ACTIVE,
    name: patient.name || "Patient Found"
  };
};

module.exports = {createPatientByUserId,createPatientRecord,getAllPatients,checkPatient,}

