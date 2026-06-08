const {
  emailValidation,
  passwordValidation,
  firstNameValidation,
  lastNameValidation,
  phoneValidation,
  specializationValidation,
  timeValidation,
  futureDateValidation
} = require('./common.validation');

const registerApprovalValidator = [
  emailValidation(),
  passwordValidation(),
  firstNameValidation(),
  lastNameValidation(),
  phoneValidation(),

  specializationValidation(),

  timeValidation('avlblStartTime'),
  timeValidation('avlblEndTime'),

  futureDateValidation('joiningDate')
];

module.exports = {
  registerApprovalValidator
};