//user.route s

const express = require('express');

const router = express.Router();
const authController = require('../controller/authController')

const authMiddleware=require('../middleware/authMiddleware')

router.get("/profile", 
    authMiddleware, 
    authController.getCurrentProfile);

module.exports = router;




