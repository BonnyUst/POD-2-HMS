require('dotenv').config();
const express=require('express');
const cors=require('cors');
const morgan=require('morgan');

const app=new express();

const seedData=require('./src/utils/seedData')
seedData();


app.use(cors);

app.use(morgan('dev'));

app.use(express.json());


module.exports=app;