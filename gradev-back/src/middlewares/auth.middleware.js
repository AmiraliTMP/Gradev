import jwt from "jsonwebtoken";

import User from "../modules/auth/auth.model.js";
import ApiError from "../utils/ApiError.js";

const authMiddleware = async (req, res, next) => {
  try {
    const cookieName = process.env.COOKIE_NAME || "gradev_token";
    const token = req.cookies?.[cookieName];

    if (!token) {
      throw new ApiError(401, "Authentication required.");
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured.");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select(
      "+passwordChangedAt",
    );

    if (!user) {
      throw new ApiError(401, "User account no longer exists.");
    }

    if (!user.isActive) {
      throw new ApiError(403, "This account has been deactivated.");
    }

    // Reject tokens issued before the user's password was changed.
    if (
      user.passwordChangedAt &&
      decoded.iat * 1000 < user.passwordChangedAt.getTime()
    ) {
      throw new ApiError(
        401,
        "Your password has changed. Please log in again.",
      );
    }

    req.user = {
      userId: user._id.toString(),
      role: user.role,
    };

    return next();
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return next(
        new ApiError(401, "Invalid or expired authentication token."),
      );
    }

    return next(error);
  }
};

export default authMiddleware;
