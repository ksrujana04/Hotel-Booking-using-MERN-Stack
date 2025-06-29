import express from "express";
import { createHotel, updateHotel, deleteHotel, readHotel,readallHotel, countByCity, countByType, getHotelRooms } from "../controllers/hotels.js";
import { verifyAdmin,verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

// create
router.post("/",verifyAdmin,createHotel);
// update
router.put("/:id",verifyAdmin,updateHotel);
// delete
router.delete("/:id",verifyAdmin,deleteHotel);
// read all
router.get("/",readallHotel);
// read
router.get("/find/:id",readHotel);

router.get("/countByCity",countByCity);
router.get("/countByType",countByType);
router.get("/room/:id",getHotelRooms);
export default router;