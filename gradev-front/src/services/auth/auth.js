import { get, patch, post } from "../base-api";

const AUTH_URL = "/auth";

const authServices = {
  // POST: Register a new user
  register: (userData) => post(`${AUTH_URL}/register`, userData),

  // POST: Login
  login: (credentials) => post(`${AUTH_URL}/login`, credentials),

  // POST: Logout
  logout: () => post(`${AUTH_URL}/logout`),

  // GET: Retrieve the currently authenticated user
  getMe: () => get(`${AUTH_URL}/me`),

  // PATCH: Update user profile
  updateProfile: (profileData) =>
    patch(`${AUTH_URL}/update-profile`, profileData),

  // PATCH: Change password
  changePassword: (passwordData) =>
    patch(`${AUTH_URL}/change-password`, passwordData),

  // POST: Request password reset
  forgotPassword: (emailData) => post(`${AUTH_URL}/forgot-password`, emailData),

  // POST: Reset password
  resetPassword: (resetData) => post(`${AUTH_URL}/reset-password`, resetData),
};

export default authServices;
