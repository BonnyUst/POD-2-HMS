// auth route

const express = require('express');

const router = express.Router();
const authValidator = require('../validation/auth.validation')
const authController = require('../controller/authController')
const validate = require('../middleware/validate');



router.post('/login',
    authValidator.validateLogin,
    validate,
    authController.login)

router.get('/verify-email/:token',
     authController.verifyEmail);

module.exports = router;

//auth.route