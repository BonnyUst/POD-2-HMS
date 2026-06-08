const { body } = require('express-validator');


const emailValidation = (field = 'email') =>
  body(field)
    .trim()
    .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
    .withMessage("Email must be a valid Gmail address");


const passwordValidation = (field = 'password') =>
  body(field)
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/)
    .withMessage("Password must contain uppercase, lowercase, number, special character and minimum 8 characters");


const firstNameValidation = () =>
  body('firstName')
    .trim()
    .isLength({ min: 3 })
    .withMessage("First name must be at least 3 characters");

const lastNameValidation = () =>
  body('lastName')
    .trim()
    .isLength({ min: 2 })
    .withMessage("Last name must be at least 2 characters");


const phoneValidation = (field = 'phone') =>
  body(field)
    .matches(/^(\+91[\-\s]?)?[0]?(91)?[6-9]\d{9}$/)
    .withMessage("Invalid Indian phone number");


const specializationValidation = () =>
  body('specialization')
    .optional()
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Specialization must contain only letters");


const timeValidation = (field) =>
  body(field)
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage(`${field} must be in HH:mm format`);


const futureDateValidation = (field) =>
  body(field)
    .optional()
    .custom((value) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // reset time

      const input = new Date(value);
      input.setHours(0, 0, 0, 0);

      if (input < today) {
        throw new Error(`${field} must be today or a future date`);
      }

      return true;
    });


const dobValidation = () =>
  body('dob')
    .optional()
    .custom((value) => {
      const today = new Date();
      const past100 = new Date();
      past100.setFullYear(today.getFullYear() - 100);

      const input = new Date(value);

      if (input > today || input < past100) {
        throw new Error("DOB must be within last 100 years and not future");
      }
      return true;
    });

module.exports = {
  emailValidation,
  passwordValidation,
  firstNameValidation,
  lastNameValidation,
  phoneValidation,
  specializationValidation,
  timeValidation,
  futureDateValidation,
  dobValidation
};