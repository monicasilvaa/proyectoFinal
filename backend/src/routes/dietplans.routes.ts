import express from "express";
import { DietplanController } from "../controllers/DietplanController";
import { auth } from "../middlewares/auth";
import { isDietitian } from "../middlewares/isDietitian";

// -----------------------------------------------------------------------------

const router = express.Router();
const dietplanController = new DietplanController();

router.get("/", auth, dietplanController.getAll);
router.get("/meals",auth, dietplanController.getMeals);
router.get("/:id",auth, dietplanController.getById);
router.get("/client/:id",auth, dietplanController.getByClientId);

router.post("/",auth, isDietitian, dietplanController.create);


export default router;