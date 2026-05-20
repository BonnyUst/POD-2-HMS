const { body } = require('express-validator');

const userSignUpValidator = [
    body("email").isEmail().withMessage("Valid email required"),
    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters"),
    body("firstName").notEmpty().withMessage("First name is required"),
    body("lastName").notEmpty().withMessage("Last name is required"),
    body("phone")
        .notEmpty()
        .withMessage("Phone number is required")
        .matches(/^\d{10}$/)
        .withMessage("Phone number must be 10 digits")
];

const patientSignUpValidator = [
    body("fullName")
        .notEmpty().withMessage("Full name is required"),

    body("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Valid email required"),

    body("phone")
        .notEmpty().withMessage("Phone number is required")
        .matches(/^\d{10}$/)
        .withMessage("Phone number must be 10 digits"),

    body("gender")
        .notEmpty().withMessage("Gender is required") // ✅ IMPORTANT
        .isIn(["MALE", "FEMALE", "OTHER"])
        .withMessage("Gender must be MALE, FEMALE or OTHER"),

    body("dob")
        .notEmpty().withMessage("DOB is required") // ✅ IMPORTANT
        .isISO8601().withMessage("Date of birth must be valid")
        .toDate(),

    body("bloodGroup")
        .optional()
        .isIn(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
        .withMessage("Valid blood group is required"),

    body("emergencyContactPhone")
        .optional()
        .matches(/^\d{10}$/)
        .withMessage("Emergency contact phone must be 10 digits"),
];
module.exports = {
    userSignUpValidator,
    patientSignUpValidator
}