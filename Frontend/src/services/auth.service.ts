// Axios Instance
import api from "../lib/axios";

// Types
import type {
  LoginCredentials,
  User,
  ApiResponse,
  RegisterData,
} from "../types";

export const authService = {
  // Register new user
  register: async (
    userData: RegisterData
  ): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.post<ApiResponse<{ user: User }>>(
      "/users/register",
      userData
    );
    return response.data;
  },

  // Login user
  login: async (
    credentials: LoginCredentials
  ): Promise<ApiResponse<{ user: User }>> => {
    const payload = {
      phoneNumber: credentials.phoneNumber,
      password: credentials.password,
    };

    const response = await api.post<ApiResponse<{ user: User }>>(
      "/users/login",
      payload
    );
    return response.data;
  },

  // Logout user
  logout: async (): Promise<ApiResponse<null>> => {
    const response = await api.post<ApiResponse<null>>("/users/logout");
    return response.data;
  },

  // Get Current Logged-in User
  getCurrentUser: async (): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.get<ApiResponse<{ user: User }>>(
      "/users/current-user"
    );
    return response.data;
  },

  // Refresh access token
  refreshToken: async (): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.post<ApiResponse<{ user: User }>>(
      "/users/refresh-token"
    );
    return response.data;
  },

  // Change Password
  changePassword: async (data: {
    oldPassword: string;
    newPassword: string;
  }): Promise<ApiResponse<null>> => {
    const response = await api.post<ApiResponse<null>>(
      "/users/change-password",
      data
    );
    return response.data;
  },
};

export default authService;
