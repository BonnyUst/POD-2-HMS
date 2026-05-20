const mongoose=require('mongoose')

const nodeSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    path:{
        type:String,
        required:true,
        trim:true
        //admin/dashboard like that kind of path 
    },

    icon:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true
    },
//the order is given to sort the menu items to be shown dynmaically in the backend 
    order:{
        type:Number,
        default:0
    }

},{
    timestamps:true
})

module.exports=mongoose.model('Node',nodeSchema);