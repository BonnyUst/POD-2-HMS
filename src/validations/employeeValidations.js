const { body } = require('express-validator');

const employeeValidator = [

  body('firstName')
    .isLength({ min: 3 })
    .withMessage("First name must be at least 3 characters"),

  body('lastName')
    .isLength({ min: 2 })
    .withMessage("Last name must be at least 2 characters"),

  body('email')
    .optional()
    .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
    .withMessage("Email must be Gmail"),

  body('phone')
    .matches(/^(\+91[\-\s]?)?[0]?(91)?[6-9]\d{9}$/)
    .withMessage("Invalid phone number"),

  body('password')
    .optional()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/)
    .withMessage("Weak password"),

  body('joiningDate')
    .custom((value) => {
      const today = new Date();
      const max = new Date();
      max.setMonth(today.getMonth() + 3);

      const input = new Date(value);

      if (input < today || input > max) {
        throw new Error("Joining date must be within next 3 months");
      }
      return true;
    }),

  body('specialization')
    .optional()
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Specialization must be letters only"),

  body('avlblStartTime')
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/),

  body('avlblEndTime')
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)

  
];

module.exports = { employeeValidator };