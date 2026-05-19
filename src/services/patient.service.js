const Patient = require("../models/patient.model");

const Role = require("../models/role.model");

const generateId = require("../utils/idGenerator");

const ApiError = require("../utils/ApiError");

const createPatient = async (patientData) => {
  const {
    fullName,

    phone,

    email,

    gender,

    dob,

    bloodGroup,

    address,

    emergencyContactName,

    emergencyContactPhone,
  } = patientData;

  const patientRole = await Role.findOne({
    code: "PAT",
  });

  if (!patientRole) {
    throw new ApiError(404, "Patient role not found");
  }

  const UHID = await generateId({
    roleId: patientRole._id,

    roleCode: patientRole.code,
  });

  const patient = await Patient.create({
    UHID,

    fullName,

    phone,

    email,

    gender,

    dob,

    bloodGroup,

    address,

    emergencyContactName,

    emergencyContactPhone,
  });

  return patient;
};

const getAllPatients = async () => {
  return await Patient.find().sort({
    createdAt: -1,
  });
};

const updatePatient = async (
  patientId,

  patientData,
) => {
  const updatedPatient = await Patient.findByIdAndUpdate(
    patientId,

    patientData,

    {
      new: true,
    },
  );

  if (!updatedPatient) {
    throw new ApiError(404, "Patient not found");
  }

  return updatedPatient;
};

const deletePatient = async (patientId) => {
  const patient = await Patient.findById(patientId);

  if (!patient) {
    throw new ApiError(404, "Patient not found");
  }

  await Patient.findByIdAndDelete(patientId);

  return {
    message: "Patient deleted successfully",
  };
};

module.exports = {
  createPatient,

  getAllPatients,

  updatePatient,

  deletePatient,
};
