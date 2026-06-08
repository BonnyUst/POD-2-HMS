const { create } = require('../models/Roles');
const {createRouter,auth,errorValidate} = require('./routesServices/routes.header');
const authorize = require('../middleware/authorize.middleware');
const PERMISSIONS = require('../constants/permissions');
const authorizeAppointment = require('../middleware/authorizeAppointment');
const { createAppointment,getAppointments,getAppointmentById,updateAppointment,deleteAppointment} = require('../controllers/appointment.controller')
const router = createRouter();

router.post('/addAppointment',auth,authorize(PERMISSIONS.CREATE_APPOINTMENT),authorizeAppointment('CREATE'), (req,res,next)=>{ next();},createAppointment);
router.get('/getAppointments',auth,getAppointments);
router.get('/getApmntById/:id',auth,getAppointmentById);
router.put('/updateAppointment/:id',auth,updateAppointment);
router.delete('/delete/:id',auth,deleteAppointment);

module.exports = router;
