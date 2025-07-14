import express from "express";
import { protect } from '../middleware/authMiddleware.js';
import {
  scheduleViewing,
  getAllAppointments,
  updateAppointmentStatus,
  getAppointmentsByUser,
  cancelAppointment,
  updateAppointmentMeetingLink,
  getAppointmentStats,
  submitAppointmentFeedback,
  getUpcomingAppointments
} from '../controller/appointmentController.js';


const router = express.Router();

// User routes
router.post("/schedule", protect, scheduleViewing);  // Add protect middleware
router.get("/user", protect, getAppointmentsByUser);
router.put("/cancel/:id", protect, cancelAppointment);
router.put("/feedback/:id", protect, submitAppointmentFeedback);
router.get("/upcoming", protect, getUpcomingAppointments);

// Admin routes
router.get("/all", protect, getAllAppointments);
router.get("/stats", protect, getAppointmentStats);
router.put("/status", protect, updateAppointmentStatus);
router.put("/update-meeting", protect, updateAppointmentMeetingLink);

export default router;
