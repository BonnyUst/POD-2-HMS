const ApiError = require("../utils/ApiError");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const Employee = require("../models/employee.model");
const Role = require("../models/role.model");
const generateId = require("../utils/idGenerator");
const jwt = require("../utils/jwt");

const createAuthUser = async (userAuthData) => {
  const { firstName, lastName, email, password, phone, roleId } = userAuthData;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "User already exists with this email");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  return await User.create({
    firstName,
    lastName,
    email,
    phone,
    passwordHash,
    roleId,
  });
};

const createEmployee = async (employeeData) => {
  const { userId, EMPID, department, designation } = employeeData;

  return await Employee.create({
    userId,
    employeeCode: EMPID,
    department,
    designation,
    status: false,
    joiningDate: new Date(),
  });
};

const generateVerificationToken = (userId) => {
  return jwt.generateToken({
    payload: { userId },

    type: jwt.tokenType.VERIFY_EMAIL,
  });
};

const sendVerificationEmail = async (token) => {
  const verifyUrl = `http://localhost:3000/api/auth/verify?token=${token}`;

  console.log("Click to verify:", verifyUrl);
};

const createUser = async (userData) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phone,
    roleName,
    department,
    designation,
  } = userData;

  const role = await Role.findOne({
    name: roleName.toUpperCase(),
  });

  if (!role) {
    throw new ApiError(404, "Role not found");
  }

  const user = await createAuthUser({
    firstName,
    lastName,
    email,
    password,
    phone,
    roleId: role._id,
  });

  const EMPID = await generateId({
    roleId: role._id,
    roleCode: role.code,
  });

  const employee = await createEmployee({
    userId: user._id,
    EMPID,
    department,
    designation,
  });

  const token = generateVerificationToken(user._id);

  await sendVerificationEmail(token);

  return {
    EMPID: employee.employeeCode,

    firstName: user.firstName,

    lastName: user.lastName,

    email: user.email,

    phone: user.phone,

    department: employee.department,

    designation: employee.designation,

    joiningDate: employee.joiningDate,
  };
};

const updateProfile = async (userId, profileData) => {
  const allowedFields = [
    "firstName",

    "lastName",

    "phone",

    "gender",

    "address",

    "dateOfBirth",

    "profileImage",
  ];

  const updates = {};

  allowedFields.forEach((field) => {
    if (profileData[field] !== undefined) {
      updates[field] = profileData[field];
    }
  });

  const updatedUser = await User.findByIdAndUpdate(
    userId,

    updates,

    {
      new: true,
    },
  );

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  return updatedUser;
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select("+passwordHash");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);

  if (!isMatch) {
    throw new ApiError(401, "Current password is incorrect");
  }

  const newPasswordHash = await bcrypt.hash(newPassword, 12);

  user.passwordHash = newPasswordHash;

  await user.save();

  return {
    message: "Password updated successfully",
  };
};

const getAllEmployees = async () => {
  const employees = await Employee.find()

    .populate({
      path: "userId",

      populate: {
        path: "roleId",
      },
    });

  return employees.map((employee) => ({
    _id: employee.userId?._id,

    employeeId: employee._id,

    EMPID: employee.employeeCode,

    firstName: employee.userId?.firstName,

    lastName: employee.userId?.lastName,

    email: employee.userId?.email,

    phone: employee.userId?.phone,

    role: employee.userId?.roleId?.code,

    roleName: employee.userId?.roleId?.name,

    department: employee.department,

    designation: employee.designation,

    joiningDate: employee.joiningDate,
  }));
};

const deleteEmployee = async (employeeId) => {
  const employee = await Employee.findById(employeeId);

  if (!employee) {
    throw new ApiError(404, "Employee not found");
  }

  await User.findByIdAndDelete(employee.userId);

  await Employee.findByIdAndDelete(employeeId);

  return {
    message: "Employee deleted successfully",
  };
};

const updateUser = async (userId, userData) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    roleName,
    department,
    designation,
  } = userData;

  const role = await Role.findOne({
    name: roleName.toUpperCase(),
  });

  if (!role) {
    throw new ApiError(404, "Role not found");
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,

    {
      firstName,
      lastName,
      email,
      phone,
      roleId: role._id,
    },

    {
      new: true,
    },
  );

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  await Employee.findOneAndUpdate(
    {
      userId,
    },

    {
      department,
      designation,
    },
  );

  return updatedUser;
};

module.exports = {
  createUser,
  createAuthUser,
  createEmployee,
  generateVerificationToken,
  sendVerificationEmail,
  getAllEmployees,
  deleteEmployee,
  updateProfile,
  changePassword,
  updateUser,
};
