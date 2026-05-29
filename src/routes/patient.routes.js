const { create } = require('../models/Roles');
const {createRouter,auth,errorValidate} = require('./routesServices/routes.header');
const {getPatients,addPatient, checkPatient}= require('../controllers/patient.controller')
const router = createRouter();
// /api/patients/

router.get('/allPatients',auth,getPatients);
router.post('/addPatient',auth,addPatient);
router.get('/checkPatient/:UHID',auth,checkPatient)
module.exports = router;
