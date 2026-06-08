const { create } = require('../models/Roles');
const {createRouter,auth,errorValidate} = require('./routesServices/routes.header');
const authorize = require('../middleware/authorize.middleware');
const PERMISSIONS = require('../constants/permissions');
const { addEmployeeValidator, employeeValidator } = require('../validations/employeeValidations');
const authorizeEmployeeCreation = require('../middleware/authorizeEmpCreat.middleware');

const router = createRouter();

const {addEmployee,getEmployee,toggleStatus,addEmployeeByAdmin, updateEmployee} = require('../controllers/employee.controller');

router.post('/addEmployeeByAdmin',auth,authorize(PERMISSIONS.CREATE_EMPLOYEE),authorizeEmployeeCreation,employeeValidator,errorValidate,addEmployeeByAdmin);
router.get('/allEmployees',auth,getEmployee);
router.patch('/toggle/:userId',auth,toggleStatus);
router.put('/update/:userId',auth,(req,res,next)=>{ next();},authorize(PERMISSIONS.UPDATE_EMPLOYEE),(req,res,next)=>{ next();},employeeValidator,errorValidate,(req,res,next)=>{ next();},updateEmployee)
module.exports = router;