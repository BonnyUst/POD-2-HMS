//user.route s

const express = require('express');

const router = express.Router();
const userController=require('../controller/user.controller')
const authMiddleware=require('../middleware/authMiddleware')
const authRoles=require('../middleware/authRoles')
const permissions=require('../utils/permissions')
const userValidator=require('../validation/user.validation')
const validate=require('../middleware/validate')


router.post('/create',
    authMiddleware,
    authRoles(permissions.ADD_EMPLOYEE),
    userValidator.validateCreateEmployeeByAdmin,
    validate,
    userController.createEmployeeByAdmin);

router.get("/profile", 
    authMiddleware, 
userController.getCurrentProfile);

module.exports = router;




