import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authHooks } from "../../hooks/useAuth";
import { USER_TYPES } from "../../constants";

// ✅ Zod Schema - Backend validation এর সাথে match করে
const registerSchema = z.object({
  fullName: z
    .string()
    .min(3, "Full Name must be at least 3 characters")
    .max(50, "Full Name must be at most 50 characters"),

  email: z.string().email("Please enter a valid email address"),

  userName: z
    .string()
    .min(1, "Username is required")
    .regex(/^\S*$/, "Username cannot contain spaces")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/(?=.*[a-z])/, "Password must contain at least one lowercase letter")
    .regex(/(?=.*[A-Z])/, "Password must contain at least one uppercase letter")
    .regex(/(?=.*\d)/, "Password must contain at least one number"),

  userType: z.enum([USER_TYPES.STUDENT, USER_TYPES.TEACHER], {
    message: "User Type is required",
  }),

  // 📝 agreeToTerms: শুধু Frontend এর জন্য, Backend এ যাবে না
  agreeToTerms: z.literal(true, "You must agree to the terms"),
});

// ✅ TypeScript type infer from Zod schema
type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
  const { mutate: register, isPending } = authHooks.useRegister();
  const [showPassword, setShowPassword] = useState(false);

  // ✅ React Hook Form with Zod resolver
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      userName: "",
      password: "",
      userType: undefined,
      agreeToTerms: undefined,
    },
  });

  // ✅ Form submit handler - much cleaner now!
  const onSubmit = (data: RegisterFormData) => {
    // 📝 Real World Safety: Backend এও এখন agreeToTerms পাঠানো হচ্ছে
    register({ userData: data });
  };

  return (
    <div className="flex h-screen items-center justify-center space-x-15 overflow-hidden">
      {/* Header - Left Side */}
      <div className="text-center">
        <h1 className="mb-2 text-4xl font-bold text-gray-900">SocialHub</h1>
        <h2 className="mb-2 text-2xl font-semibold text-gray-700">
          Create Account
        </h2>
        <p className="text-gray-600">Join our community today</p>
      </div>

      {/* Register Form - Right Side */}
      <div className="max-h-[90vh] w-[550px] overflow-y-auto rounded-lg border bg-white p-5 shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Scrollable Input Fields */}
          <div className="max-h-[70vh] space-y-3 overflow-y-auto p-2">
            {/* Full Name Field */}
            <div>
              <label
                htmlFor="fullName"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                {...registerField("fullName")}
                className={`w-full rounded-lg border px-3 py-2 transition-colors focus:ring-2 focus:outline-none ${
                  errors.fullName
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                }`}
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                {...registerField("email")}
                className={`w-full rounded-lg border px-3 py-2 transition-colors focus:ring-2 focus:outline-none ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                }`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Username Field */}
            <div>
              <label
                htmlFor="userName"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                id="userName"
                type="text"
                {...registerField("userName")}
                className={`w-full rounded-lg border px-3 py-2 transition-colors focus:ring-2 focus:outline-none ${
                  errors.userName
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                }`}
                placeholder="Choose a username (e.g., user_123)"
              />
              {errors.userName && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.userName.message}
                </p>
              )}
            </div>

            {/* User Type Field */}
            <div>
              <label
                htmlFor="userType"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                I am a
              </label>
              <select
                id="userType"
                {...registerField("userType")}
                className={`w-full appearance-none rounded-lg border px-3 py-2 transition-colors focus:ring-2 focus:outline-none ${
                  errors.userType
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                }`}
              >
                <option value="">Select user type</option>
                <option value={USER_TYPES.STUDENT}>Student</option>
                <option value={USER_TYPES.TEACHER}>Teacher</option>
              </select>
              {errors.userType && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.userType.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...registerField("password")}
                  className={`w-full rounded-lg border px-3 py-2 pr-10 transition-colors focus:ring-2 focus:outline-none ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {/* Password Requirements Hint */}
              <p className="mt-1 text-xs font-medium text-gray-500">
                Min 8 characters, 1 uppercase, 1 lowercase, 1 number
              </p>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          {/* Terms Agreement - Fixed with button */}
          <div>
            <div className="flex items-start">
              <input
                id="agreeToTerms"
                type="checkbox"
                {...registerField("agreeToTerms")}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="agreeToTerms"
                className="ml-2 block text-sm font-medium text-gray-700"
              >
                I agree to the{" "}
                <NavLink
                  to="/terms"
                  className="text-blue-600 hover:text-blue-500"
                >
                  Terms of Service
                </NavLink>{" "}
                and{" "}
                <NavLink
                  to="/privacy"
                  className="text-blue-600 hover:text-blue-500"
                >
                  Privacy Policy
                </NavLink>
              </label>
            </div>
            {errors.agreeToTerms && (
              <p className="mt-1 text-sm text-red-500">
                {errors.agreeToTerms.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {isPending ? (
              <div className="flex items-center justify-center">
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                Creating account...
              </div>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Login NavLink */}
        <div className="mt-3 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <NavLink
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign in here
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;


