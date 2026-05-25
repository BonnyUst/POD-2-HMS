//adminroute

const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const authRoles = require('../middleware/authRoles')
const permissions = require('../utils/permissions')
const adminController=require('../controller/dashboard.controller')

router.get("/dashboard",
    authMiddleware, 
    authRoles(permissions.DASHBOARD),
    adminController.getDashboardStats

    // (req, res) => {
    //     res.json({
    //         success: true,
    //         message: "Welcome Admin"

    //     });
    // }
);



module.exports=router;
