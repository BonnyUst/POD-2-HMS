const { body, param } = require('express-validator');

const validateCreatePatient = [

    body("firstName")
        .trim()
        .notEmpty()
        .withMessage("First Name is required")
        .isLength({ min: 2, max: 50 })
        .withMessage("First Name must be between 2 and 50 characters"),

    body("lastName")
        .trim()
        .notEmpty()
        .withMessage("Last Name is required")
        .isLength({ min: 2, max: 50 })
        .withMessage("Last Name must be between 2 and 50 characters"),

    body("phone")
        .notEmpty()
        .withMessage("Phone is required")
        .matches(/^[6-9]\d{9}$/)
        .withMessage("Enter a valid 10-digit phone number"),

    body("gender")
        .notEmpty()
        .withMessage("Gender is required")
        .isIn(["MALE", "FEMALE", "OTHER"])
        .withMessage("Gender must be MALE, FEMALE, or OTHER"),

    body("dob")
        .notEmpty()
        .withMessage("Date of Birth is required")
        .isISO8601()
        .withMessage("DOB must be a valid date")
        .custom((value) => {
            const dob = new Date(value);
            const today = new Date();
            if (dob > today) {
                throw new Error("DOB cannot be in the future");
            }
            return true;
        }),

    body("bloodGroup")
        .notEmpty()
        .withMessage("Blood Group is required")
        .isIn(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
        .withMessage("Invalid Blood Group"),

    body("address.city")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("City must not exceed 100 characters"),

    body("address.state")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("State must not exceed 100 characters"),

    body("address.pincode")
        .optional()
        .matches(/^\d{6}$/)
        .withMessage("Pincode must be a valid 6-digit number"),

    body("emergencyContactName")
        .trim()
        .notEmpty()
        .withMessage("Emergency Contact Name is required")
        .isLength({ min: 2, max: 50 })
        .withMessage("Emergency Contact Name must be between 2 and 50 characters"),

    body("emergencyContactPhone")
        .notEmpty()
        .withMessage("Emergency Contact Phone is required")
        .matches(/^[6-9]\d{9}$/)
        .withMessage("Enter a valid 10-digit emergency contact phone number")
];

const validateUpdatePatient = [

    body("firstName")
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage("First Name must be between 2 and 50 characters"),

    body("lastName")
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage("Last Name must be between 2 and 50 characters"),

    body("phone")
        .optional()
        .matches(/^[6-9]\d{9}$/)
        .withMessage("Enter a valid 10-digit phone number"),

    body("gender")
        .optional()
        .isIn(["MALE", "FEMALE", "OTHER"])
        .withMessage("Gender must be MALE, FEMALE, or OTHER"),

    body("dob")
        .optional()
        .isISO8601()
        .withMessage("DOB must be a valid date")
        .custom((value) => {
            const dob = new Date(value);
            const today = new Date();
            if (dob > today) {
                throw new Error("DOB cannot be in the future");
            }
            return true;
        }),

    body("bloodGroup")
        .optional()
        .isIn(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
        .withMessage("Invalid Blood Group"),

    body("address.city")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("City must not exceed 100 characters"),

    body("address.state")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("State must not exceed 100 characters"),

    body("address.pincode")
        .optional()
        .matches(/^\d{6}$/)
        .withMessage("Pincode must be a valid 6-digit number"),

    body("emergencyContactName")
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage("Emergency Contact Name must be between 2 and 50 characters"),

    body("emergencyContactPhone")
        .optional()
        .matches(/^[6-9]\d{9}$/)
        .withMessage("Enter a valid 10-digit emergency contact phone number")
];

const validatePatientId = [
    param("id")
        .isMongoId()
        .withMessage("Invalid Patient ID")
];

module.exports = {
    validateCreatePatient,
    validateUpdatePatient,
    validatePatientId
};