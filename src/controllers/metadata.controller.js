const asyncHandler = require('express-async-handler');
const metaService = require('../services/metadata.service');
const ApiResponse = require('../utils/ApiResponse');

const getRole = asyncHandler(async (req, res) => {
    const response = await metaService.getRoles();
    res.status(200).json(new ApiResponse(200, response));
});
const getDepartments = asyncHandler( async(req,res)=>{
    const response =await  metaService.getDepartments();
    res.status(200).json(new ApiResponse(200,response));
});
module.exports = {
    getRole,
    getDepartments,
}