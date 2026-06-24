const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authRoles = require("../middleware/authRoles");
const validate = require("../middleware/validate");

const permissions = require("../utils/permissions");
const patientController = require("../controller/patient.controller");

const {
  validateCreatePatient,
  validateUpdatePatient,
  validatePatientId,
  validateRegisterPatient,
} = require("../validation/patient.validation");

router.post(
  "/create",
  authMiddleware,
  authRoles(permissions.ADD_PATIENT),
  validateCreatePatient,
  validate,
  patientController.createPatient,
);

router.get(
  "/list",
  authMiddleware,
  authRoles(permissions.VIEW_PATIENT),
  patientController.getAllPatients,
);

router.delete(
  "/delete/:patientId",
  authMiddleware,
  authRoles(permissions.DELETE_PATIENT),
  patientController.softDeletePatient
)
// Self-registration by patients
router.post(
  "/register",
  validateRegisterPatient,
  validate,
  patientController.registerPatient,
);

router.put(
  "/update/:patientId",
  authMiddleware,
  authRoles(permissions.UPDATE_PATIENT),
  validateUpdatePatient,
  validate,
  patientController.updatePatient,
);

router.get("/profile", authMiddleware, patientController.getPatientProfile);

router.put("/profile", authMiddleware, patientController.updatePatientProfile);

module.exports = router;
