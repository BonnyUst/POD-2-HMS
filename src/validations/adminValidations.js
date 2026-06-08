const { body } = require('express-validator');


const nameRegex = /^[A-Za-z\s]{2,}$/;
const phoneRegex = /^[6-9]\d{9}$/;
const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;




const addAdminValidator = [
  body('firstName')
    .matches(nameRegex)
    .withMessage('First name must be at least 2 letters'),

  body('lastName')
    .matches(nameRegex)
    .withMessage('Last name must be at least 2 letters'),

  body('email')
    .matches(gmailRegex)
    .withMessage('Email must be a valid Gmail'),

  body('phone')
    .matches(phoneRegex)
    .withMessage('Phone must be 10 digit Indian number'),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password min 6 characters'),

  body('deptName').notEmpty().withMessage('Department required'),
  body('designation').notEmpty().withMessage('Designation required'),
  body('joiningDate').notEmpty().withMessage('Joining date required')
];




const updateAdminValidator = [
  body('firstName')
    .optional()
    .matches(nameRegex),

  body('lastName')
    .optional()
    .matches(nameRegex),

  body('email')
    .optional()
    .matches(gmailRegex),

  body('phone')
    .optional()
    .matches(phoneRegex),

  body('deptName')
    .optional()
    .notEmpty(),

  body('designation')
    .optional()
    .notEmpty(),

  body('joiningDate')
    .optional()
    .notEmpty()
];

module.exports = {
  addAdminValidator,
  updateAdminValidator
};