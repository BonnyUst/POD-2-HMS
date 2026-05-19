const express = require('express');

const router = express.Router();
const authValidator = require('../validation/authValidation')
const authController = require('../controller/authController')
const validate = require('../middleware/validate');
const authMiddleware = require('../middleware/authMiddleware');

router.get("/profile",authMiddleware,authController.getCurrentProfile);
module.exports = router;
