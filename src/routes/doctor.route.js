const express = require('express');
const { createDoctorUser } = require('../controllers/doctor.controller');
const router = express.Router();

router.post('/', createDoctorUser);
module.exports = router;