const { create } = require('../models/Roles');
const {createRouter,auth,errorValidate} = require('./routesServices/routes.header');
const {registerApproval, verifyEmail,resendVerificationEmail,getApprovals,approve,reject} = require('../controllers/approval.controller');
const authorize = require('../middleware/authorize.middleware');
const PERMISSIONS = require('../constants/permissions');

const router = createRouter();

router.post('/register',registerApproval);
router.get('/verify/:token',verifyEmail);
router.post('/resend-verification',resendVerificationEmail)

router.get('/approval', auth,authorize(PERMISSIONS.READ_APPROVALS), getApprovals);
router.patch('/:id/approve', auth,authorize(PERMISSIONS.UPDATE_APPROVALS), approve);
router.patch('/:id/reject', auth,authorize(PERMISSIONS.UPDATE_APPROVALS), reject);

module.exports = router;
