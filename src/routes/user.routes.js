const { create } = require('../models/Roles');
const {createRouter,auth,errorValidate} = require('./routesServices/routes.header');

const router = createRouter();

const {getMyInfo } =  require('../controllers/user.controller')

router.get('/home',auth,)
router.get('/my-info',auth, getMyInfo);

module.exports = router;