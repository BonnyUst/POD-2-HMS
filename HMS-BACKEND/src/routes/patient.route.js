// routes/patient.route.js

const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const authRoles = require('../middleware/authRoles');
const permissions = require('../utils/permissions');
const patientController=require('../controller/patient.controller');


router.post('/create',
    authMiddleware,
    authRoles(permissions.ADD_PATIENT),
    patientController.createPatient
);

router.get('/list',
    authMiddleware,
    authRoles(permissions.VIEW_PATIENT),
     patientController.getAllPatients);

module.exports = router;