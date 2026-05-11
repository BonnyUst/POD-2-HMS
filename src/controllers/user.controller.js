const asyncHandler = require('express-async-handler');
const userService = require('../services/user.service');
const ApiResponse = require('../utils/ApiResponse');

const signUp = asyncHandler(async (req, res) => {

    const user = await userService.createPatientUser(req.body);
    res.status(201).send(new ApiResponse(201, user));
});

module.exports = {
    signUp
};