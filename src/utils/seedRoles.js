const Roles = require('../models/Roles');

const roles = [
    {
        roleId : "OWN",
        roleName : "OWNER",
    },
    {
        roleId : "ADM",
        roleName : "ADMIN",
    },
    {
        roleId : "DOC",
        roleName : "DOCTOR",
    },
    {
        roleId : "RECP",
        roleName : "RECEPTIONIST",
    },
    {
        roleId : "CSH",
        roleName : "CASHIER",
    },
    {
        roleId : "NUR",
        roleName : "NURSE",
    },
    {
        roleId : "LABTECH",
        roleName : "LAB TECHNICIAN",
    },
    {
        roleId : "PHA",
        roleName : "PHARMACIST",
    },
    {
        roleId : "PAT",
        roleName : "PATIENT",
    },
];



const seedRoles = async()=>{
    try{
        await Roles.insertMany(roles,{ordered:false,});
        
    }catch(error){
        if(error.code === 11000){
            
        }else{
            
        }
    }
}

module.exports = seedRoles;