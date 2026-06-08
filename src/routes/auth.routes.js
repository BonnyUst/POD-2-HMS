const { create } = require('../models/Roles');
const {createRouter,auth,errorValidate} = require('./routesServices/routes.header');
const {userSignupValidator, userLoginValidator} = require('../validations/authValidations')
const router = createRouter();

const {
    signup,
    login,
    verifyEmail,
    forgotPassword,
    resetPassword
} = require('../controllers/auth.controller');

router.post('/signup',userSignupValidator,errorValidate,signup);
router.post('/login',userLoginValidator,errorValidate,login);
router.get('/verify-email',verifyEmail);
router.post('/forgot-password',forgotPassword);
router.post('/reset-password/:token',resetPassword);

module.exports = router;