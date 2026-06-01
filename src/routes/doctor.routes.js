const PERMISSIONS = require('../constants/permissions');
const authorize = require('../middleware/authorize.middleware');
const {createRouter,auth,errorValidate} = require('./routesServices/routes.header');
const {getDoctorsByDept,checkDoctor, getDoctorsInfoByDept,updateDoctor} = require('../controllers/doctor.controller');

const router = createRouter();

router.get('/getDocByDept',auth,authorize(PERMISSIONS.READ_DOCTOR),getDoctorsByDept);

router.get('/getDocInfoByDept',auth,authorize(PERMISSIONS.READ_DOCTOR),getDoctorsInfoByDept);

router.get('/checkDoctor/:empId',auth,checkDoctor)
router.put('/updateDoctor/:empId', auth, updateDoctor);
module.exports = router;