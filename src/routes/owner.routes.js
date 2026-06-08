const { create } = require('../models/Roles');
const {createRouter,auth,errorValidate} = require('./routesServices/routes.header');
const {userSignupValidator,userLoginValidator} = require('../validations/authValidations');
const authorize = require('../middleware/authorize.middleware');
const {addAdminValidator,updateAdminValidator} = require('../validations/adminValidations');
const {addAdmin,getAllAdmins,getDashboardStats,deleteAdmin, toggleAdminStatus, updateAdmin} = require('../controllers/owner.controller');

const router = createRouter();

router.post('/addAdmin',auth,authorize("*"),addAdminValidator,errorValidate,addAdmin);
router.get('/getAllAdmins',auth,authorize("*"),getAllAdmins)
router.get('/dashboard-stats',auth,authorize("*"),getDashboardStats);
router.delete('/deleteAdmin/:userId',auth,authorize("*"),deleteAdmin);
router.patch('/toggleAdmin/:userId',auth,authorize("*"),toggleAdminStatus);
router.put('/updateAdmin/:userId',auth,authorize("*"),updateAdminValidator,errorValidate,updateAdmin);

module.exports = router;