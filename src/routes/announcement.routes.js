import { Router } from "express";
import {
    createAnnouncement,
    getAnnouncements,
    editAnnouncement,
    deleteAnnouncement
} from "../controllers/announcement.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

router.post("/create",verifyJWT,isAdmin, createAnnouncement);
router.get("/get",verifyJWT,isAdmin, getAnnouncements);
router.put("/edit/:id",verifyJWT,isAdmin, editAnnouncement);
router.delete("/delete/:id",verifyJWT,isAdmin, deleteAnnouncement);

export default router;
