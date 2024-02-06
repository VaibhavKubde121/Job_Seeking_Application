
import mongoose from "mongoose";
import validator from "validator";

const applicationSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please provide your Name"],
        minlength:[3,"Name must contain atleast 3 character"],
        maxlength: [30, "Name cannot exceed 30 character"],
    },
    email:{
        type:String,
        required:[true,"please provide a valid email"],
        validator:[validator.isEmail,"Please provide a valid email"],
    },
    coverLetter:{
        type:String,
        required:[true,"Please provide your cover letter"],
    },
    phone:{
        type:Number,
        required:[true,"Please provide your Contact number"]
    },
    address:{
        type:String,
        required: [true,"Please provide your Address"]
    },
    resume:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    applicantID:{
        user:{
            type:mongoose.Schema.ObjectId,
            ref:"User",
            required:true
        },
        role:{
            type:String,
            enum:["Job Seeker"],
            required:true
        }
    },
    employeeID: {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true
        },
        role: {
            type: String,
            enum: ["Employee"],
            required: true
        }
    }
})

export const Application=mongoose.model("Application",applicationSchema)