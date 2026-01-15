import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authHooks } from "../../hooks/useAuth";

// ✅ Zod Schema for Login
const loginSchema = z.object({
  phoneNumber: z
    .string()
    .regex(
      /^01[3-9]\d{8}$/,
      "Please enter a valid phone number"
    ),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

// ✅ TypeScript type infer from Zod schema
type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const { mutate: login, isPending } = authHooks.useLogin();
  const [showPassword, setShowPassword] = useState(false);
  // ✅ Password field focus করার জন্য Ref
  const passwordRef = useRef<HTMLInputElement | null>(null);

  // ✅ React Hook Form with Zod resolver
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phoneNumber: "",
      password: "",
      rememberMe: false,
    },
  });

  // ✅ Component mount এ localStorage থেকে remembered phone number load করা
  useEffect(() => {
    const rememberedPhone = localStorage.getItem("rememberedPhone");
    if (rememberedPhone) {
      reset({
        phoneNumber: rememberedPhone,
        password: "",
        rememberMe: true,
      });
      // ✅ Phone number যদি আগে থেকেই থাকে, তাহলে সরাসরি Password field এ focus করব
      setTimeout(() => passwordRef.current?.focus(), 0);
    }
  }, [reset]);

  // ✅ Form submit handler
  const onSubmit = (data: LoginFormData) => {
    // Remember Me: login করার আগেই handle করি
    if (data.rememberMe) {
      localStorage.setItem("rememberedPhone", data.phoneNumber);
    } else {
      localStorage.removeItem("rememberedPhone");
    }

    login({
      credentials: { phoneNumber: data.phoneNumber, password: data.password },
    });
  };

  return (
    <div className="flex h-screen items-center justify-center space-x-15 overflow-hidden">
      {/* Header - Left Side */}
      <div className="text-center">
        <h1 className="mb-2 text-4xl font-bold text-green-600">Talimuddin</h1>
        <h2 className="mb-2 text-2xl font-semibold text-gray-700">
          Welcome Back
        </h2>
        <p className="text-gray-600">Sign in to your account to continue</p>
      </div>

      {/* Login Form - Right Side */}
      <div className="w-[400px] rounded-lg border bg-white p-8 shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {/* Phone Number Field */}
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                id="phoneNumber"
                type="tel"
                autoFocus // ✅ নতুন উইন্ডো লোড হলে বাই-ডিফল্ট এখানে ফোকাস থাকবে
                {...register("phoneNumber")}
                className={`mt-1 w-full rounded-lg border px-3 py-2 transition-colors focus:ring-2 focus:outline-none ${
                  errors.phoneNumber
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                }`}
                placeholder="Enter your phone number"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  // ✅ Hook Form এর সাথে Ref কানেক্ট করা
                  ref={(e) => {
                    register("password").ref(e);
                    passwordRef.current = e;
                  }}
                  className={`w-full rounded-lg border px-3 py-2 pr-10 transition-colors focus:ring-2 focus:outline-none ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="rememberMe"
                type="checkbox"
                {...register("rememberMe")}
                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 block text-sm font-medium text-gray-700"
              >
                Remember me
              </label>
            </div>
            <NavLink
              to="/forgot-password"
              className="text-sm font-medium text-green-600 hover:text-green-500"
            >
              Forgot password?
            </NavLink>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700 disabled:opacity-60"
          >
            {isPending ? (
              <div className="flex items-center justify-center">
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Register NavLink */}
        <div className="mt-5 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <NavLink
              to="/register"
              className="font-medium text-green-600 hover:text-green-500"
            >
              Sign up here
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
