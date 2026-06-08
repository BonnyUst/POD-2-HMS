const User = require('../models/User');
const Patient = require('../models/Patient')
const Roles = require('../models/Roles')
const Departments = require('../models/Departments');
const Employee = require('../models/Employee');

const asyncHandler = require('express-async-handler');
const userService = require('../services/user.services')
const authService = require('../services/auth.services')
const ApiResponse = require('../utils/ApiResponse')
const employeeService = require('../services/employee.services');

exports.addEmployee = asyncHandler(async(req,res)=>{
    const data = req.body;
    const employee = await employeeService.addEmployee(data);
    return res.status(201).send(new ApiResponse(201,employee));
})

exports.getEmployee = asyncHandler(async(req,res)=>{
    const adminUserId = req.user.userId;
    const adminEmpInfo = await Employee.findOne({userId : adminUserId });
    const adminDeptId = adminEmpInfo.departmentId;
    const data = await employeeService.getEmployeeByDept(adminDeptId);
    return res.status(200).send(new ApiResponse(200,data));
});

exports.toggleStatus = asyncHandler(async(req,res)=>{
    const { userId }=req.params;
    const result = await employeeService.toggleEmployeeStatus(userId);
    return res.status(200).send(new ApiResponse(200,result));
})

exports.addEmployeeByAdmin = asyncHandler(async(req,res)=>{
    const data = req.body;
    

    const adminEmployee = await Employee.findOne({ userId: req.user.userId });

    if (!adminEmployee) {
        throw new ApiError(404, "Admin employee record not found");
    }


    data.adminDeptId = adminEmployee.departmentId;

    const employee = await employeeService.addEmployeeByAdmin(data);

    return res.status(201).send(new ApiResponse(201, employee));

})

exports.updateEmployee = asyncHandler(async (req, res) => {
    
    
    const { userId } = req.params;
    const data = req.body;

    const result = await employeeService.updateEmployee(userId, data);

    return res.status(200).send(new ApiResponse(200, result));
});