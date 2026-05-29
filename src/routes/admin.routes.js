const { create } = require('../models/Roles');
const {createRouter,auth,errorValidate} = require('./routesServices/routes.header');
const {getAdminDashboard} = require('../controllers/admin.controller')
const router = createRouter();

router.get('/dashboard',auth,getAdminDashboard);

module.exports = router;