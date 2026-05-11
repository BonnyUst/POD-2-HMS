const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authValidator = require('../validation/authValidation')
const authController = require('../controller/authController')
const validate = require('../middleware/validate')



router.post('/signUp', authValidator.validateSignUp,validate,authController.signUp);

module.exports = router;




