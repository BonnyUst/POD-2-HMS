const patientService = require('../services/patient.services')
const ApiResponse = require('../utils/ApiResponse')
const asyncHandler = require('express-async-handler');
const receptionistService = require('../services/reception.service');

exports.createPatient = asyncHandler(async(req,res)=>{
    const patientDetails = req.body;
    const patient = await patientService.createPatientRecord(patientDetails);
    return res.status(201).send(new ApiResponse(201,patient));
})

exports.getReceptionistDashboard = asyncHandler(async (req, res) => {
  const data = await receptionistService.getDashboardData();
  return res.status(200).send(new ApiResponse(200, data));
});