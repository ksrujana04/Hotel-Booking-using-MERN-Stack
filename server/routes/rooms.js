import express from "express";
import { createRoom, updateRoom, deleteRoom, readRoom, readallRoom, updateRoomAvailability } from "../controllers/rooms.js";
import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";
const router = express.Router();

// create
router.post("/:hotelid",verifyAdmin,createRoom);
// update
router.put("/:id",verifyAdmin,updateRoom);
router.put("/availability/:id",verifyUser,updateRoomAvailability);
// delete
router.delete("/:id/:hotelid",verifyAdmin,deleteRoom);
// read all
router.get("/",readallRoom);
// read
router.get("/:id",readRoom);

export default router;