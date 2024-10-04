import { ApiError } from "../utils/ApiError.js";

const isAdmin = (req,_, next) => {
	if (req.user && (req.user.role === "admin" || req.user.role === "superAdmin")) {
		next();
	} else {
		throw new ApiError(403, "Admin Only Access");
	}
};

export { isAdmin };
