const express = require('express');
const router = express.Router();

const appointmentController = require('../controller/appointment.controller')

const {validateCreateAppointment}=require('../validation/appointment.validation')
const authMiddleware=require('../middleware/authMiddleware')

const authRoles=require('../middleware/authRoles')
const permissions=require('../utils/permissions')
// console.log("authMiddleware:", typeof authMiddleware);
// console.log("authRoles:", typeof authRoles);
// console.log("permission:", permissions.ADD_APPOINTMENT);
// console.log("validateCreateAppointment:", validateCreateAppointment);
// console.log("createAppointment:", typeof appointmentController.createAppointment);
router.post(
    '/create',
    authMiddleware,
    authRoles(permissions.ADD_APPOINTMENT)
    ,
    validateCreateAppointment,
    appointmentController.createAppointment
);

router.get(
    '/list',
    authMiddleware,
    authRoles(permissions.VIEW_APPOINTMENT),
    appointmentController.getAppointments
);

module.exports = router;