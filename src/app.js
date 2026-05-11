const express = require('express');
const morgan = require('morgan');
const connectDB = require('../src/config/dbConfig');
const seedData = require('./utils/seedData');
const userRoute = require('./routes/user.route');
const authRoute = require('./routes/auth.route');
const errorHandler = require('./middlewares/errorHandler.middleware');
connectDB();
seedData();
const app = express();
//middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.get('/', (req, res) => {
    console.log('hey i am working');
});
app.use(errorHandler);
module.exports = app;