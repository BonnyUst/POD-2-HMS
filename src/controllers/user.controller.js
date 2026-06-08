const asyncHandler = require('express-async-handler')
const User = require('../models/User')
const userService = require('../services/user.services');
const ApiResponse = require('../utils/ApiResponse');

exports.getMyInfo = asyncHandler(async(req,res)=>{
    
    const userId= req.user.userId;
    const role = req.user.role;
    const responseData = await userService.getMyInfo(userId,role);
    res.status(200).json(new ApiResponse(200,responseData));
})

exports.getMyProfile = asyncHandler(async (req, res) => {



  if (!req.user || !req.user.userId) {
    throw new Error("User not authenticated");
  }

  const profile = await userService.getMyProfile(req.user.userId);

  return res.status(200).json({
    success: true,
    data: profile
  });
});