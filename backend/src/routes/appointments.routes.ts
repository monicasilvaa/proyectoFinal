import express from "express";
import { AppointmentController } from "../controllers/AppointmentController";
import { auth } from "../middlewares/auth";

// -----------------------------------------------------------------------------

const router = express.Router();
const appointmentController = new AppointmentController();

router.get("/",auth, appointmentController.getAll);
router.get("/:id",auth, appointmentController.getById);
router.post("/",auth, appointmentController.create);
router.patch("/:id",auth, appointmentController.update);
router.delete("/:id",auth, appointmentController.delete);

export default router;