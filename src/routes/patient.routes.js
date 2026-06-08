const { create } = require('../models/Roles');
const {createRouter,auth,errorValidate} = require('./routesServices/routes.header');
const {getPatients,addPatient, checkPatient, updatePatient, deletePatient, togglePatientStatus}= require('../controllers/patient.controller');
const PERMISSIONS = require('../constants/permissions');
const { patientValidator } = require('../validations/patientValidation');
const authorize = require('../middleware/authorize.middleware');

const router = createRouter();



router.get('/allPatients',auth,authorize(PERMISSIONS.READ_PATIENT),getPatients);
router.post('/addPatient',auth,authorize(PERMISSIONS.CREATE_PATIENT),patientValidator,errorValidate,addPatient);
router.get('/checkPatient/:UHID',auth,checkPatient);
router.put('/update/:id',auth,authorize(PERMISSIONS.UPDATE_PATIENT),patientValidator,errorValidate,updatePatient);
router.delete('/delete/:id', auth, deletePatient);
router.patch('/toggle/:userId',auth,togglePatientStatus);

module.exports = router;
