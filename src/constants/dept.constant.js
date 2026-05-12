const Department = require('../models/Department');

const Depts = [
    {
        deptId : "OWN",
        deptName : "OWNER",
    },
    {
        deptId : "ADM",
        deptName : "ADMIN",
    },
    {
        deptId : "DOC",
        deptName : "DOCTOR",
    },
    {
        deptId : "RECP",
        deptName : "RECEPTIONIST",
    },
    {
        deptId : "CSH",
        deptName : "CASHIER",
    },
    {
        deptId : "NUR",
        deptName : "NURSE",
    },
    {
        deptId : "LABTECH",
        deptName : "LAB TECHNICIAN",
    },
    {
        deptId : "PHA",
        deptName : "PHARMACIST",
    },
];

const seedRoles = async()=>{
    try{
        await Roles.insertMany(roles,{ordered:false,});
        console.log('Roles Added in Table successfully');
    }catch(err){
        if(error.code === 11000){
            console.log('Roles already added in table');
        }else{
            console.log("Error seeding roles",error.message);
        }
    }
}