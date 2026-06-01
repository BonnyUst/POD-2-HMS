const ApiError = require('../utils/ApiError')
const generateId = require('../utils/idGenerator');
const Appointment = require('../models/Appointments');
const Patient = require('../models/Patient')
const Doctor = require('../models/Doctor')
const Employee = require('../models/Employee')
const Departments = require('../models/Departments')
// const departments = require('../constants/dept.constant');

const createAppointment = async (data, user) => {
console.log("Create appointment service running");

  const {
    patientUHID,
    doctorEmployeeId,
    deptName,
    appointmentDate,
    timeslot
  } = data;

  // =========================
  // 🔥 GET EMPLOYEE FROM USERID
  // =========================

  console.log("incoming patientUHID : ", patientUHID);

  const createdByEmp = await Employee.findOne({ userId: user.userId });
  console.log("USER : ",user);
  console.log("Employee : ",createdByEmp)
  if (!createdByEmp) {
    throw new ApiError(404, "Employee not found");
  }

  // =========================
  // PATIENT
  // =========================
  const patient = await Patient.findOne({ UHID: patientUHID });
  if (!patient) throw new ApiError(404, "Patient not found");

  // =========================
  // DOCTOR
  // =========================
  const empDoctor = await Employee.findOne({ employeeId: doctorEmployeeId });
  if (!empDoctor) throw new ApiError(404, "Doctor employee not found");

  const doctor = await Doctor.findOne({ employeeId: empDoctor._id });
  if (!doctor) throw new ApiError(404, "Doctor not found");

  // =========================
  // DEPARTMENT
  // =========================
  const department = await Departments.findOne({ deptName });
  if (!department) throw new ApiError(404, "Department not found");

  // =========================
  // VALIDATION
  // =========================
  if (empDoctor.departmentId.toString() !== department._id.toString()) {
    throw new ApiError(400, "Doctor not belongs to selected department");
  }

  // =========================
  // SLOT CHECK
  // =========================
  const conflict = await Appointment.findOne({
    doctorId: doctor._id,
    appointmentDate,
    "timeslot.start": timeslot.start,
    isDeleted: false
  });

  if (conflict) {
    throw new ApiError(409, "Doctor already booked for this slot");
  }

  // =========================
  // CREATE
  // =========================
  const appointmentId = await generateId(`APMNT-${department.deptId}`);

  return await Appointment.create({
    appointmentId,
    patientId: patient._id,
    doctorId: doctor._id,
    departmentId: department._id,
    appointmentDate,
    timeslot,
    createdByEmployeeId: createdByEmp._id // ✅ CORRECT
  });
};

const getAppointments = async (query) => {

  const page = parseInt(query.page) || 1;
  const limit = Math.min(parseInt(query.limit) || 10, 30);
  const skip = (page - 1) * limit;

  const data = await Appointment.find({ isDeleted: false })
    // .populate({
    //   path : 'patientId',
    //   model : 'Patient',
    //   select : 'UHID'
    // })
    .populate('patientId')
    .populate('doctorId')
    .populate('departmentId', 'deptName')
    .skip(skip)
    .limit(limit)
    .lean();

  console.log('My Appointment : ', data);

  const total = await Appointment.countDocuments({ isDeleted: false });

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

const getAppointmentById = async (id) => {

  const data = await Appointment.findById(id)
    .populate('patientId')
    .populate('doctorId')
    .populate('departmentId');

  if (!data || data.isDeleted) {
    throw new ApiError(404, "Appointment not found");
  }

  return data;
};

const updateAppointment = async (id, data) => {

  const appointment = await Appointment.findById(id);
  if (!appointment || appointment.isDeleted) {
    throw new ApiError(404, "Appointment not found");
  }

  const {
    appointmentDate,
    timeslot
  } = data;

  // 🔥 SLOT CHECK (exclude current)
  const conflict = await Appointment.findOne({
    _id: { $ne: id },
    doctorId: appointment.doctorId,
    appointmentDate,
    "timeslot.start": timeslot.start,
    isDeleted: false
  });

  if (conflict) {
    throw new ApiError(409, "Slot already booked");
  }

  appointment.appointmentDate = appointmentDate;
  appointment.timeslot = timeslot;

  return await appointment.save();
};

const softDelete = async (id) => {

  const appointment = await Appointment.findById(id);

  if (!appointment || appointment.isDeleted) {
    throw new ApiError(404, "Appointment not found");
  }

  appointment.isDeleted = true;

  return await appointment.save();
};

module.exports = { createAppointment , getAppointments, getAppointmentById, updateAppointment, softDelete, };