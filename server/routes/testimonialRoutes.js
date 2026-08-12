import { Router } from "express";
import {
  createTestimonial,
  getTestimonials,
  updateTestimonial,
  deleteTestimonial,
} from "../controllers/testimonialController.js";
import { protect, authorize } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = Router();

router.get("/", getTestimonials);

router.post("/", protect, authorize("admin"), upload.single("image"), createTestimonial);
router.put("/:id", protect, authorize("admin"), updateTestimonial);
router.delete("/:id", protect, authorize("admin"), deleteTestimonial);

export default router;