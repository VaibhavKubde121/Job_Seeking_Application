
import express from 'express'
import {deleteJob, getAllJob, getMyJob, getSingleJob, postJob, updateJob} from '../controller/jobController.js'
import { isAuthorized } from '../middleware/auth.js'

const router = express.Router();
router.get("/getAllJob", getAllJob)
router.post("/postJob", isAuthorized, postJob)
router.get("/getMyJob", isAuthorized,getMyJob)
router.put("/updateJob/:id", isAuthorized, updateJob)
router.delete("/deleteJob/:id", isAuthorized, deleteJob)
router.get("/:id", isAuthorized,getSingleJob)

export default router;