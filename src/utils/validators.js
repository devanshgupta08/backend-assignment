import { z } from "zod";

// Complex validation functions
const isEmail = z
	.string()
	.min(1, "Email is required")
	.email("Invalid email format")
	.transform((email) => email.trim().toLowerCase());

const passwordComplexity = z
	.string()
	.min(5, "Password must be at least 5 characters long")
	.regex(/\d/, "Password must contain at least one number")
	.regex(/[a-z]/, "Password must contain at least one lowercase letter")
	.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
	.regex(
		/[!@#$%^&*(),.?":{}|<>]/,
		"Password must contain at least one special character"
	);

// !Schema definitions
const loginSchema = z.object({
	email: isEmail,
	password: passwordComplexity,
});

const changePasswordSchema = z.object({
	oldPassword: z.string().min(1, "Old password is required"),
	newPassword: passwordComplexity,
});


const roleEnum = z.enum(["admin", "superAdmin"], {
    errorMap: () => ({ message: "Role must be either 'admin' or 'superAdmin'" }),
});

const registerSchema = z.object({
	email: isEmail,
	password: passwordComplexity,
	role: roleEnum,
});

// !Export schemas
export {
	loginSchema,
	changePasswordSchema,
	registerSchema,
};
