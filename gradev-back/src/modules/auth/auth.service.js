import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";

import emailService from "../../services/email.service.js";
import ApiError from "../../utils/ApiError.js";
import User from "./auth.model.js";

const SALT_ROUNDS = 12;
const RESET_TOKEN_EXPIRATION = 15 * 60 * 1000;

const createToken = (userId) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured.");
  }

  return jwt.sign({ userId }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

const getSafeUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const register = async ({ name, email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  let user;

  try {
    user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
    });
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(409, "An account with this email already exists.");
    }

    throw error;
  }

  const token = createToken(user._id.toString());

  return {
    user: getSafeUser(user),
    token,
  };
};

const login = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({
    email: normalizedEmail,
  }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  if (!user.isActive) {
    throw new ApiError(403, "This account has been deactivated.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const token = createToken(user._id.toString());

  return {
    user: getSafeUser(user),
    token,
  };
};

const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  if (!user.isActive) {
    throw new ApiError(403, "This account has been deactivated.");
  }

  return getSafeUser(user);
};

const updateProfile = async (userId, data) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  if (!user.isActive) {
    throw new ApiError(403, "This account has been deactivated.");
  }

  if (data.email) {
    const normalizedEmail = data.email.toLowerCase().trim();

    const existingUser = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: userId },
    });

    if (existingUser) {
      throw new ApiError(409, "An account with this email already exists.");
    }

    user.email = normalizedEmail;
  }

  if (data.name !== undefined) {
    user.name = data.name;
  }

  try {
    await user.save();
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(409, "An account with this email already exists.");
    }

    throw error;
  }

  return getSafeUser(user);
};

const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  if (!user.isActive) {
    throw new ApiError(403, "This account has been deactivated.");
  }

  const isCurrentPasswordValid = await bcrypt.compare(
    currentPassword,
    user.password,
  );

  if (!isCurrentPasswordValid) {
    throw new ApiError(401, "Current password is incorrect.");
  }

  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

  user.password = hashedPassword;
  user.passwordChangedAt = new Date();

  await user.save();

  return true;
};

const forgotPassword = async ({ email }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({
    email: normalizedEmail,
    isActive: true,
  });

  // Always return a generic response for unknown emails.
  if (!user) {
    return true;
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  const hashedResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.passwordResetToken = hashedResetToken;
  user.passwordResetExpires = new Date(Date.now() + RESET_TOKEN_EXPIRATION);

  await user.save();

  const frontendUrl = process.env.PASSWORD_RESET_URL;

  if (!frontendUrl) {
    throw new Error("PASSWORD_RESET_URL is not configured.");
  }

  const resetUrl = `${frontendUrl}?token=${encodeURIComponent(resetToken)}`;

  try {
    await emailService.sendPasswordResetEmail({
      email: user.email,
      name: user.name,
      resetUrl,
    });
  } catch (error) {
    // Remove the reset token if email delivery fails.
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    throw error;
  }

  return true;
};

const resetPassword = async ({ token, newPassword }) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
    isActive: true,
  }).select("+passwordResetToken +passwordResetExpires");

  if (!user) {
    throw new ApiError(400, "Reset token is invalid or has expired.");
  }

  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

  user.password = hashedPassword;
  user.passwordChangedAt = new Date();

  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  return true;
};

const authService = {
  register,
  login,
  getCurrentUser,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
};

export default authService;
