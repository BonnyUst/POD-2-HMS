const User = require('../models/User');
const Patient = require('../models/Patient')
const Roles = require('../models/Roles')
const asyncHandler = require('express-async-handler');
const userService = require('../services/user.services')
const authService = require('../services/auth.services')
const ownerService = require('../services/owner.services')

const ApiResponse = require('../utils/ApiResponse')

exports.addAdmin = asyncHandler(async(req,res)=>{
    const{
        firstName,
        lastName,
        email,
        phone,
        password,
        deptName,
        designation,
        joiningDate,
    } = req.body;

    const roleName = req.user.role;
    const responseData = await ownerService.addAdmin({firstName,lastName,email,phone,password,roleName,deptName,designation,joiningDate});
    return res.status(201).send(new ApiResponse(201,responseData));
})

exports.getAllAdmins = asyncHandler(async(req,res)=>{
    const responseData = await ownerService.getAllAdmins();
    return res.status(200).send(new ApiResponse(responseData))
})