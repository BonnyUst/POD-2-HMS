const Employee = require('../models/Employee')
const Appointment = require('../models/Appointments')
const Approval = require('../models/Approvals')

const getAdminDashboard = async(userId)=>{
     // 1. Get admin employee record
  const employee = await Employee.findOne({ userId });

  if (!employee) throw new Error("Employee not found");

  const departmentId = employee.departmentId;

  // 2. Total Employees in same department
  const totalEmployees = await Employee.countDocuments({
    departmentId
  });

  // 3. Total Appointments in same department
  const totalAppointments = await Appointment.countDocuments({
    departmentId
  });

  // 4. Total Approvals in same department
  const totalApprovals = await Approval.countDocuments({
    deptName: departmentId
  });

  return {
    totalEmployees,
    totalAppointments,
    totalApprovals
  };
  
}

module.exports = { getAdminDashboard, }