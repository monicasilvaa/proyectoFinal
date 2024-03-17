import express from "express";
import { CenterController } from "../controllers/CenterController";

// -----------------------------------------------------------------------------

const router = express.Router();
const centerController = new CenterController();

router.get("/", centerController.getAll);

export default router;