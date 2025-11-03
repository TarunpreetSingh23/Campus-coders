import mongoose from "mongoose";
const userschema=new mongoose.Schema({
    
        username:{
            type:String,
            
        },
        email:{
            type:String,


        },
        password:{
            type:String,
        },
        isVerified:{
             type:Boolean,
             default:false
        },
        isAdmin:{
             type:Boolean,
             default:false
             
        },
        resetToken: String,
        resetTokenExpiry: Date,
        
})
const User=mongoose.models.User || mongoose.model
("User",userschema)

export default User