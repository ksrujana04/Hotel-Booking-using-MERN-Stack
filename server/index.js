import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import passport from "passport";
import session from "express-session";
import "./config/passport.js";
import authRoutes from "./routes/auth.js";
import usersRoutes from "./routes/users.js";
import hotelsRoutes from "./routes/hotels.js";
import roomsRoutes from "./routes/rooms.js";
import paymentRoutes from "./routes/payment.js";
import {webhookManage} from "./controllers/webhook.js"
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
dotenv.config();

const connect = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB");
    } catch (err) {
        throw err;
    }
};

mongoose.connection.on("disconnected",()=>{
    console.log("mongoDB disconnected");
});

app.use(cookieParser());
app.use("/api/webhook",bodyParser.raw({ type: "application/json" }),webhookManage);
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:3000', // Only allow requests from this origin
    credentials: true
}));

app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use("/api/auth",authRoutes);
app.use("/api/users",usersRoutes);
app.use("/api/hotels",hotelsRoutes);
app.use("/api/rooms",roomsRoutes);
app.use("/api/create-checkout-session",paymentRoutes);


app.use((err,req,res,next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
});
});

app.listen(8800,()=>{
    connect();
    console.log("Connected to backend");
})