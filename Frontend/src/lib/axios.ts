import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";

/**
 * ====================================
 * AXIOS INSTANCE CONFIGURATION
 * ====================================
 *
 * এই file এ Axios এর base setup করা হয়েছে।
 * সব API call এই instance use করবে।
 *
 * Key Features:
 * 1. Base URL: .env থেকে নেয়া (VITE_API_BASE_URL)
 * 2. withCredentials: true → প্রতিটা request এ cookie পাঠাবে
 * 3. Auto Token Refresh → 401 error এ automatically refresh token try করবে
 */

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,

  // ⚠️ CRITICAL: এটা ছাড়া cookie পাঠানো/receive করা যাবে না!
  // Backend এ CORS এও credentials: true থাকতে হবে
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },

  // timeout to prevent hanging requests
  timeout: 15000, // 15 seconds
  // কিছু request এ timeout বেশি লাগতে পারে, ওগুলোতে আলাদা করে set করা যাবে
});

/**
 * ====================================
 * AUTO TOKEN REFRESH LOGIC
 * ====================================
 *
 * যখন Access Token expire হয়:
 * 1. Backend 401 Unauthorized দেয়
 * 2. এই interceptor catch করে
 * 3. Automatically /refresh-token call করে
 * 4. নতুন token পেলে original request আবার try করে
 * 5. User কিছুই বুঝবে না - seamless experience!
 */

// Flag to prevent multiple refresh attempts at the same time
// যদি একসাথে অনেক request 401 পায়, শুধু একবার refresh করবে
let isRefreshing = false;

// Queue for requests that are waiting for token refresh
// Refresh হওয়ার সময় অন্য requests এখানে wait করবে
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

// Process all queued requests after refresh completes
const processQueue = (error: Error | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Response interceptor for handling 401 errors and token refresh
api.interceptors.response.use(
  // Success response → সরাসরি return
  (response) => response,

  // Error response → 401 হলে refresh try করো
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      // ⚠️ এই routes এ refresh করার দরকার নেই
      // Login/Register fail হলে সেটা user এর ভুল, token issue না
      // current-user fail মানে user logged in না, refresh try করে লাভ নেই
      const skipRefreshUrls = [
        "/users/login",
        "/users/register",
        "/users/refresh-token",
        "/users/current-user", // ← logged out থাকলে 401 expected
      ];
      if (skipRefreshUrls.some((url) => originalRequest.url?.includes(url))) {
        return Promise.reject(error);
      }

      // যদি already refresh হচ্ছে, queue এ যোগ করো
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      // Mark as retrying and start refresh
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh the token
        // Backend নতুন access token cookie তে set করে দেবে
        await api.post("/users/refresh-token");
        processQueue(null);

        // ✅ Refresh successful! Original request আবার try করো
        return api(originalRequest);
      } catch (refreshError) {
        // ❌ Refresh ও fail হয়েছে - মানে session expire
        processQueue(refreshError as Error);

        // Custom event dispatch করো - App.tsx এ listen করছে
        // এটা user কে logout করে login page এ নিয়ে যাবে
        window.dispatchEvent(new CustomEvent("auth:logout"));

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
