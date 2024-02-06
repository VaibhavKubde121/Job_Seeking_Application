
import jwt from "jsonwebtoken";
import ErrorHandler from "./error.js";
import { User } from '../model/userSchema.js'
import { catchAsyncError } from "./catchAsyncError.js";

export const isAuthorized = catchAsyncError(async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return next(new ErrorHandler("User not authorized", 400));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
    req.user = await User.findById(decoded._id);
    next();
})