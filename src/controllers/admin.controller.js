const ApiResponse = require('../utils/ApiResponse');
const adminService = require('../services/admin.services')
const asyncHandler = require('express-async-handler');

exports.getAdminDashboard = asyncHandler(async(req,res)=>{
    const userId = req.user.userId;
    const data = await adminService.getAdminDashboard(userId);
    return res.status(200).send(new ApiResponse(200,data));
})
