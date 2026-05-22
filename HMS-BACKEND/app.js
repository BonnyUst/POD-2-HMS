require('dotenv').config();
const express=require('express');
const cors=require('cors');
const morgan=require('morgan');
const userRoutes=require('./src/routes/user.route')
const authRoutes=require('./src/routes/auth.route')
const nodeRoutes=require('./src/routes/node.route')
const adminRoutes=require('./src/routes/admin.route')

const app=new express();






app.use(cors());

app.use(morgan('dev'));

app.use(express.json());

app.use('/api/auth',authRoutes);
app.use('/api/users',userRoutes);
app.use('/api/admin',adminRoutes)
app.use('/api/node',nodeRoutes);


module.exports=app;