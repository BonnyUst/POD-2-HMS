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
    select: 'firstName lastName email phone status'
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

const updateDoctor = async (empObjectId, data) => {
  console.log("Incoming id : ", empObjectId)
  const emp = await Employee.findOne({employeeId : empObjectId});
  if (!emp) throw new ApiError(404, "Employee not found");

  const doctor = await Doctor.findOne({ employeeId: emp._id });
  if (!doctor) throw new ApiError(404, "Doctor not found");

  Object.assign(doctor, {
    medRegNo: data.medRegNo,
    specialization: data.specialization,
    qualification: data.qualification,
    consultationFee: data.consultationFee,
    avlblStartTime: data.avlblStartTime,
    avlblEndTime: data.avlblEndTime,
    expYears: data.expYears
  });

  Object.assign(emp, {
    designation: data.designation,
    joiningDate: data.joiningDate
  });

  await doctor.save();
  await emp.save();

  return { message: "Doctor updated successfully" };
};

const getDoctorsInfoByDept = async (deptName) => {

  const department = await Departments.findOne({ deptName });
  if (!department) throw new ApiError(404, "Department not found");

  const employees = await Employee.find({
    departmentId: department._id
  }).populate({
    path: 'userId',
    select: 'firstName lastName email phone status'
  });

  const empIds = employees.map(emp => emp._id);

  const doctors = await Doctor.find({
    employeeId: { $in: empIds }
  });

  const empMap = new Map();
  employees.forEach(emp => {
    empMap.set(emp._id.toString(), emp);
  });

  return doctors.map(doc => {
    const emp = empMap.get(doc.employeeId.toString());

    return {
      empObjectId: emp._id, // 🔥 IMPORTANT FOR UPDATE
      employeeId: emp.employeeId,

      firstName: emp.userId.firstName,
      lastName: emp.userId.lastName,
      email: emp.userId.email,
      phone: emp.userId.phone,
      status: emp.userId.status,

      designation: emp.designation,
      joiningDate: emp.joiningDate,

      medRegNo: doc.medRegNo,
      specialization: doc.specialization,
      qualification: doc.qualification,
      consultationFee: doc.consultationFee,
      avlblStartTime: doc.avlblStartTime,
      avlblEndTime: doc.avlblEndTime,
      expYears: doc.expYears
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
module.exports = { getDoctorsByDept,checkDoctor,getDoctorsInfoByDept, updateDoctor };