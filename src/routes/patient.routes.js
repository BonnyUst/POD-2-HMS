const express = require('express');
const router = express.Router();
const { createPatient } = require('../controllers/patient.controller.js');
const jwtAuth = require('../middlewares/jwtAuth.middleware');
const authorize = require('../middlewares/authorize.middleware');

router.post('/', jwtAuth, authorize('CREATE_PATIENT'), createPatient);

module.exports = router;