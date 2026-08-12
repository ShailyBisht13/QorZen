import { Router } from "express";
import {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  createOrder,
  verifyPayment,
} from "../controllers/courseController.js";
import { protect, authorize, optionalAuth } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = Router();

router.get("/", getCourses);
router.get("/:id", optionalAuth, getCourseById);

router.post("/", protect, authorize("admin"), upload.single("image"), createCourse);
router.put("/:id", protect, authorize("admin"), updateCourse);
router.delete("/:id", protect, authorize("admin"), deleteCourse);

router.post("/:id/create-order", protect, createOrder);
router.post("/:id/verify-payment", protect, verifyPayment);
export default router;