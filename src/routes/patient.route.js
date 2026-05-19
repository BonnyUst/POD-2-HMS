const express = require("express");

const router = express.Router();

const {
  createPatient,

  getAllPatients,

  updatePatient,

  deletePatient,
} = require("../controllers/patient.controller");

const jwtAuth = require("../middlewares/jwtAuth.middleware");

const authorize = require("../middlewares/authorize.middleware");

router.get(
  "/",

  jwtAuth,

  getAllPatients,
);

router.post(
  "/",

  jwtAuth,

  authorize("CREATE_PATIENT"),

  createPatient,
);

router.put(
  "/:id",

  jwtAuth,

  authorize("UPDATE_PATIENT"),

  updatePatient,
);

router.delete(
  "/:id",

  jwtAuth,

  authorize("DELETE_PATIENT"),

  deletePatient,
);

module.exports = router;
