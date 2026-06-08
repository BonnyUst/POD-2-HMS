const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('express-async-handler');
const authService = require('../services/auth.services');
const approvalService = require('../services/approval.services');

exports.registerApproval = asyncHandler(async(req,res)=>{
    

    const result = await authService.registerApproval(req.body);
    return res.status(200).send(new ApiResponse(200,result));
})

exports.verifyEmail = asyncHandler(async(req,res)=>{
    const token  = req.params.token;
    
    const result = await authService.verifyEmail(token);
    return res.status(200).send(new ApiResponse(200,result));
})

exports.resendVerificationEmail = asyncHandler(async(req,res)=>{
    const {email} = req.body;
    const result = await authService.resendVerificationEmail(email);
    return res.status(200).send(new ApiResponse(200,result));
})

exports.getApprovals = asyncHandler(async (req, res) => {
  const { status } = req.query;

  const data = await approvalService.getApprovals(status);

  return res.status(200).send(new ApiResponse(200, data));
});

exports.approve = asyncHandler(async (req, res) => {
  const { id } = req.params;
    
    console.log("approve Controller")
  const result = await approvalService.approveEmployee(id);

  return res.status(200).send(new ApiResponse(200, result));
});

exports.reject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  const result = await approvalService.rejectEmployee(id, reason);

  return res.status(200).send(new ApiResponse(200, result));
});