require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require("mongoose");
const seedRoles = require("./utils/seedData");
const app = express();

app.use(helmet());
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    }),
);

app.use(morgan("dev"));

app.use(express.json());

const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => res.json({ message: "API running" }));

const userRoutes = require("./routes/user.routes");

app.use("/api/users", userRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
      console.log("MongoDB connected");

      await seedRoles();
})
  .catch((err) =>
      console.error("MongoDB connection error:", err.message)
);
module.exports = app;