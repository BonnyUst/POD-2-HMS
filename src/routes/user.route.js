const express=require('express');
const{body}=require('express-validator');
const{router}=express.Router();
const {validateSignUp}=require('../validation/authValidation')


router.post('/',validateSignUp)




