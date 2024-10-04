import { Router } from "express";
import {
    createEvent,
    getEvents,
    editEvent,
    deleteEvent
} from "../controllers/event.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isSuperAdmin } from "../middlewares/superAdmin.middleware.js";

const router = Router();

router.post("/create",verifyJWT,isSuperAdmin, createEvent);
router.get("/get",verifyJWT,isSuperAdmin, getEvents);
router.put("/edit/:id",verifyJWT,isSuperAdmin, editEvent);
router.delete("/delete/:id",verifyJWT,isSuperAdmin, deleteEvent);

export default router;
