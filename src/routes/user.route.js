const express = require('express');
const router = express.Router();
const { signUp } = require('../controllers/user.controller');
const { userSignUpValidator, patientSignUpValidator } = require('../middlewares/validator.middleware');
const { validate } = require('../middlewares/validate.middleware');
const authorize = require('../middlewares/authorize.middleware');
router.post('/', userSignUpValidator, validate, authorize('CREATE_USER'), signUp);

module.exports = router;