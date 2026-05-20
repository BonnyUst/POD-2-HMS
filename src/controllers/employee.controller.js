const User = require('../models/User');
const Patient = require('../models/Patient')
const Roles = require('../models/Roles')
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