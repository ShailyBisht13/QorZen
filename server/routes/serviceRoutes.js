import {Router} from "express"
import{ 
    createService,
    getServices,
    getServiceById,
    updateService,
    deleteService,
} from "../controllers/serviceControllers.js"
import { protect, authorize } from "../middleware/auth.js"
import upload from "../middleware/upload.js";

const router =  Router()

router.get("/", getServices)
router.get('/:id', getServiceById)
router.post("/", protect, authorize("admin"), upload.single("image"), createService);
router.put('/:id', protect, authorize('admin'), updateService)
router.delete("/:id", protect, authorize('admin'), deleteService)

export default router