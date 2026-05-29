const Doctor = require('../models/Doctor');
const Employee = require('../models/Employee');
const Departments = require('../models/Departments');
const ApiError = require('../utils/ApiError');
const { STATUS } = require('../constants/basic.constant');

const getDoctorsByDept = async (deptName) => {

  const department = await Departments.findOne({ deptName });
  if (!department) throw new ApiError(404, "Department not found");

  // 🔥 STEP 1: GET EMPLOYEES IN THIS DEPARTMENT
  const employees = await Employee.find({
    departmentId: department._id
  }).populate({
    path: 'userId',
    select: 'firstName lastName'
  });

  // 🔥 STEP 2: GET EMPLOYEE IDs
  const empIds = employees.map(emp => emp._id);

  // 🔥 STEP 3: GET DOCTORS USING OBJECT ID
  const doctors = await Doctor.find({
    employeeId: { $in: empIds }
  });

  // 🔥 STEP 4: MAP EMPLOYEE DATA
  const empMap = new Map();
  employees.forEach(emp => {
    empMap.set(emp._id.toString(), emp);
  });

  // 🔥 STEP 5: FINAL RESPONSE
  return doctors.map(doc => {
    const emp = empMap.get(doc.employeeId.toString());

    return {
      employeeId: emp.employeeId, // ✅ DOC-260001
      name: `${emp.userId.firstName} ${emp.userId.lastName}`
    };
  });
};

const checkDoctor = async (empId) => {

  const emp = await Employee.findOne({ employeeId: empId });
  if (!emp) throw new ApiError(404, "Doctor employee not found");

  const doctor = await Doctor.findOne({ employeeId: emp._id });
  if (!doctor) throw new ApiError(404, "Doctor not found");

  return {
    employeeId: emp.employeeId,
    status : STATUS.ACTIVE,
    message: "Doctor exists"
  };
};
module.exports = { getDoctorsByDept,checkDoctor };