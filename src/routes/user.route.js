const express = require('express');
const router = express.Router();
const { signUp } = require('../controllers/user.controller');
const { userSignUpValidator, patientSignUpValidator } = require('../middlewares/validator.middleware');
const { validate } = require('../middlewares/validate.middleware');
router.post('/', userSignUpValidator, patientSignUpValidator, validate, signUp);

module.exports = router;