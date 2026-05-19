require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose')

const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const errorHandler = require('./middleware/errorHandler.middleware');
const seedRoles = require('./utils/seedRoles');
const seedDepartments = require('./utils/seedDepartments');
const connectDB = require('./config/db')
connectDB();
seedRoles();
seedDepartments();
const app = express();

app.use(helmet());

app.use(cors(
    {
        origin : process.env.FRONTEND_URL,
        credentials:true,
    }
),);

app.use(morgan('dev'));

app.use(express.json());

app.use('/api/auth',authRoutes);
app.use('/api/user',userRoutes);

app.get('/',(req,res)=>{
    res.json({message:"Home Page Running"})
})
app.use(errorHandler);
mongoose.connect(process.env.MONGO_URI)
    .then(()=>{ console.log("Mongo Connected")})
    .catch((err)=>{console.error("MongoDB connection error : ",err.message)});


module.exports = app;
