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

exports.updateAdmin = asyncHandler(async(req,res)=>{
    const {userId} = req.params;
    const data = await ownerService.updateAdmin(userId,req.body);
    return res.status(200).send(new ApiResponse(200,data));
})

exports.getAllAdmins = asyncHandler(async(req,res)=>{
    const responseData = await ownerService.getAllAdmins();
    return res.status(200).send(new ApiResponse(200,responseData))
})

exports.deleteAdmin = asyncHandler(async()=>{
    const {userId} = req.params;
    const data = await ownerService.deleteAdmin(userId);
    return res.status(200).send(new ApiResponse(200,data));
})

exports.toggleAdminStatus = asyncHandler(async(req,res)=>{
    const {userId} = req.params;
    const data = await ownerService.toggleAdminStatus(userId);
    return res.status(200).send(new ApiResponse(200,data));
})

exports.getDashboardStats = asyncHandler(async(req,res)=>{
    const data = await ownerService.getDashboardStats();

    return res.status(200).send(new ApiResponse(200,data));
})