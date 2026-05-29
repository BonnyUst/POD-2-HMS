const ApiResponse = require('../utils/ApiResponse')
const asyncHandler = require('express-async-handler');
const doctorService = require('../services/doctor.services')

exports.getDoctorsByDept = asyncHandler(async(req,res)=>{
    const { dept } = req.query;
    console.log("Get DOC by Dept  Controller");
    const data = await doctorService.getDoctorsByDept(dept);

    return res.status(200).json(new ApiResponse(200, data));
})

exports.checkDoctor = asyncHandler(async(req,res)=>{
    const { empId } = req.params;

    const data = await doctorService.checkDoctor(empId);

    return res.status(200).json(new ApiResponse(200, data));
})