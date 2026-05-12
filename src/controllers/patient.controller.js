const asyncHandler = require('express-async-handler');
const ApiResponse = require('../utils/ApiResponse');
const patientService = require('../services/patient.service');
const createPatient = asyncHandler(async (req, res) => {
    const savedPatient = await patientService.createPatient(req.body);
    res.status(201).json(new ApiResponse(201, savedPatient));
});
module.exports = {createPatient}