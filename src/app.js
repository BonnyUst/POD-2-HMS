const express = require('express');
const morgan = require('morgan');
const connectDB = require('../src/config/dbConfig');
const seedData = require('./utils/seedData');
const seedAdmin = require('./utils/seedAdmin');
const userRoute = require('./routes/user.route');
const authRoute = require('./routes/auth.route');
const doctorUser = require('./routes/doctor.route');
const patientRouter = require('./routes/patient.route');
const errorHandler = require('./middlewares/errorHandler.middleware');
const jwtAuth = require('./middlewares/jwtAuth.middleware');
connectDB();
seedData();
seedAdmin();
const app = express();
//middlewares
app.use(express.json());
app.use(morgan("dev"));

app.use('/api/auth', authRoute);
app.use(jwtAuth);
app.use('/api/users', userRoute);
app.use('/api/doctors', doctorUser);
app.use('/api/patients', patientRouter);
app.get('/', (req, res) => {
    console.log('hey i am working');
});
app.use(errorHandler);
module.exports = app;