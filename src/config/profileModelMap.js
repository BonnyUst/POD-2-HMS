const Patient = require("../models/patient.model");
const Employee = require("../models/employee.model");
const Doctor = require("../models/doctor.model");
const profileModelMap = {
  PAT: Patient,
  ADM: Employee,
  DOC: Employee,
  REC: Employee,
};
module.exports = profileModelMap;
