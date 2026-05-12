const express = require('express');
const auth = require('../../middleware/jwtAuth.middleware')
const errorValidate = require('../../middleware/error.validation');
const createRouter = () => express.Router();

module.exports = {createRouter,auth,errorValidate};