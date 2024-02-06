
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema=new mongoose.Schema({
    name :{
        type:String,
        required:true,
        minLength:[3,"Name must contain at least 3 character"],
        maxLength: [30, "Name cannot be exceed 30 character"],
    },
    email:{
        type:String,
        required:[true,"Please provide your Name"],
        validate:[validator.isEmail,"Please provide a valid Email"]
    },
    phone:{
        type:Number,
        required:[true,"Please provide your Phone Number"]
    },
    password:{
        type:String,
        required: [true,"Please provide your Password"],
        minLength: [8, "Password must contain at least 8 character"],
        maxLength: [32, "Password cannot be exceed 32 character"],
        select:false
    },
    role:{
        type:String,
        required:[true,"Please provide your role"],
        enum:["Job Seeker","Employee"]
    },
    createAt:{
        type:Date,
        default:Date.now
    }
});

//hashing the password

userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        next()
    }
    this.password=await bcrypt.hash(this.password,10);
});

//Comparing password

userSchema.methods.comparePassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

//Generating A jwt token for Authorization

userSchema.methods.getJwtToken=function(){
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY,
        { expiresIn: process.env.JWT_EXPIRE })
}

export const User=mongoose.model("User",userSchema)
 

