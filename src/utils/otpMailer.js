import nodemailer from "nodemailer";
import { ApiError } from "./ApiError.js";

const sendOtpEmail = async (email, otp) => {
	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	});
	const mailOptions = {
		from: process.env.EMAIL_USER,
		to: email,
		subject: "Your OTP Code",
		text: `Your OTP code is: ${otp}`,
	};

	try {
		await transporter.sendMail(mailOptions);
	} catch (error) {
		throw new ApiError(500, "Failed to send OTP email", error);
	}

};

export { sendOtpEmail };
