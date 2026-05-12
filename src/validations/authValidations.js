const { body} = require('express-validator');

const userSignupValidator = [
    body('email').isEmail().withMessage("Valid email required"),
    body('password').isLength({min:8})
        .withMessage("Passwor must be atleast 8 characters"),
    body('firstName').notEmpty().withMessage("First name is required"),
    body('lastName').notEmpty().withMessage("Last name is required"),
    body('phone').notEmpty()
        .withMessage("Phone number is required")
        .matches(/^\d{10}$/)
        .withMessage("Phone number must be 10 digits")
];

const userLoginValidator = [
    body('email').isEmail().withMessage("Valid email required"),
    body('password').isLength({min:8})
        .withMessage("Password must be atleast 8 characters")
]
module.exports =  {
    userSignupValidator,
    userLoginValidator
}