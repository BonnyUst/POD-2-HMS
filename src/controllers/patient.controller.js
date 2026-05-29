const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('express-async-handler');
const patientService = require('../services/patient.services')

exports.getPatients = asyncHandler(async(req,res)=>{
    const data = await patientService.getAllPatients();
    return res.status(200).send(new ApiResponse(200,data));
})

exports.addPatient = asyncHandler(async(req,res)=>{
    const patient = await patientService.createPatientRecord(req.body);
    return res.status(201).send(new ApiResponse(201,patient));
})

exports.checkPatient = asyncHandler(async(req,res)=>{
    const { UHID } = req.params;

    const data = await patientService.checkPatient(UHID);

    return res.status(200).json(new ApiResponse(200, data));

})