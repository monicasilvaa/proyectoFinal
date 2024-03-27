import express from "express";
import { FoodController } from "../controllers/FoodController";
import { auth } from "../middlewares/auth";

// -----------------------------------------------------------------------------

const router = express.Router();
const foodController = new FoodController();

router.get("/", auth, foodController.getAll);

export default router;