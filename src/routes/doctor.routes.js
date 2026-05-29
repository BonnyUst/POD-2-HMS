const PERMISSIONS = require('../constants/permissions');
const authorize = require('../middleware/authorize.middleware');
const {createRouter,auth,errorValidate} = require('./routesServices/routes.header');
const {getDoctorsByDept,checkDoctor} = require('../controllers/doctor.controller');

const router = createRouter();

router.get('/getDocByDept',auth,authorize(PERMISSIONS.READ_DOCTOR),getDoctorsByDept);
router.get('/checkDoctor/:empId',auth,checkDoctor)

module.exports = router;