import { Router } from "express";
import {
	changeExistingPassword,
	getUser,
	loginUser,
	logoutUser,
	refreshAccessToken,
	registerUser,
	login2FA,
	verifyOtp
} from "../controllers/user.controllers.js";
import {
	loginSchema,
	changePasswordSchema,
	registerSchema
} from "../utils/validators.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = Router();

router
	.route("/register")
	.post(validate(registerSchema), registerUser);
router.route("/login").post(validate(loginSchema), loginUser);
router.route("/login2fa").post(validate(loginSchema), login2FA);
router.route("/verifyotp").post(verifyOtp);

router.route("/logout").post(verifyJWT, logoutUser);	

router.route("/generate-token").post(refreshAccessToken);

router
	.route("/change-password")
	.post(verifyJWT, validate(changePasswordSchema), changeExistingPassword);

router.route("/get-user").get(verifyJWT, getUser);


export default router;
