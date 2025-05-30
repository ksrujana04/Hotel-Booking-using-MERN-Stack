import User from "../models/user.js";
import bcrypt from "bcrypt";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req,res,next) => {
    try{
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password,salt);

        const newUser = new User({
            ...req.body,
            password: hash,
        });
        await newUser.save();
        res.status(200).json("new user has been created");
    } catch(err){
        next(err);
    }
};


export const loginUser = async (req,res,next) => {
    try{
        const user = await User.findOne({username:req.body.username});
        if (!user) return next(createError(404,"user not found"));
        
        const truePswd = await bcrypt.compare(req.body.password,user.password);
        if (!truePswd) return next(createError(400,"Wrong username or password"));

        const token = jwt.sign({id: user._id, isAdmin: user.isAdmin},process.env.JWT_SECRET);
        const { password, isAdmin , ...otherDetails} = user._doc;
        console.log({...otherDetails})
        res.cookie("access_token",token,{httpOnly:true,}).status(200).json({...otherDetails});
    } catch(err){
        next(err);
    }
};