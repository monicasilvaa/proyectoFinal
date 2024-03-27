import express from "express";
import { UserController } from "../controllers/UserController";
import { auth } from "../middlewares/auth";
import { isClient } from "../middlewares/isClient";
import { isDietitian } from "../middlewares/isDietitian";
import { isSuperadmin } from "../middlewares/isSuperadmin";

// -----------------------------------------------------------------------------

const router = express.Router();
const userController = new UserController();

router.get("/", auth, isSuperadmin, userController.getAll);
router.get("/dietitians", userController.getDietitianList);
router.get("/dietitians/:centerId", userController.getDietitiansByCenter);

router.get("/roles",auth, userController.getAvailableRoles);
router.get("/client/:id",auth, userController.getClientById);
router.get("/profile/:id",auth, userController.getById);
router.get("/myAppointments", auth, isClient, userController.getClientAppointments);
router.get("/dietitianAppointments", auth, isDietitian, userController.getDietitianAppointments);
router.get("/registeredClients", auth, userController.getAllRegisteredClients);

router.patch("/profile/:id",auth, userController.update);
router.patch("/changeUserRole/:id",auth, isSuperadmin, userController.updateUserRole);

router.post("/registerDietitian",auth, isSuperadmin, userController.createDietitian);
router.post("/",auth, isSuperadmin, userController.create);

router.delete("/:id",auth, isSuperadmin, userController.delete);

export default router;