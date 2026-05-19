const { body } = require("express-validator");

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
    .withMessage("Phone number must be 10 digits"),
];
const patientSignUpValidator = [
  body("gender")
    .isIn(["MALE", "FEMALE", "OTHER"])
    .withMessage("gender must be either male or female"),
  body("dob").isDate().withMessage("date of birth must be a valid date"),
  body("bloodGroup")
    .optional()
    .isIn(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
    .withMessage("valid blood group is required"),
  body("emergencyContactPhone")
    .optional()
    .matches(/^\d{10}$/)
    .withMessage("Phone number must be 10 digits"),
];

module.exports = {
  userSignUpValidator,
  patientSignUpValidator,
};
