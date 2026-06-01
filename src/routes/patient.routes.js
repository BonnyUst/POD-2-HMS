const { create } = require('../models/Roles');
const {createRouter,auth,errorValidate} = require('./routesServices/routes.header');
const {getPatients,addPatient, checkPatient, updatePatient, deletePatient, togglePatientStatus}= require('../controllers/patient.controller')
const router = createRouter();
// /api/patients/

router.get('/allPatients',auth,getPatients);
router.post('/addPatient',auth,addPatient);
router.get('/checkPatient/:UHID',auth,checkPatient);
router.put('/update/:id',auth,updatePatient);
router.delete('/delete/:id', auth, deletePatient);
router.patch('/toggle/:userId',auth,togglePatientStatus);

module.exports = router;
