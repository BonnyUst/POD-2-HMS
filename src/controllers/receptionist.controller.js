const patientService = require('../services/patient.services')
const ApiResponse = require('../utils/ApiResponse')
const asyncHandler = require('express-async-handler');

exports.createPatient = asyncHandler(async(req,res)=>{
    const patientDetails = req.body;
    const patient = await patientService.createPatientRecord(patientDetails);
    return res.status(201).send(new ApiResponse(201,patient));
})

