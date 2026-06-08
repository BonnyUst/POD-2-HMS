const { create } = require('../models/Roles');
const {createRouter,auth,errorValidate} = require('./routesServices/routes.header');

const router = createRouter();

const {getMyInfo,getMyProfile } =  require('../controllers/user.controller');











router.get('/profile',auth,getMyProfile);

module.exports = router;