const express = require('express');

const router = express.Router();
const authValidator = require('../validation/authValidation')
const authController = require('../controller/authController')
const validate = require('../middleware/validate');
const authMiddleware = require('../middleware/authMiddleware');
const authRoles=require('../middleware/authRoles')
const permissions=require('../utils/permissions')

router.get("/profile",authMiddleware,authController.getCurrentProfile);
router.get("/admin/dashboard",
    authMiddleware,authRoles(permissions.ADMIN_DASHBOARD),
    (req,res)=>{
        res.json({
            success:true,
            message:"Welcome Admin"

        });
    }
);

module.exports = router;

