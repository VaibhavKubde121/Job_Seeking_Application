
import express from "express";
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import userRouter from './routes/userRouter.js'
import applicationRouter from './routes/application.js'
import jobRouter from './routes/jobRouter.js'
// import { config } from "dotenv";
import { dbConnection } from "./database/dbConnection.js";
import { errorMiddleware } from "./middleware/error.js";

const app=express()
dotenv.config({ path: "./config/config.env" });


app.use(cors({
    origin:[process.env.FROTEND_URL],
    methods:['GET','PUT','POST','DELETE'],
    credentials:true
}))

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true,}))

app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:'/tmp',
}))

app.use('/api/v1/user',userRouter);
app.use('/api/v1/application',applicationRouter);
app.use('/api/v1/job',jobRouter);

dbConnection()

app.use(errorMiddleware)

export default app