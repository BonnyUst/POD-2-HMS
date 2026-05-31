const User = require('../models/User.model')
const RoleModel = require('../models/Role.model')
const Employee = require('../models/Employee.model')
const Doctor = require('../models/Doctor.model')
const bcrypt = require('bcrypt');
const ApiError = require('../utils/ApiError');

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

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new ApiError(409, 'User already exists with this email');
    }

    const doctorRole = await RoleModel.findOne({ name: 'Doctor' })

    if (!doctorRole) {
        throw new ApiError(404, 'Doctor Role Not Found');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
        firstName,
        lastName,
        email,
        passwordHash,
        roleId: doctorRole._id,
        isVerified: true,
        status: 'ACTIVE'
    });


    const employee = await Employee.create({
        userId: user._id,
        phone,
        department,
        designation,
        joiningDate,
    });

    const doctor = await Doctor.create({
        employeeId: employee._id,
        specialization,
        qualification,
        consultationFee,
        medicalRegistrationNo,
        availabilityStartTime,
        availabilityEndTime,
        experienceYears,
    });

    return {
        employeeCode:employee.employeeCode,
        doctorId:doctor._id,
        firstName:user.firstName,
        lastName:user.lastName,
        email:user.email,
        phone:employee.phone,
        role:doctorRole.name,
        department:employee.department,
        designation:employee.designation,
        joiningDate:employee.joiningDate,
        specialization:doctor.specialization,
        qualification:doctor.qualification,
        consultationFee:doctor.consultationFee,
        medicalRegistrationNo:doctor.medicalRegistrationNo,
        availabilityStartTime:doctor.availabilityStartTime,
        availabilityEndTime:doctor.availabilityEndTime,
        experienceYears:doctor.experienceYears,
        isVerified:user.isVerified,
        status:user.status
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