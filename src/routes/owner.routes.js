const { create } = require('../models/Roles');
const {createRouter,auth,errorValidate} = require('./routesServices/routes.header');
const {userSignupValidator,userLoginValidator} = require('../validations/authValidations');
const authorize = require('../middleware/authorize.middleware');
const {addAdminValidator} = require('../validations/adminValidations');
const {addAdmin,getAllAdmins} = require('../controllers/owner.controller');

const router = createRouter();

router.post('/addAdmin',auth,authorize(),addAdminValidator,errorValidate,addAdmin);
router.get('/getAllAdmins',auth,authorize(),getAllAdmins)

module.exports = router;