const asyncHandler = require('express-async-handler');
const userService = require('../services/user.service');
const ApiResponse = require('../utils/ApiResponse');

// LOGIN
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const responseData = await userService.loginUser(email, password);

    res.status(200).json(
        new ApiResponse(200, responseData, "Login successful")
    );
});

// GET MY PROFILE
const getMyInfo = asyncHandler(async (req, res) => {
    const { userId, role } = req.user;

    const data = await userService.getUserInfo(userId, role);

    res.status(200).json(
        new ApiResponse(200, data)
    );
});

module.exports = {
    login,
    getMyInfo,
};