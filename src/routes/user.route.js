const express = require("express");

const router = express.Router();

const {
  signUp,

  getAllEmployees,

  deleteEmployee,

  updateProfile,

  changePassword,

  updateUser,
} = require("../controllers/user.controller");

const { userSignUpValidator } = require("../middlewares/validator.middleware");

const { validate } = require("../middlewares/validate.middleware");

const authorize = require("../middlewares/authorize.middleware");

const jwtAuth = require("../middlewares/jwtAuth.middleware");

router.post(
  "/",

  jwtAuth,

  userSignUpValidator,

  validate,

  authorize("CREATE_USER"),

  signUp,
);

router.get(
  "/",

  jwtAuth,

  getAllEmployees,
);

router.put(
  "/:id",

  jwtAuth,

  authorize("UPDATE_USER"),

  updateUser,
);

router.delete(
  "/:id",

  jwtAuth,

  authorize("DELETE_USER"),

  deleteEmployee,
);

router.put(
  "/profile",

  jwtAuth,

  updateProfile,
);

router.put(
  "/change-password",

  jwtAuth,

  changePassword,
);

module.exports = router;
