const asyncHandler = require("express-async-handler");

const userService = require("../services/user.service");

const ApiResponse = require("../utils/ApiResponse");

const signUp = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body);

  res.status(201).send(new ApiResponse(201, user));
});

const getAllEmployees = asyncHandler(async (req, res) => {
  const employees = await userService.getAllEmployees();

  res.status(200).json(new ApiResponse(200, employees));
});

const deleteEmployee = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const response = await userService.deleteEmployee(id);

  res.status(200).json(new ApiResponse(200, response));
});

const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const updatedUser = await userService.updateProfile(userId, req.body);

  res.status(200).json(new ApiResponse(200, updatedUser));
});

const changePassword = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const { currentPassword, newPassword } = req.body;

  const response = await userService.changePassword(
    userId,
    currentPassword,
    newPassword,
  );

  res.status(200).json(new ApiResponse(200, response));
});

const updateUser = asyncHandler(
  async (
    req,

    res,
  ) => {
    const { id } = req.params;

    const updatedUser = await userService.updateUser(id, req.body);

    res.status(200).json(new ApiResponse(200, updatedUser));
  },
);

module.exports = {
  signUp,

  getAllEmployees,

  deleteEmployee,

  updateProfile,

  changePassword,

  updateUser,
};
