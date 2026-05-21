const { create } = require('../models/Roles');
const {createRouter,auth,errorValidate} = require('./routesServices/routes.header');
const {userSignupValidator,userLoginValidator} = require('../validations/authValidations')
const router = createRouter();

const {
    signup,
    login,
    verifyEmail
} = require('../controllers/auth.controller');

router.post('/signup',userSignupValidator,errorValidate,signup);
router.post('/login',userLoginValidator,errorValidate,login);
router.get('/verify-email',(req,res,next)=>{console.log("summa"); next();},verifyEmail);

module.exports = router;