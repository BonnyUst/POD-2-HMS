require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose')

const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const metaRoutes = require('./routes/metaData.routes')
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const employeeRoutes = require('./routes/employee.routes')
const ownerRoutes = require('./routes/owner.routes');
const errorHandler = require('./middleware/errorHandler.middleware');
const seedRoles = require('./utils/seedRoles');
const seedDepartments = require('./utils/seedDepartments');
const seedOwner = require('./utils/seedOwner')
const seedRoleMenus = require('./utils/roleMenu.seed');
const seedMenus = require('./utils/menu.seed');
const connectDB = require('./config/db')
connectDB();
seedRoles();
seedDepartments();
seedOwner();
seedMenus();
seedRoleMenus();
const app = express();
console.log("FRONTEND_URL:", process.env.FRONTEND_URL);
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
app.use('/api',metaRoutes);
app.use('/api/user',userRoutes);
app.use('/employee',employeeRoutes);
app.use('/owner',ownerRoutes);

app.get('/',(req,res)=>{
    res.json({message:"Home Page Running"})
})
app.use(errorHandler);
mongoose.connect(process.env.MONGO_URI)
    .then(()=>{ console.log("Mongo Connected")})
    .catch((err)=>{console.error("MongoDB connection error : ",err.message)});


module.exports = app;
