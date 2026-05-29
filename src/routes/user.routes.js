const { create } = require('../models/Roles');
const {createRouter,auth,errorValidate} = require('./routesServices/routes.header');

const router = createRouter();

const {getMyInfo,getMyProfile } =  require('../controllers/user.controller');
// const authorize = require('../middleware/authorize.middleware');
// const PERMISSIONS = require('../constants/permissions');

// router.get(
//   '/patients',
//   authorize(PERMISSIONS.READ_PATIENT),
//   (req, res) => {
//     res.send("Patient list");
//   }
// );
// router.get('/home',auth,authorize(""),getMyHome)
router.get('/profile',auth,getMyProfile);

module.exports = router;