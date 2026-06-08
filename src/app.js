require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
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
const receptionRoutes = require('./routes/receptionist.routes');
const approvalRoutes = require('./routes/approval.routes');
const adminRoutes = require('./routes/admin.routes');
const patientRoutes = require('./routes/patient.routes');
const deptRoutes = require('./routes/dept.routes');
const appointmentRoutes = require('./routes/appointment.routes')
const doctorRoutes = require('./routes/doctor.routes')

const errorHandler = require('./middleware/errorHandler.middleware');
const seedRoles = require('./utils/seedRoles');
const seedDepartments = require('./utils/seedDepartments');
const seedOwner = require('./utils/seedOwner')
const seedRoleMenus = require('./utils/roleMenu.seed');
const seedMenus = require('./utils/menu.seed');
const connectDB = require('./config/db')
const startServer = async () => {
  await connectDB();

  await seedRoles();
  await seedDepartments();
  await seedOwner();
  await seedMenus();
  await seedRoleMenus();

  app.listen(process.env.PORT, () => {
    
  });
};

startServer();
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
app.use('/api/register-approval',approvalRoutes )
app.use('/api/admin',adminRoutes);
app.use('/api/employee',employeeRoutes);
app.use('/api/department',deptRoutes);
app.use('/api/patients',patientRoutes);
app.use('/api/doctor',doctorRoutes)
app.use('/api/appointments',appointmentRoutes)
app.use('/api/user',userRoutes);
app.use('/api',metaRoutes);
app.use('/api/owner',ownerRoutes);
app.use('/api/reception',receptionRoutes);

app.get('/',(req,res)=>{
    res.json({message:"Home Page Running"})
})
app.use(errorHandler);
mongoose.connect(process.env.MONGO_URI)
    .then(()=>{ console.log("Mongo Connected")})
    .catch((err)=>{console.error("MongoDB connection error : ",err.message)});


module.exports = app;
