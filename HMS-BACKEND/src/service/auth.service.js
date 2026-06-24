const User = require(
  "../models/User.model"
);

const bcrypt = require("bcrypt");

const {
  generateToken,
  verifyToken,
} = require("../utils/jwt");

const ApiError = require(
  "../utils/ApiError"
);

exports.loginEmployee = async ({
  email,
  password,
}) => {
  const normalizedEmail = email
    .trim()
    .toLowerCase();

  const user = await User.findOne({
    email: normalizedEmail,
  }).populate("roleId");

  if (!user) {
    throw new ApiError(
      404,
      "Employee not found"
    );
  }

  if (user.status !== "ACTIVE") {
    throw new ApiError(
      403,
      "This account is inactive"
    );
  }

  const isPasswordMatch =
    await bcrypt.compare(
      password,
      user.passwordHash
    );

  if (!isPasswordMatch) {
    throw new ApiError(
      401,
      "Invalid credentials"
    );
  }

  if (!user.isVerified) {
    throw new ApiError(
      401,
      "Please verify your email before login"
    );
  }

  const loginToken = generateToken(
    {
      userId: user._id,
      role: user.roleId.name,
      rolecode: user.roleId.roleCode,
      basePath: user.roleId.basePath,
    },
    "1d"
  );

  user.lastLoginAt = new Date();

  await user.save();

  return {
    token: loginToken,

    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      roleId: user.roleId,
      status: user.status,

      mustChangePassword: Boolean(
        user.mustChangePassword
      ),
    },
  };
};

exports.verifyEmployeeEmail = async (
  token
) => {
  const decoded = verifyToken(token);

  const user = await User.findById(
    decoded.userId
  );

  if (!user) {
    throw new ApiError(
      404,
      "User not found"
    );
  }

  user.isVerified = true;

  await user.save();

  return {
    email: user.email,
    isVerified: user.isVerified,
    message:
      "Employee email verified successfully",
  };
};

exports.changePassword = async (
  userId,
  {
    oldPassword,
    newPassword,
  }
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(
      404,
      "User not found"
    );
  }

  const isOldPasswordMatch =
    await bcrypt.compare(
      oldPassword,
      user.passwordHash
    );

  if (!isOldPasswordMatch) {
    throw new ApiError(
      401,
      "Old password is incorrect"
    );
  }

  const isSamePassword =
    await bcrypt.compare(
      newPassword,
      user.passwordHash
    );

  if (isSamePassword) {
    throw new ApiError(
      400,
      "New password cannot be the same as the current password"
    );
  }

  const newPasswordHash =
    await bcrypt.hash(newPassword, 10);

  user.passwordHash = newPasswordHash;
  user.mustChangePassword = false;

  await user.save();

  return {
    email: user.email,
    mustChangePassword:
      user.mustChangePassword,
  };
};

exports.changeFirstLoginPassword = async (
  userId,
  newPassword
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(
      404,
      "User not found"
    );
  }

  if (!user.mustChangePassword) {
    throw new ApiError(
      400,
      "First-login password change is not required"
    );
  }

  const isTemporaryPasswordReused =
    await bcrypt.compare(
      newPassword,
      user.passwordHash
    );

  if (isTemporaryPasswordReused) {
    throw new ApiError(
      400,
      "New password cannot be the same as the temporary password"
    );
  }

  user.passwordHash =
    await bcrypt.hash(newPassword, 10);

  user.mustChangePassword = false;

  await user.save();

  return {
    email: user.email,
    mustChangePassword:
      user.mustChangePassword,
  };
};