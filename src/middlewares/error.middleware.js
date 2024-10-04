import { ApiError } from "../utils/ApiError.js";

const errorMiddleware = (err, req, res, next) => {
	
	if (err instanceof ApiError) {
		return res.status(err.statusCode).json(err.toJSON());
	}

	return res.status(500).json({
		statusCode: 500,
		message: "Internal Server Error",
		success: false,
		errors: [],
		stack: err.stack,
	});
};

export { errorMiddleware };
