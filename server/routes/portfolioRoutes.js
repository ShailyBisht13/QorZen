import { Router } from "express";
import {
  createPortfolio,
  getPortfolios,
  getPortfolioById,
  updatePortfolio,
  deletePortfolio,
} from "../controllers/portfolioController.js";
import { protect, authorize } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = Router();

router.get("/", getPortfolios);
router.get("/:id", getPortfolioById);

router.post("/", protect, authorize("admin"), upload.single("image"), createPortfolio);
router.put("/:id", protect, authorize("admin"), updatePortfolio);
router.delete("/:id", protect, authorize("admin"), deletePortfolio);

export default router;