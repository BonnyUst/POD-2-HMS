const express = require('express');
const { getRole, getDepartments } = require('../controllers/metadata.controller');
const router = express.Router();

router.get('/roles', getRole);
router.get('/departments', getDepartments);
module.exports = router;