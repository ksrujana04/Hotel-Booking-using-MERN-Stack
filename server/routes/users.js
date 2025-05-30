import express from "express";
import { updateUser, deleteUser, readUser, readallUser } from "../controllers/users.js";
import { verifyUser, verifyAdmin } from "../utils/verifyToken.js";
const router = express.Router();

// update
router.put("/:id",verifyUser,updateUser);
// delete
router.delete("/:id",verifyUser,deleteUser);
// read all
router.get("/",verifyAdmin,readallUser);
// read
router.get("/:id",verifyUser,readUser);

export default router;