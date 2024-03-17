import express from "express";
import { ServiceController } from "../controllers/ServiceController";

// -----------------------------------------------------------------------------

const router = express.Router();
const serviceController = new ServiceController();

router.get("/", serviceController.getAll);

export default router;