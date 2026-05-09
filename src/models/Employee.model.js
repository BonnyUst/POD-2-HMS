const mongoose=require('mongoose')
const counter=require('')

const employeeSchema=new mongoose.Schema(
    {
        employeeCode:{type:String,unique:true,required:true},
        userId:{type:String,ref:"User",required:true},
        name:{type:String,required:true,trim:true},
        phone:{type:String,required:true},
        email:{type:String,required:true,unique:true,trim:true},
        department:{type:String,enum:['OPD','IPD','Lab','Pharmacy','Admin']},
        designation:{type:String,enum:['Jr Doctor','Nurse','Receptionist']},
        status:{type:String,enum:['ACTIVE','INACTIVE'],default:'ACTIVE'},
        joiningDate:{type:Date,required:true},
        medicalRegistrationNo:{type:String,unique:true,required:true},
        specialization:{type:String,trim:true},
        qualification:[{type:String}],
        consultationFee:{type:Number},
        availabilitySlots:{type:Number}
    }
);

employeeSchema.pre('save',async function (next)
{
    if(this.isNew){
        try{
            const counter=await Counter.findOneAndUpdate(
                {name:'employee'},
                {$inc:{seq:1}},
                {
                    new:true,upsert:true
                }
            );
            this.employeeCode=`EMP-${String(counter.seq).padStart(6,'0')}`;

            
        }
        catch(error){
            return next(err);

        }
    }
    next();
});

