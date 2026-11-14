import authService from "./auth.service.js";

const COOKIE_NAME = process.env.COOKIE_NAME || "gradev_token";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const clearAuthCookie = (res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
};

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);

    res.cookie(COOKIE_NAME, result.token, cookieOptions);

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      data: {
        user: result.user,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);

    res.cookie(COOKIE_NAME, result.token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Logged in successfully.",
      data: {
        user: result.user,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const logout = (req, res) => {
  clearAuthCookie(res);

  return res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.user.userId);

    return res.status(200).json({
      success: true,
      message: "User retrieved successfully.",
      data: {
        user,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await authService.updateProfile(req.user.userId, req.body);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: {
        user,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    await authService.changePassword(req.user.userId, req.body);

    clearAuthCookie(res);

    return res.status(200).json({
      success: true,
      message: "Password changed successfully. Please log in again.",
    });
  } catch (error) {
    return next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    await authService.forgotPassword(req.body);

    return res.status(200).json({
      success: true,
      message:
        "If an active account with that email exists, a password reset link has been sent.",
    });
  } catch (error) {
    return next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    await authService.resetPassword(req.body);

    clearAuthCookie(res);

    return res.status(200).json({
      success: true,
      message: "Password reset successfully. Please log in again.",
    });
  } catch (error) {
    return next(error);
  }
};

const authController = {
  register,
  login,
  logout,
  getCurrentUser,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
};

export default authController;
