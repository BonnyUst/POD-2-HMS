require('dotenv').config();
const express=require('express');
const cors=require('cors');
const morgan=require('morgan');
const userRoutes=require('./src/routes/user.route')
const authRoutes=require('./src/routes/auth.route')
const nodeRoutes=require('./src/routes/node.route')

const app=new express();






app.use(cors());

app.use(morgan('dev'));

app.use(express.json());


app.use('/api/users',userRoutes);

app.use('/api',authRoutes);
app.use('/api',nodeRoutes);


module.exports=app;