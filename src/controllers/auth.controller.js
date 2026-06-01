const User = require('../models/User');
const Patient = require('../models/Patient')
const Roles = require('../models/Roles')
const asyncHandler = require('express-async-handler');
const userService = require('../services/user.services')
const authService = require('../services/auth.services')
const ApiResponse = require('../utils/ApiResponse')

exports.signup = asyncHandler(async(req,res)=>{
    const user = await userService.createAuthUser(req.body);
    return res.status(201).send(new ApiResponse(201,user));
});

exports.login = asyncHandler(async(req,res)=>{
    const {email,password} = req.body;
    const responseData = await authService.loginUser({email,password});
    res.status(200).json(new ApiResponse(200,responseData));
});

exports.verifyEmail = asyncHandler(async (req, res) => {

    const token = req.query.token; // ✅ extract here

    const result = await authService.verifyUserByToken(token);

    if (result.alreadyVerified) {
        return res.status(200).send(
            new ApiResponse(200, {
                user: result.user
            })
        );
    }

    return res.status(200).send(
        new ApiResponse(200, {
            user: {
                id: result.user._id,
                email: result.user.email,
                status: result.user.status,
                isVerified: result.user.isVerified,
            },
            patient: result.patient
        })
    );
});

exports.forgotPassword = asyncHandler(async(req,res)=>{
    const {email }= req.body;
    const result = await authService.forgotPassword(email);
    return res.status(200).send(new ApiResponse(200,result));
})

exports.resetPassword = asyncHandler(async(req,res)=>{
    const { token } = req.params;
    const {email,password} = req.body;

    const result = await authService.resetPassword({token,email,newPassword : password });
    return res.status(200).send(new ApiResponse(200,result));
})