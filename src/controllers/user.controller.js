const asyncHandler = require('express-async-handler')
const User = require('../models/User')
const userService = require('../services/user.services');
const ApiResponse = require('../utils/ApiResponse');

exports.getMyInfo = asyncHandler(async(req,res)=>{
    console.log("REQ.USER:",req.user);
    const userId= req.user.userId;
    const role = req.user.role;
    const responseData = await userService.getMyInfo(userId,role);
    res.status(200).json(new ApiResponse(200,responseData));
})