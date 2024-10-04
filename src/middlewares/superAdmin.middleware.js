import { ApiError } from "../utils/ApiError.js";

const isSuperAdmin = (req,_, next) => {
	if (req.user && req.user.role === "superAdmin") {
		next();
	} else {
		throw new ApiError(403, "Super Admin Only Access");
	}
};

export { isSuperAdmin };
