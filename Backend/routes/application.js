
import express from 'express'
import { isAuthorized } from '../middleware/auth.js'
import { employeeGetAllApplication, jobSeekerDeleteApplication, jobSeekerGetAllApplication, postApplication } from '../controller/applicationControllet.js';

const router = express.Router();
router.post("/postApplication", isAuthorized, postApplication)
router.get("/jobSeeker/getAll",isAuthorized,jobSeekerGetAllApplication)
router.get("/employee/getAll",isAuthorized,employeeGetAllApplication);
router.delete("/delete/:id",isAuthorized,jobSeekerDeleteApplication);

export default router;