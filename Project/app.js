const express = require('express');
const mongoose=require('mongoose');
const mongodb=require('mongodb')
const db=require('./db/databaseConnection')
const appError=require('./utils/appErrors')
const globalErrorHandler=require('./controllers/errorController')
const app=express();
const morgan=require('morgan');
const path=require('path')
app.use(express.json());
app.use(express.static(path.join(__dirname,'/public')))
const tourRouter=require('./routes/tourRoute');
const userRouter=require('./routes/userRoute');
const reviewRouter=require('./routes/reviewRoute');
if(process.env.NODE_ENV==='development')
{
    app.use(morgan('dev'))
}
app.use('/api/v1/tours',tourRouter)
app.use('/api/v1/users',userRouter)
app.use('/api/v1/reviews',reviewRouter)
//some outside routes are handled by this middleware.
app.all('*',(req,res,next)=>{
   const error=new appError(`Requested URL ${req.originalUrl} not Found`,404);
   next(error);
})
//Global Error Handling Middleware for all errors
app.use(globalErrorHandler)
module.exports=app;
