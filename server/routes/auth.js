import express from "express";
import { registerUser, loginUser, googleOAuthCallback, loginSuccess, forgotPassword, resetPassword } from "../controllers/auth.js";
import passport from "passport";

const router = express.Router();

router.post("/register",registerUser);
router.post("/login",loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.get("/google", passport.authenticate("google", {
  scope: ["profile", "email"],prompt: "consent select_account" ,accessType: "offline",includeGrantedScopes: false}));

router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login",session: true, }),googleOAuthCallback);

router.get("/me", async (req, res) => {
  try {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });
console.log(`User: ${user}`)
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } catch (err) {
    res.status(500).json({ message: "Token error", error: err.message });
  }
});
router.get("/login/success",loginSuccess);


export default router;