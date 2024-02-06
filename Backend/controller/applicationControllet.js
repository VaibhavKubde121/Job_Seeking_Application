import { catchAsyncError } from '../middleware/catchAsyncError.js'
import ErrorHandler from '../middleware/error.js';
import { Application } from '../model/applicationSchema.js';
import cloudinary from 'cloudinary'
import { Job } from '../model/jobSchema.js';

export const employeeGetAllApplication = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job Seeker") {
        return next(
            new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
        );
    }
    const { _id } = req.user;
    const application = await Application.find({ "employeeID.user": _id });
    res.status(200).json({
        success: true,
        application
    })
})

export const jobSeekerGetAllApplication = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employee") {
        return next(
            new ErrorHandler("Employee not allowed to access this resource.", 400)
        );
    }
    const { _id } = req.user;
    const application = await Application.find({ "applicantID.user": _id });
    res.status(200).json({
        success: true,
        application
    })
})

export const jobSeekerDeleteApplication = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employee") {
        return next(
            new ErrorHandler("Employee not allowed to access this resource.", 400)
        );
    }
    const { id } = req.params;
    const application = await Application.findById(id);
    if (!application) {
        return next(new ErrorHandler("Opps,application not found", 400));
    }
    await application.deleteOne();
    res.status(200).json({
        success: true,
        message: "Application deleted Successfully"
    })
})

export const postApplication = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employee") {
        return next(
            new ErrorHandler("Employee not allowed to access this resource.", 400)
        );
    }
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Resume file Required"))
    }
    const { resume } = req.files;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormats.includes(resume.mimetype)) {
        return next(
            new ErrorHandler("Invalid file type. Please upload a PNG file.", 400)
        );
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(
        resume.tempFilePath
    );
    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error("Cloudinary Error",
            cloudinaryResponse.error || "Unknown cloudinary Error");
        return next(new ErrorHandler("failed to upload resume", 500))
    }
    const { name, email, coverLetter, phone, address, jobId } = req.body;
    console.log(req.body)
    const applicantID = {
        user: req.user._id,
        role: "Job Seeker",
    };
    console.log(jobId)
    if (!jobId) {
        return next(new ErrorHandler("Job not found ", 404));
    }
    const jobDetails = await Job.findById(jobId);
    if (!jobDetails) {
        return next(new ErrorHandler("Job not found 2", 404));
    }
    const employeeID = {
        user: jobDetails.postedBy,
        role: "Employee"
    };
    if (!name || !email || !coverLetter || !phone || !address || !applicantID || !resume || !employeeID) {
        return next(new ErrorHandler("Please fill all field", 400));
    }
    const application = await Application.create({
        name,
        email,
        coverLetter,
        phone, address,
        applicantID, employeeID,
        resume: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url
        }
    });
    res.status(200).json({
        success: true,
        message: "Application Submitted",
        application
    })
})

