
import { catchAsyncError } from '../middleware/catchAsyncError.js'
import ErrorHandler from '../middleware/error.js'; 
import {Job} from '../model/jobSchema.js'

export const getAllJob=catchAsyncError(async(req,res,next)=>{
    const jobs=await Job.find({expired:false});
    res.status(200).json({
        success:true,
        jobs,
    })
})

export const postJob = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job Seeker") {
        return next(
            new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
        );
    }
    const {
        title,
        description,
        category,
        country,
        city,
        location,
        fixedSalary,
        salaryFrom,
        salaryTo,
    } = req.body;

    if (!title || !description || !category || !country || !city || !location) {
        return next(new ErrorHandler("Please provide full job details.", 400));
    }

    if ((!salaryFrom || !salaryTo) && !fixedSalary) {
        return next(
            new ErrorHandler(
                "Please either provide fixed salary or ranged salary.",
                400
            )
        );
    }

    if (salaryFrom && salaryTo && fixedSalary) {
        return next(
            new ErrorHandler("Cannot Enter Fixed and Ranged Salary together.", 400)
        );
    }
    const postedBy = req.user._id;
    const job = await Job.create({
        title,
        description,
        category,
        country,
        city,
        location,
        fixedSalary,
        salaryFrom,
        salaryTo,
        postedBy,
    });
    res.status(200).json({
        success: true,
        message: "Job Posted Successfully!",
        job,
    });
});

export const getMyJob=catchAsyncError(async(req,res,next)=>{
    const { role } = req.user;
    if (role === "Job Seeker") {
        return next(
            new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
        );
    }
    const myJob=await Job.find({postedBy:req.user._id});
    if (!myJob) {
        return next(
            new ErrorHandler("You have not posted any job.", 400)
        );
    }
    res.status(200).json({
        success:true,
        myJob,
    })
})

export const updateJob=catchAsyncError(async(req,res,next)=>{
    const { role } = req.user;
    if (role === "Job Seeker") {
        return next(
            new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
        );
    }
    const {id}=req.params;
    let job=await Job.findById(id);
    if(!job)
    {
        return next(
            new ErrorHandler("Oops,Job not found", 400)
        );
    }
    job=await Job.findByIdAndUpdate(id,req.body,{
        new :true,
        runValidators:true,
        usefindAndModify:false
    })
    res.status(200).json({
        success:true,
        job,
        message:"Job Updated Successfully"
    })
})

export const deleteJob=catchAsyncError(async(req,res,next)=>{
    const { role } = req.user;
    if (role === "Job Seeker") {
        return next(
            new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
        );
    }
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job) {
        return next(new ErrorHandler("OOPS! Job not found.", 404));
    }
    await job.deleteOne();
    res.status(200).json({
        success: true,
        message: "Job Deleted!",
    });
})

export const getSingleJob=catchAsyncError(async(req,res,next)=>{
    const {id}=req.params;
    try{
        const job=await Job.findById(id);
        if(!job){
            return next(new ErrorHandler("Job not found",404));
        }
        res.status(200).json({
            success:true,
            job
        })
    }catch(error){
        return next(new ErrorHandler("Invalid Id/Card Error",400));
    }
})