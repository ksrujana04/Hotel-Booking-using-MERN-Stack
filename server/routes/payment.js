import express from "express";
import {checkoutsession} from "../controllers/payment.js"
const router = express.Router();

router.post('/',checkoutsession);

export default router;