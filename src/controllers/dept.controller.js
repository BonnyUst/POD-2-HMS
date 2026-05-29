const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('express-async-handler');
const deptService = require('../services/dept.services');
const Employee = require('../models/Employee');
const ApiError = require('../utils/ApiError');

exports.getDepartmentEmployees = asyncHandler(async(req,res)=>{
    const adminUserId = req.user.userId;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const role = req.query.role || 'ALL';

    const adminEmp = await Employee.findOne({userId : adminUserId});

    if(!adminEmp){
        throw new ApiError(404,"Admin not found");
    }

    const result = await deptService.getDepartmentEmployees({
        departmentId : adminEmp.departmentId,
        page,
        limit,
        role
    })

    return res.status(200).send(new ApiResponse(200,result));
})

exports.getAllDepartments = asyncHandler(async(req,res)=>{
    const data = await deptService.getAllDepartments();
    return res.status(200).send(new ApiResponse(200,data));
})