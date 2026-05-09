// const {validationResult}=require('express-validator');

// const errorHandler = (req,res,next)=>{
//     const error =validationResult(req);
//     if(error)
//     {
//         return res.status(305).json({message:error.array()});
//     }
//     next();
// } 


const {validationResult} =require('express-validator');

const errorHandler=(req,res,next)=>{;
const error=validationResult(req);
if(error)
{
    return res.status(305).json({message:error.array()});
}
next();
}