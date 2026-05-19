require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const connectDB = require("../src/config/dbConfig");

const seedData = require("./utils/seedData");
const seedAdmin = require("./utils/seedAdmin");

const userRoute = require("./routes/user.route");
const authRoute = require("./routes/auth.route");
const doctorUser = require("./routes/doctor.route");
const patientRouter = require("./routes/patient.route");

const errorHandler = require("./middlewares/errorHandler.middleware");
const jwtAuth = require("./middlewares/jwtAuth.middleware");

connectDB();

seedData();
seedAdmin();

const app = express();

app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  }),
);

app.use(express.json());

app.use(morgan("dev"));

app.use("/api/auth", authRoute);

app.use(jwtAuth);

app.use("/api/users", userRoute);

app.use("/api/doctors", doctorUser);

app.use("/api/patients", patientRouter);

app.get("/", (req, res) => {
  res.json({
    message: "Backend Working",
  });
});

app.use(errorHandler);

module.exports = app;
