const ApiResponse = require('../utils/ApiResponse')
const authService=require('../service/user.service')

const signUp=async(req,res)=>{
    // try{
        const result=await authService.createPatientUser(req.body);

        return res        .status(201)
        .json(new ApiResponse(201,"Patient Registered Successfully",result));
    // }

    
    // catch(error)
    // {

    //     return res
    //     .status(error.statusCode||500)
    //     .json({
    //         success:false,
    //         message:error.message||"something went wrong"
    //     });
    // }
};


module.exports={signUp};