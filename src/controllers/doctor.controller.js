const ApiResponse = require('../utils/ApiResponse')
const asyncHandler = require('express-async-handler');
const doctorService = require('../services/doctor.services');
const Employee = require('../models/Employee');
const Departments = require('../models/Departments');

exports.getDoctorsByDept = asyncHandler(async (req, res) => {

    let { dept } = req.query; // 🔥 change const → let


    if (!dept || dept === "null") {

        const adminUserId = req.user.userId;

        const adminEmp = await Employee.findOne({ userId: adminUserId });

        if (!adminEmp) {
            throw new ApiError(404, "Admin Employee not found");
        }

        const adminDept = await Departments.findById(adminEmp.departmentId);

        if (!adminDept) {
            throw new ApiError(404, "Department not found");
        }

        dept = adminDept.deptName; // ✅ now works
    }

    

    const data = await doctorService.getDoctorsByDept(dept);

    return res.status(200).json(new ApiResponse(200, data));
});

exports.getDoctorsInfoByDept = asyncHandler(async (req, res) => {

    let { dept } = req.query; // 🔥 change const → let


    if (!dept || dept === "null") {

        const adminUserId = req.user.userId;

        const adminEmp = await Employee.findOne({ userId: adminUserId });

        if (!adminEmp) {
            throw new ApiError(404, "Admin Employee not found");
        }

        const adminDept = await Departments.findById(adminEmp.departmentId);

        if (!adminDept) {
            throw new ApiError(404, "Department not found");
        }

        dept = adminDept.deptName; // ✅ now works
    }

    

    const data = await doctorService.getDoctorsInfoByDept(dept);

    return res.status(200).json(new ApiResponse(200, data));
});

exports.checkDoctor = asyncHandler(async(req,res)=>{
    const { empId } = req.params;

    const data = await doctorService.checkDoctor(empId);

    return res.status(200).json(new ApiResponse(200, data));
})

exports.updateDoctor = asyncHandler(async (req, res) => {
  const { empId } = req.params;
  const data = await doctorService.updateDoctor(empId, req.body);
  res.status(200).json(new ApiResponse(200, data));
});

exports.getDashboard = asyncHandler(async(req,res)=>{
    const userId = req.user.userId;
    const data = await doctorService.getDoctorDashboard(userId);
    return res.status(200).send(new ApiResponse(200,data));
})

