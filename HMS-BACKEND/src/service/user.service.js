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
        isVerified:true,
        status:'ACTIVE'
    });

   
    const employee = await Employee.create({
        userId: user._id,
        phone,
        department,
        designation,
        joiningDate,

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
        isVerified: user.isVerified,
        status:user.status

    };
}


exports.currentProfile=async(userId)=>
{
        const profile=await User.findById(userId)
        .select("-passwordHash")
        .populate("roleId");

        if(!profile)
        {
            throw new ApiError(401,"User is not found");
        }

        return profile;
   
}