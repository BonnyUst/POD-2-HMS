const PERMISSIONS = require('../constants/permissions');
const authorize = require('../middleware/authorize.middleware');
const { create } = require('../models/Roles');
const {createRouter,auth,errorValidate} = require('./routesServices/routes.header');
const { createPatient,getReceptionistDashboard } = require('../controllers/receptionist.controller');

const authorizeAppointment = require('../middleware/authorizeAppointment');
const {createAppointment} = require('../controllers/appointment.controller');

const router = createRouter();

router.post('/addPatient',auth,authorize(PERMISSIONS.CREATE_PATIENT),createPatient)
router.post('/addAppointment',auth,authorize(PERMISSIONS.CREATE_APPOINTMENT),authorizeAppointment('CREATE'), createAppointment);
router.get(
  '/receptionist-dashboard',
  auth,
  getReceptionistDashboard
);

module.exports = router;
