import User from "../models/user.js";
import bcrypt from "bcrypt";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export const registerUser = async (req,res,next) => {
    try{
        const user = await User.findOne({email:req.body.email});
        if (user) return next(createError(409,"user with email already exists"));
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
        const user = await User.findOne({email:req.body.username});
        if (!user) return next(createError(404,"user not found"));
        
        const truePswd = await bcrypt.compare(req.body.password,user.password);
        if (!truePswd) return next(createError(400,"Wrong username or password"));

        const token = jwt.sign({id: user._id, isAdmin: user.isAdmin},process.env.JWT_SECRET);
        const { password, ...otherDetails} = user._doc;
        console.log({...otherDetails})
        res.cookie("access_token",token,{httpOnly:true,}).status(200).json({...otherDetails});
    } catch(err){
        next(err);
    }
};


export const googleOAuthCallback = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
console.log(req.user);
    const token = jwt.sign(
      { id: req.user._id, isAdmin: req.user.isAdmin },
      process.env.JWT_SECRET
    );

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: false, // true if using https
  sameSite: "Lax",
    });

    res.redirect("http://localhost:3000"); // frontend URL
    //res.status(200).json({})
  } catch (err) {
    next(err);
  }
};



export const loginSuccess = async (req, res) => {
  try {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json({ message: "No token, not authenticated" });
console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.cookie("access_token",token,{httpOnly:true,}).status(200).json(user);
  } catch (err) {
    res.status(403).json({ message: "Token invalid or expired" });
  }
};



// Send reset email
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json("User not found");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

    // Setup transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `http://localhost:3000/reset-password/${token}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 15 minutes.</p>`,
    });

    res.status(200).json("Password reset link sent to your email");
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });

    res.status(200).json("Password has been reset successfully");
  } catch (err) {
    res.status(400).json("Invalid or expired token");
  }
};
