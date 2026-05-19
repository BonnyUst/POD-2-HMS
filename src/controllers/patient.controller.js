const asyncHandler = require("express-async-handler");

const ApiResponse = require("../utils/ApiResponse");

const patientService = require("../services/patient.service");

const createPatient = asyncHandler(
  async (
    req,

    res,
  ) => {
    const savedPatient = await patientService.createPatient(req.body);

    res.status(201).json(new ApiResponse(201, savedPatient));
  },
);

const getAllPatients = asyncHandler(
  async (
    req,

    res,
  ) => {
    const patients = await patientService.getAllPatients();

    res.status(200).json(new ApiResponse(200, patients));
  },
);

const updatePatient = asyncHandler(
  async (
    req,

    res,
  ) => {
    const { id } = req.params;

    const updatedPatient = await patientService.updatePatient(
      id,

      req.body,
    );

    res.status(200).json(new ApiResponse(200, updatedPatient));
  },
);

const deletePatient = asyncHandler(
  async (
    req,

    res,
  ) => {
    const { id } = req.params;

    const response = await patientService.deletePatient(id);

    res.status(200).json(new ApiResponse(200, response));
  },
);

module.exports = {
  createPatient,

  getAllPatients,

  updatePatient,

  deletePatient,
};
