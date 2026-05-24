const User = require('../models/User.model')
const RoleModel = require('../models/Role.model');
const Employee=require('../models/Employee.model')
const bcrypt = require('bcrypt');
const {generateToken}=require('../utils/jwt')
const {verifyToken}=require('../utils/jwt')
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
        isVerified:false,
        status:'ACTIVE'
    });

    const verificationToken=generateToken({
        userId:user._id,
        email:user.email

    });

    const verificationLink=
    `http://localhost:5000/api/users/verify-email/${verificationToken}`;
    console.log("Verification Link",verificationLink)

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

exports.verifyEmployeeEmail=async(token)=>
{

    const decoded=verifyToken(token);
    const user=await User.findById(decoded.userId);

    if(!user){
        throw new ApiError(404,"User Not Found");
    }

    user.isVerified=true;
    await user.save();

    return {
        email:user.email,
        isVerified:user.isVerified,
        message:"Employee Email Verified successfully"
    };
};

exports.loginEmployee=async({email,password})=>
{
    const user=await User.findOne({email}).populate("roleId");

    if(!user)
    {
        throw new ApiError(404,"Employee Not Found");
    }

    const isPasswordMatch=await bcrypt.compare(password,user.passwordHash);

    if(!isPasswordMatch)
    {
        throw new ApiError(401,"Invalid Credentials");
    }

    if(!user.isVerified)
    {
        throw new ApiError(401,"Please verify your mail before login");
    }

    const loginToken=generateToken({
        userId:user._id,
        role:user.roleId.name,
        rolecode:user.roleId.roleCode

    },'1d');

    //this login token contains the user id and role id as the payload for the jwt token
    user.lastLoginAt=new Date();

    await user.save();


    return {
        token:loginToken,
        user:{
            id:user._id,
            firstName:user.firstName,
            lastName:user.lastName,
            email:user.email,
            roleId:user.roleId,
            status:user.status

        }
    };

    
};


exports.currentProfile=async(userId)=>
{
        const profile=await User.findById(userId)
        .select("-passwordHash");

        if(!profile)
        {
            throw new ApiError(401,"User is not found");
        }

        return profile;
   
}