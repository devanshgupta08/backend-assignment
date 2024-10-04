import { asyncHandler } from "../utils/AsyncHandler.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendOtpEmail } from "../utils/otpMailer.js";
import otpGenerator from "otp-generator";
import jwt from "jsonwebtoken";

const otpStorage = {};
const generateAccessAndRefreshToken = async (id) => {
	try {
		const user = await User.findById(id);
		const accessToken = await user.generateAccessToken();
		const refreshToken = await user.generateRefreshToken();

		user.refreshToken = refreshToken;
		await user.save({ validateBeforeSave: false });

		return { accessToken, refreshToken };
	} catch (error) {
		throw new ApiError(
			500,
			"Something went wrong while generating Access and Refresh tokens"
		);
	}
};

const loginUser = asyncHandler(async (req, res) => {
	// 1. take the data from the user
	// 2. validate the data -> error
	// 3. check for the user in the database using email/username -> error
	// 4. if found check password -> error
	// 5. generate access and refresh token
	// 6. return through cookies

	const { email, password } = req.body;

	const user = await User.findOne({
		email,
	});

	if (!user) {
		throw new ApiError(400, "Invalid username or email");
	}

	const passwordCorrect = await user.isPasswordCorrect(password);

	if (!passwordCorrect) {
		throw new ApiError(400, "Invalid password");
	}

	const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
		user._id
	);

	const options = {
		httpOnly: true,
		secure: true,
		sameSite: "None",
	};

	const userObject = user.toObject(); // Convert to plain object

	delete userObject.password;
	delete userObject.refreshToken;
	const role =
		userObject.role === "admin"
			? "Admin"
			: userObject.role === "superAdmin"
				? "Super Admin"
				: null;

	return res
		.status(200)
		.cookie("accessToken", accessToken, options)
		.cookie("refreshToken", refreshToken, options)
		.json(
			new ApiResponse(
				200,
				{
					user: userObject,
					accessToken,
					refreshToken,
				},
				`Logged in as ${role}`
			)
		);
});
const login2FA = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({
		email,
	});

	if (!user) {
		throw new ApiError(400, "Invalid  Email");
	}

	const passwordCorrect = await user.isPasswordCorrect(password);

	if (!passwordCorrect) {
		throw new ApiError(400, "Invalid password");
	}

	const numericOtp = otpGenerator.generate(6, {
		digits: true,
		upperCaseAlphabets: false,
		lowerCaseAlphabets: false,
		specialChars: false,
	});
	try {
		await sendOtpEmail(email, numericOtp);
	} catch (otpError) {
		throw otpError;
	}
	otpStorage[email] = numericOtp;
	return res
		.status(200)
		.json(
			new ApiResponse(
				200,
				{},
				`OTP sent successfully`
			)
		);
});
const verifyOtp = asyncHandler(async (req, res) => {
	const { email, otp } = req.body;

	
	if (!otpStorage[email] || otpStorage[email] !== otp) {
		throw new ApiError(400, "Invalid OTP");
	}

	
	const user = await User.findOne({ email });
	if (!user) {
		throw new ApiError(400, "Invalid Email");
	}

	const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

	const options = {
		httpOnly: true,
		secure: true,
		sameSite: "None",
	};

	const userObject = user.toObject(); 
	delete userObject.password;
	delete userObject.refreshToken;

	const role = userObject.role === "admin" 
		? "Admin" 
		: userObject.role === "superAdmin" 
			? "Super Admin" 
			: null;

	
	delete otpStorage[email];

	return res
		.status(200)
		.cookie("accessToken", accessToken, options)
		.cookie("refreshToken", refreshToken, options)
		.json(
			new ApiResponse(200, {
				user: userObject,
				accessToken,
				refreshToken,
			}, `Logged in as ${role}`)
		);
});
const logoutUser = asyncHandler(async (req, res) => {
	const user = await User.findByIdAndUpdate(
		req.user._id,
		{
			$set: {
				refreshToken: null,
			},
		},
		{
			new: true,
		}
	);

	if (!user) {
		throw new ApiError(400, "Failed to update user refreshToken");
	}

	const options = {
		httpOnly: true,
		secure: true,
		sameSite: "None",
	};

	return res
		.status(200)
		.clearCookie("accessToken", options)
		.clearCookie("refreshToken", options)
		.json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
	// check for refresh token in req -> error
	// verify using jwt and decode
	// find user from the db using id
	// verify if same
	// generate access token in cooken as well as body

	const incomingRefreshToken =
		req.cookies.refreshToken || req.body.refreshToken;

	if (!incomingRefreshToken) {
		throw new ApiError(
			401,
			"Unauthorized request - refresh token required"
		);
	}

	try {
		const decodedToken = jwt.verify(
			incomingRefreshToken,
			process.env.REFRESH_TOKEN_SECRET
		);

		if (!decodedToken) {
			throw new ApiError(401, "Invalid refresh token");
		}

		const user = await User.findById(decodedToken._id);

		if (!user) {
			throw new ApiError(401, "User does not exist");
		}

		if (incomingRefreshToken !== user.refreshToken) {
			throw new ApiError(401, "Invalid refresh token");
		}

		const { accessToken, refreshToken } =
			await generateAccessAndRefreshToken(user._id);

		const options = {
			httpOnly: true,
			secure: true,
			sameSite: "None",
		};

		res.status(200)
			.cookie("accessToken", accessToken, options)
			.cookie("refreshToken", refreshToken, options)
			.json(
				new ApiResponse(
					200,
					{
						accessToken,
						refreshToken,
					},
					"new tokens generated successfully"
				)
			);
	} catch (error) {
		throw new ApiError(401, error?.message || "Invalid refresh token");
	}
});

const changeExistingPassword = asyncHandler(async (req, res) => {
	// verify jwt token
	// validate password
	// get existing and new password
	// get user
	// verify password
	// set new password
	// const errors = validationResult(req);
	// if (!errors.isEmpty()) {
	// 	return res.status(400).json({ errors: errors.array() });
	// }

	const { oldPassword, newPassword } = req.body;

	if (oldPassword === newPassword) {
		throw new ApiError(400, "new password and old password cannot be same");
	}

	const user = await User.findById(req.user._id);

	const correctPassword = await user.isPasswordCorrect(oldPassword);

	if (!correctPassword) {
		throw new ApiError(400, "Invalid password");
	}

	// !the pre hook of mongoose will not be triggered with find and update method
	user.password = newPassword;
	await user.save();

	res.status(200).json(
		new ApiResponse(200, {}, "password changed successfully")
	);
});

const getUser = asyncHandler(async (req, res) => {
	return res.status(200).json(
		new ApiResponse(
			200,
			{
				user: req.user,
			},
			"current user returned successfully"
		)
	);
});

const registerUser = asyncHandler(async (req, res) => {
	// Get data from the request
	const { email, role, password } = req.body;

	// Check for existing user using username and email
	const existingUser = await User.findOne({
		email,
	});

	if (existingUser) {
		throw new ApiError(400, "User with email already exists");
	}

	// Create new document in the database
	const user = await User.create({
		email: email.toLowerCase(),
		password,
		role,
	});

	// Check for the created user and exclude password and refreshToken
	const createdUser = await User.findById(user._id).select(
		"-password -refreshToken"
	);

	if (!createdUser) {
		throw new ApiError(
			500,
			"Something went wrong while registering the user in the database"
		);
	}

	// Return the data by removing sensitive fields
	return res
		.status(201)
		.json(
			new ApiResponse(201, createdUser, "User registered Successfully")
		);
});

export {
	loginUser,
	logoutUser,
	refreshAccessToken,
	changeExistingPassword,
	getUser,
	registerUser,
	login2FA,
	verifyOtp
};
