const { body } = require('express-validator');

const addAdminValidator = [
  body('firstName').notEmpty(),
  body('lastName').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),

  // employee fields
  body('deptName').notEmpty(),
  body('designation').notEmpty(),
  body('joiningDate').notEmpty()
];

module.exports = { addAdminValidator };