const mongoose=require('mongoose');


const userSchema=new mongoose.Schema(
    {
      
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true
        },
        firstName:{
            type:String,
            required:true,
            trim:true

        },
        lastName:{
            type:String,
            required:true,
            trim:true
        },
        passwordHash:{
            type:String,
            required:true
        },
        status:{
            type:String,
            enum:['ACTIVE','INACTIVE'],
            default:'ACTIVE'
        },
      
        roleId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Role",
            required:true
        },

        isVerified:{
            type:Boolean,
            default:false
        },
        lastLoginAt:{
            type:Date,
            default:null
        }
    },
    {
        timestamps:true
    }
);



// userSchema.pre('save',async function (next) {
//     if(this.isNew){
//         try{
//             const counter=await Counter.findOneAndUpdate(
//                 {
//                     name:'user'
//                 },
//                 {$inc:{seq:1}},//creates Sequence
//                 {
//                     new:true,upsert:true
//                 }
//             );
//             this.userId=`USER-${String(counter.seq).padStart(6,'0')}`;

//         }
//         catch(err){
//             return next(err);
//         }
//     }
//     next();
// })

module.exports=mongoose.model('User',userSchema);



//   roles:{type:[String],enum:['OWNER','ADMIN','DOCTOR','RECEPTIONIST',
//             'CASHIER','NURSE','LAB_TECH','PHARMACIST'],required:true},

//             employeeId:{type:mongoose.Schema.Types.ObjectId,ref:'Employee',
//                 required:true
//             },