const User = require('../models/User.model')
const RoleModel = require('../models/Role.model');
const Employee=require('../models/Employee.model')
const bcrypt = require('bcrypt');

const ApiError=require('../utils/ApiError');

exports.createEmployeeUser = async (userData) => {
    const {
        firstName,
        lastName,
        email,
        password,
        phone,
        department,
        designation,
        joiningDate,
        medicalRegistrationNo,
        specialization,
        qualification,
        consultationFee,
        availabilitySlots,
    } = userData;

    const existingUser = await User.findOne({
        email
    });

    if (existingUser) {
       throw new ApiError(409, 'User already exists with this email');
    }

    const employeeRole = await RoleModel.findOne({ name: 'Employee' });
    
    if (!employeeRole) {
        throw new ApiError(404, 'Employee role Not Found');
    }
   
    const passwordHash = await bcrypt.hash(password,10);
    // const passwordHash = 'asdfsdfasdgasdgasdg';
    
    const user = await User.create({
        firstName,
        lastName,
        email,
        passwordHash,
        roleId: employeeRole._id,
        isVerified:false,
        status:'ACTIVE'
    });


    const employee = await Employee.create({
        userId: user._id,
        phone,
        department,
        designation,
        joiningDate,
        medicalRegistrationNo,
        specialization,
        qualification,
        consultationFee,
        availabilitySlots

    });

    return {
       employeeCode: employee.employeeCode,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: employee.phone,
        role:employeeRole.name,
        department: employee.department,
        designation: employee.designation,
        joiningDate: employee.joiningDate,
        medicalRegistrationNo: employee.medicalRegistrationNo,
        specialization: employee.specialization,
        qualification: employee.qualification,
        consultationFee: employee.consultationFee,
        availabilitySlots: employee.availabilitySlots,
        isVerified: user.isVerified,
        status:user.status

    };
}
