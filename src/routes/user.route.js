const express = require('express');

const router = express.Router();
const authValidator = require('../validation/authValidation')
const authController = require('../controller/authController')
const validate = require('../middleware/validate')



router.post('/signup', authValidator.validateSignUp,validate,authController.createEmployee);

module.exports = router;




