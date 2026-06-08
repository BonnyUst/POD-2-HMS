const Doctor = require('../models/Doctor');
const Employee = require('../models/Employee');
const Departments = require('../models/Departments');
const ApiError = require('../utils/ApiError');
const { STATUS } = require('../constants/basic.constant');
const User = require('../models/User');
const Appointment = require('../models/Appointments');

const getDoctorsByDept = async (deptName) => {

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
      employeeId: emp.employeeId, // ✅ DOC-260001
      name: `${emp.userId.firstName} ${emp.userId.lastName}`
    };
  });
};






























const updateDoctor = async (empObjectId, data) => {

  


  const emp = await Employee.findOne({ employeeId: empObjectId });
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


  await User.findByIdAndUpdate(emp.userId, {
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
    email: data.email   // optional if editable
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

const getDoctorDashboard = async(userId)=>{

  const employee = await Employee.findOne({ userId }).populate('departmentId');
  if (!employee) throw new Error("Employee not found");


  const doctor = await Doctor.findOne({ employeeId: employee._id });
  if (!doctor) throw new Error("Doctor not found");


  const user = await User.findById(userId);


  const todayStart = new Date();
  todayStart.setHours(0,0,0,0);

  const todayEnd = new Date();
  todayEnd.setHours(23,59,59,999);





  const todayAppointments = await Appointment.countDocuments({
    doctorId: doctor._id,
    appointmentDate: { $gte: todayStart, $lte: todayEnd },
    isDeleted: false
  });

  const completed = await Appointment.countDocuments({
    doctorId: doctor._id,
    status: "COMPLETED",
    appointmentDate: { $gte: todayStart, $lte: todayEnd },
    isDeleted: false
  });

  const pending = await Appointment.countDocuments({
    doctorId: doctor._id,
    status: "BOOKED",
    appointmentDate: { $gte: todayStart, $lte: todayEnd },
    isDeleted: false
  });

  const cancelled = await Appointment.countDocuments({
    doctorId: doctor._id,
    status: "CANCELLED",
    appointmentDate: { $gte: todayStart, $lte: todayEnd },
    isDeleted: false
  });





  const appointments = await Appointment.find({
    doctorId: doctor._id,
    appointmentDate: { $gte: todayStart, $lte: todayEnd },
    isDeleted: false
  })
    .populate('patientId', 'UHID')
    .populate('departmentId', 'deptName')
    .sort({ "timeslot.start": 1 })
    .lean();

  return {
    doctorInfo: {
      name: `${user.firstName} ${user.lastName}`,
      department: employee.departmentId?.deptName,
      specialization: doctor.specialization
    },

    stats: {
      todayAppointments,
      completed,
      pending,
      cancelled
    },

    todayAppointments: appointments
  };

}
module.exports = { getDoctorsByDept,checkDoctor,getDoctorsInfoByDept, updateDoctor,getDoctorDashboard };