import express from "express";
import appointmentRoutes from "./routes/appointments.routes";
import authRoutes from "./routes/auth.routes";
import centersRoutes from "./routes/centers.routes";
import dietplansRoutes from "./routes/dietplans.routes";
import servicesRoutes from "./routes/services.routes";
import userRoutes from "./routes/users.routes";
import foodsRoutes from "./routes/foods.routes";

// -----------------------------------------------------------------------------

const router = express.Router();

// User routes
router.use("/api/users", userRoutes);

// Appointment routes
router.use("/api/appointments", appointmentRoutes);

// Auth routes
router.use("/auth", authRoutes);

// Center routes
router.use("/api/centers", centersRoutes);

// Services routes
router.use("/api/services", servicesRoutes);

// Dietplans routes
router.use("/api/dietplans", dietplansRoutes);

// Foods routes
router.use("/api/foods", foodsRoutes);

export default router;