const { body } = require('express-validator');

const validateCreateDoctor = [
    body("firstName")
        .notEmpty()
        .withMessage("First Name is required"),

    body("lastName")
        .notEmpty()
        .withMessage("Last Name is required"),

    body("email")
        .isEmail()
        .withMessage("Not a valid Email"),

    body("password")
        .isStrongPassword()
        .withMessage("Enter a Strong Password"),

    body("phone")
        .isMobilePhone('en-IN')
        .withMessage("Enter a Valid Phone No"),

    body("department")
        .notEmpty()
        .withMessage("Department is required"),

    body("designation")
        .notEmpty()
        .withMessage("Designation is required"),

    body("joiningDate")
        .notEmpty()
        .withMessage("Joining Date is required")
        .isISO8601()
        .withMessage("Joining Date must be a valid date"),

    body("specialization")
        .notEmpty()
        .withMessage("Specialization is required"),

    body("qualification")
        .notEmpty()
        .withMessage("Qualification is required"),

    body("consultationFee")
        .notEmpty()
        .withMessage("Consultation fee is required")
        .isNumeric()
        .withMessage("Consultation fee must be a number"),

    body("medicalRegistrationNo")
        .notEmpty()
        .withMessage("Medical Registration Number is required"),

    body("availabilityStartTime")
        .notEmpty()
        .withMessage("Availability start time is required"),

    body("availabilityEndTime")
        .notEmpty()
        .withMessage("Availability end time is required"),

    body("experienceYears")
        .notEmpty()
        .withMessage("Experience years is required")
        .isNumeric()
        .withMessage("Experience years must be a number")
];
module.exports = {validateCreateDoctor};