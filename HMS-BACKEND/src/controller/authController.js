const ApiResponse = require(
  "../utils/ApiResponse"
);

const authService = require(
  "../service/auth.service"
);

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const result =
      await authService.verifyEmployeeEmail(
        token
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Email verified successfully",
        result
      )
    );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({
        success: false,
        message:
          error.message ||
          "Something went wrong",
      });
  }
};

const login = async (req, res) => {
  try {
    const result =
      await authService.loginEmployee(
        req.body
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Login successful",
        result
      )
    );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({
        success: false,
        message:
          error.message ||
          "Something went wrong",
      });
  }
};

const changePassword = async (
  req,
  res,
  next
) => {
  try {
    const userId = req.user.userId;

    const result =
      await authService.changePassword(
        userId,
        req.body
      );

    return res.status(200).json({
      success: true,
      message:
        "Password changed successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const changeFirstLoginPassword = async (
  req,
  res,
  next
) => {
  try {
    const userId = req.user.userId;

    const { newPassword } = req.body;

    const result =
      await authService.changeFirstLoginPassword(
        userId,
        newPassword
      );

    return res.status(200).json({
      success: true,

      message:
        "Password changed successfully. Please log in again using your new password.",

      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  verifyEmail,
  login,
  changePassword,
  changeFirstLoginPassword,
};