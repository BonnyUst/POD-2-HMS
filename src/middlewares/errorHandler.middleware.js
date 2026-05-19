const errorHandler = (
  err,

  req,

  res,

  next,
) => {
  console.log("\n========== ERROR ==========");

  console.log(err);

  console.log("===========================\n");

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,

    message: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;
