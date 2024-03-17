import express from "express";
import appointmentRoutes from "./routes/appointments.routes";
import authRoutes from "./routes/auth.routes";
import centersRoutes from "./routes/centers.routes";
import userRoutes from "./routes/users.routes";
import servicesRoutes from "./routes/services.routes";

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

export default router;