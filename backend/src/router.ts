import express from "express";
import userRoutes from "./routes/users.routes";
import authRoutes from "./routes/auth.routes";
import appointmentRoutes from "./routes/appointments.routes";

// -----------------------------------------------------------------------------

const router = express.Router();

// User routes
router.use("/api/users", userRoutes);

// Appointment routes
router.use("/api/appointments", appointmentRoutes);

// Auth routes
router.use("/auth", authRoutes);

export default router;