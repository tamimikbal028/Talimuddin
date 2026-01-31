import Joi from "joi";
import { USER_TYPES } from "../constants/index.js";

// ১. রেজিস্ট্রেশন স্কিমা
const userRegisterSchema = Joi.object({
  fullName: Joi.string().trim().min(3).max(50).required().messages({
    "string.empty": "Full name is required",
    "string.min": "Full name must be at least 3 characters",
  }),

  phoneNumber: Joi.string()
    .trim()
    .pattern(/^[0-9]{11}$/)
    .required()
    .messages({
      "string.empty": "Phone number is required",
      "string.pattern.base": "Phone number must be 11 digits",
    }),

  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "string.empty": "Password is required",
  }),

  userName: Joi.string()
    .trim()
    .min(3)
    .max(30)
    // ✅ NEW: Regular expression to allow only letters, numbers, and underscores
    .pattern(new RegExp("^[a-zA-Z0-9_]+$"))
    .required()
    .messages({
      "string.pattern.base":
        "Username can only contain letters, numbers, and underscores.",
      "string.min": "Username must be at least 3 characters long.",
      "string.empty": "Username is required.",
    }),

  // userType is optional, will default to USER in service
  userType: Joi.string()
    .valid(USER_TYPES.USER)
    .optional()
    .default(USER_TYPES.USER)
    .messages({
      "any.only": "Invalid user type.",
    }),
  // ✅ Real World Safety: Backend এও Terms Agreement চেক করা
  agreeToTerms: Joi.boolean().valid(true).required().messages({
    "any.only": "You must agree to the terms and conditions.",
    "any.required": "Agreement to terms is required.",
  }),
});

export { userRegisterSchema };
