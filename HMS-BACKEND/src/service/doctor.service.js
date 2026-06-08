const User = require('../models/User.model')
const RoleModel = require('../models/Role.model')
const Employee = require('../models/Employee.model')
const Doctor = require('../models/Doctor.model')
const bcrypt = require('bcrypt');
const ApiError = require('../utils/ApiError');
const userService = require('./user.service')

exports.createDoctorByAdmin = async (doctorData) => {
    const {
        firstName,
        lastName,
        email,
        password,
        phone,
        department,
        designation,
        joiningDate,

        specialization,
        qualification,
        consultationFee,
        medicalRegistrationNo,
        availabilityStartTime,
        availabilityEndTime,
        experienceYears
    } = doctorData;

    const existingDoctor = await Doctor.findOne({ medicalRegistrationNo });


    if (existingDoctor) {
        throw new ApiError(409, 'Medical registration number already exists');
    }


    const employeeData = await userService.createEmployeeUser({
        firstName,
        lastName,
        email,
        password,
        phone,
        role: 'Doctor',
        department,
        designation,
        joiningDate

    });

    const doctor = await Doctor.create({
        employeeId: employeeData.employeeId,
        specialization,
        qualification,
        consultationFee,
        medicalRegistrationNo,
        availabilityStartTime,
        availabilityEndTime,
        experienceYears,
    });


    return {
        employeeId: employeeData.employeeId,
        employeeCode: employeeData.employeeCode,
        doctorId: doctor._id,
        firstName: employeeData.firstName,
        lastName: employeeData.lastName,
        email: employeeData.email,
        phone: employeeData.phone,
        role: employeeData.role,
        department: employeeData.department,
        designation: employeeData.designation,
        joiningDate: employeeData.joiningDate,
        specialization: doctor.specialization,
        qualification: doctor.qualification,
        consultationFee: doctor.consultationFee,
        medicalRegistrationNo: doctor.medicalRegistrationNo,
        availabilityStartTime: doctor.availabilityStartTime,
        availabilityEndTime: doctor.availabilityEndTime,
        experienceYears: doctor.experienceYears,

        isVerified: employeeData.isVerified,
        status: employeeData.status,
        mustChangePassword: employeeData.mustChangePassword,
        emailSent: employeeData.emailSent
    };

};

exports.getAllDoctors = async () => {
    const doctors = await Doctor.find()
        .populate({
            path: 'employeeId',
            populate: {
                path: 'userId',
                select: 'firstName lastName email phone status isVerified'
            }
        })
        .sort({ createdAt: -1 });

    return doctors.map((doctor) => ({
        doctorId: doctor._id,

        employeeId: doctor.employeeId?._id,
        employeeCode: doctor.employeeId?.employeeCode,

        firstName: doctor.employeeId?.userId?.firstName,
        lastName: doctor.employeeId?.userId?.lastName,
        email: doctor.employeeId?.userId?.email,
        phone: doctor.employeeId?.phone,

        specialization: doctor.specialization,
        qualification: doctor.qualification,
        consultationFee: doctor.consultationFee,
        medicalRegistrationNo: doctor.medicalRegistrationNo,
        availabilityStartTime: doctor.availabilityStartTime,
        availabilityEndTime: doctor.availabilityEndTime,
        experienceYears: doctor.experienceYears,

        status: doctor.employeeId?.userId?.status,
        isVerified: doctor.employeeId?.userId?.isVerified
    }));
};