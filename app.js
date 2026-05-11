require('dotenv').config();
const express=require('express');
const cors=require('cors');
const morgan=require('morgan');
const userRoutes=require('./src/routes/user.route')

const app=new express();

const seedData=require('./src/utils/seedData')
seedData();


app.use(cors());

app.use(morgan('dev'));

app.use(express.json());

app.use('/api/users',userRoutes);


module.exports=app;