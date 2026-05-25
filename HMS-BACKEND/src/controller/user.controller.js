const ApiResponse = require('../utils/ApiResponse')
const userService=require('../service/user.service')



const createEmployeeByAdmin=async(req,res,next)=>{
    try{
        const employee=await userService.createEmployeeUser(req.body);

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

const getAllEmployees = async (req, res) => {
    try {
        const employees = await userService.getAllEmployees();

        return res
            .status(200)
            .json(new ApiResponse(
                200,
                "Employees Fetched Successfully",
                employees
            ));
    } catch (error) {
        return res
            .status(error.statusCode || 500)
            .json({
                success: false,
                message: error.message || "Something went wrong"
            });
    }
};

const getCurrentProfile=async (req,res)=>
{
    try{

        const userId=req.user.userId;
        const profile=await userService.currentProfile(userId);
        
        return res.status(200)
        .json({
            success:true,
            statusCode:200,
            message:"Profile Fetched Successfully",
            data:profile
        })
    }
    catch(error){

        return res.ApiResponse(500,"Internal Server Error in Profile Fetching");


    }
}

module.exports={createEmployeeByAdmin,getCurrentProfile,getAllEmployees};