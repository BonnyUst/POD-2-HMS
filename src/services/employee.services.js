const ApiError = require('../utils/ApiError');
const generateId = require('../utils/idGenerator');
const User = require('../models/User');
const Roles = require('../models/Roles');
const Employee = require('../models/Employee');
const Doctor = require('../models/Doctor');
const userService = require('./user.services');
const Departments = require('../models/Departments');
const ROLES = require('../constants/role.constant');

const addEmployee = async (data) => {
    let newUser;

    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            password,
            roleName,
            deptName,
            designation,
            joiningDate,
            // doctor fields
            medRegNo,
            specialization,
            qualification,
            consultationFee,
            avlblStartTime,
            avlblEndTime,
            expYears
        } = data;

        // ✅ Check user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new ApiError(409, "User already exists");
        }

        // ✅ Create User
        newUser = await userService.createBasicUser({
            firstName,
            lastName,
            email,
            phone,
            password
        });

        // ✅ Get Role
        const employeeRole = await Roles.findOne({ roleName });
        if (!employeeRole) {
            throw new ApiError(404, "Role not found");
        }

        // ✅ Generate Employee ID
        const genEmployeeId = await generateId(employeeRole.roleId);

        // ✅ Get Department
        const department = await Departments.findOne({ deptName });
        if (!department) {
            throw new ApiError(404, "Department not found");
        }

        // ✅ Create Employee
        const newEmployee = await Employee.create({
            userId: newUser._id,
            employeeId: genEmployeeId,
            departmentIds: [department._id],
            designation,
            joiningDate
        });

        // ✅ If role is DOCTOR → create Doctor
        if (roleName?.toUpperCase() === ROLES.DOCTOR.roleName) {
            if (
                !medRegNo ||
                !specialization ||
                !qualification ||
                consultationFee == null ||
                expYears == null
            ) {
                throw new ApiError(400, "Doctor details are required");
            }

            await Doctor.create({
                employeeId: newEmployee._id, // 🔥 correct reference
                medRegNo,
                specialization,
                qualification,
                consultationFee,
                avlblStartTime,
                avlblEndTime,
                expYears
            });
        }

        return newEmployee;

    } catch (error) {
        // ⚠️ Rollback user if something fails
        if (newUser) {
            await User.findByIdAndDelete(newUser._id);
        }
        throw error;
    }
};

module.exports = { addEmployee };