const { body } = require('express-validator');

const {
  emailValidation,
  passwordValidation,
  firstNameValidation,
  lastNameValidation,
  phoneValidation
} = require('./common.validation');


const userSignupValidator = [
  emailValidation(),
  passwordValidation(),
  firstNameValidation(),
  lastNameValidation(),
  phoneValidation()
];


const userLoginValidator = [
  body('email')
    .trim()
    .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
    .withMessage("Email must be Gmail"),

  body('password')
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
];

module.exports = {
  userSignupValidator,
  userLoginValidator
};