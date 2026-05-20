const express = require('express');
const router = express.Router();
const { createPatient } = require('../controllers/patient.controller');
const jwtAuth = require('../middlewares/jwtAuth.middleware');
const authorize = require('../middlewares/authorize.middleware');
const { patientSignUpValidator } = require('../middlewares/validator.middleware');
const { validate } = require('../middlewares/validate.middleware');
router.post('/', jwtAuth, patientSignUpValidator, validate, authorize('CREATE_PATIENT'), createPatient);

module.exports = router;