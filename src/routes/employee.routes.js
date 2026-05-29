const { create } = require('../models/Roles');
const {createRouter,auth,errorValidate} = require('./routesServices/routes.header');
const authorize = require('../middleware/authorize.middleware');
const PERMISSIONS = require('../constants/permissions');
const { addEmployeeValidator } = require('../validations/employeeValidations');
const authorizeEmployeeCreation = require('../middleware/authorizeEmpCreat.middleware');

const router = createRouter();

const {addEmployee,getEmployee,toggleStatus,addEmployeeByAdmin} = require('../controllers/employee.controller');
// router.post('/addEmployee',auth,authorize(PERMISSIONS.CREATE_EMPLOYEE),addEmployeeValidator,errorValidate,addEmployee);
router.post('/addEmployeeByAdmin',auth,authorize(PERMISSIONS.CREATE_EMPLOYEE),authorizeEmployeeCreation,errorValidate,addEmployeeByAdmin);
router.get('/allEmployees',auth,getEmployee);
router.patch('/toggle/:userId',auth,toggleStatus);
module.exports = router;