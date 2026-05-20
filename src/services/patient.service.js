const Patient = require('../models/patient.model');
const ApiError = require('../utils/ApiError');
const generateId = require('../utils/idGenerator');
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
        emergencyContactPhone
    } = patientData;
    const UHID = await generateId('PAT');
    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
        throw new ApiError(409, 'patient already exists with this email');
    }
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
    console.log('createed patient');
    return patient;
}
module.exports = { createPatient };