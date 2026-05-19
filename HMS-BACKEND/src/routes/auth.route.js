const express = require('express');

const router = express.Router();
const authValidator = require('../validation/authValidation')
const authController = require('../controller/authController')
const validate = require('../middleware/validate');
const authMiddleware = require('../middleware/authMiddleware');
const authRoles=require('../middleware/authRoles')

router.get("/profile",authMiddleware,authController.getCurrentProfile);
router.get("/admin/dashboard",
    authMiddleware,authRoles("ADMIN"),
    (req,res)=>{
        res.json({
            success:true,
            message:"Welcome Admin"

        });
    }
);

module.exports = router;

