const ApiResponse = require('../utils/ApiResponse')
const authService=require('../service/user.service')

const createEmployee=async(req,res,next)=>{
    try{
        const employee=await authService.createEmployeeUser(req.body);

        return res    
            .status(201)
        .json(new ApiResponse(201,"Employee Registered Successfully",employee));
    }

    
    catch(error)
    {

        return res
        .status(error.statusCode||500)
        .json({
            success:false,
            message:error.message||"something went wrong"
        });
    }
};
const verifyEmail=async(req,res)=>{
    try{
        const{token}=req.params;

        const result=await authService.verifyEmployeeEmail(token);
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Email Verified Successfully",
                result
            )
        );
    }
    catch(error){
         return res
            .status(error.statusCode || 500)
            .json({
                success: false,
                message: error.message || "something went wrong"
            });
    };
};


module.exports={createEmployee,verifyEmail};