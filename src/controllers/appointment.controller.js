const appointmentService = require('../services/appointment.services');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('express-async-handler');



exports.createAppointment = asyncHandler( async (req, res, next) => {
    const data = req.body;
    const user = req.user;

    const appointment = await appointmentService.createAppointment(data,user);
    return res.status(201).send(new ApiResponse(201,appointment));
  
});

exports.getAppointments = asyncHandler(async(req,res)=>{
  const result = await appointmentService.getAppointments(req.query);
    return res.status(200).json(new ApiResponse(200, result));
})

exports.getAppointmentById = asyncHandler(async(req,res)=>{
  const data = await appointmentService.getAppointmentById(req.params.id);
  return res.status(200).json(new ApiResponse(200, data));

})

exports.updateAppointment = asyncHandler(async(req,res)=>{
    const data = await appointmentService.updateAppointment(req.params.id, req.body);
    return res.status(200).json(new ApiResponse(200, data));
})

exports.deleteAppointment = asyncHandler(async(req,res)=>{
  const data = await appointmentService.softDelete(req.params.id);
  return res.status(200).json(new ApiResponse(200, data));
})

