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

//need to change more optimized one for future update purpose

const seedRoles = async()=>{
    try{
        await Roles.insertMany(roles,{ordered:false,});
        console.log('Roles Added in Table successfully');
    }catch(error){
        if(error.code === 11000){
            console.log('Roles already added in table');
        }else{
            console.log("Error seeding roles",error.message);
        }
    }
}

module.exports = seedRoles;