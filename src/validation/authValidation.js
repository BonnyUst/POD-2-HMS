const {body}=require('express-validator');

exports.validateSignUp=[

    body("email").isEmail().withMessage("Not a valid Email"),
    body("password").isStrongPassword().withMessage("Enter a String Passowrd"),
    body("phone").isMobilePhone().withMessage("Enter a Valid Phone No"),
    body("emergencyContactPhone").isMobilePhone().withMessage("Ente a valid phone no")
    
]