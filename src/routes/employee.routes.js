const { create } = require('../models/Roles');
const {createRouter,auth,errorValidate} = require('./routesServices/routes.header');
const authorize = require('../middleware/authorize.middleware');
const PERMISSIONS = require('../constants/permissions');
const { addEmployeeValidator } = require('../validations/employeeValidations');

const router = createRouter();

const {addEmployee,} = require('../controllers/employee.controller');

router.post('/addEmployee',auth,authorize(PERMISSIONS.CREATE_EMPLOYEE),addEmployeeValidator,errorValidate,addEmployee);

module.exports = router;