const asyncHandler = require('express-async-handler');
const patientService = require('../services/patient.service');
const ApiResponse = require('../utils/ApiResponce');

const createPatient = asyncHandler(async(req,res) => {
    const user = await patientService.createPatient(req.body);
    res.status(201).send(new ApiResponse(201, user));
});


module.exports = {
    createPatient
};