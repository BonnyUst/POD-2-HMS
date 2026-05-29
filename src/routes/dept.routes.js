const PERMISSIONS = require('../constants/permissions');
const authorize = require('../middleware/authorize.middleware');
const {createRouter,auth,errorValidate} = require('./routesServices/routes.header');
const {getDepartmentEmployees,getAllDepartments} = require('../controllers/dept.controller')
const router = createRouter();

router.get('/department-employees',auth,authorize(PERMISSIONS.READ_DEPARTMENT),getDepartmentEmployees);
router.get('/allDepartments',auth,authorize(PERMISSIONS.READ_DEPARTMENT),getAllDepartments)

module.exports = router;