const { body } = require('express-validator');

const addEmployeeValidator = [
    body('firstName')
        .trim()
        .notEmpty()
        .withMessage("First name is required"),

    body('lastName')
        .trim()
        .notEmpty()
        .withMessage("Last name is required"),

    body('email')
        .trim()
        .isEmail()
        .withMessage("Valid email is required"),

    body('password')
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters"),

    body('roleName')
        .trim()
        .notEmpty()
        .withMessage("Role name is required"),

    body('deptName')
        .trim()
        .notEmpty()
        .withMessage("Department name is required"),

    body('designation')
        .trim()
        .notEmpty()
        .withMessage("Designation is required"),

    body('joiningDate')
        .notEmpty()
        .withMessage("Joining date is required")
        .bail()
        .isISO8601()
        .withMessage("Joining date must be a valid date (YYYY-MM-DD)")
];

module.exports = {
    addEmployeeValidator
};