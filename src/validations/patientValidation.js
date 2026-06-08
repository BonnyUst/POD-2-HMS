const { body } = require('express-validator');

const patientValidator = [

  body('firstName')
    .isLength({ min: 3 })
    .withMessage('First name min 3 chars'),

  body('lastName')
    .isLength({ min: 2 })
    .withMessage('Last name min 2 chars'),

  body('email')
    .isEmail()
    .withMessage('Invalid email'),

  body('phone')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Invalid phone'),

  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password min 6 chars'),

  body('gender').notEmpty(),
  body('bloodGroup').notEmpty(),
  body('dob').notEmpty(),

  body('city').isLength({ min: 2 }),
  body('state').isLength({ min: 2 }),

  body('emgContName').isLength({ min: 3 }),

  body('emgContPhone')
    .matches(/^[6-9]\d{9}$/)

];

module.exports = { patientValidator };