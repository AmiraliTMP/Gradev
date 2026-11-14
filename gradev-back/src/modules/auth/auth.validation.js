import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .email("Please provide a valid email address.")
  .max(254, "Email cannot exceed 254 characters.")
  .transform((value) => value.toLowerCase());

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long.")
  .max(72, "Password cannot exceed 72 characters.");

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters long.")
      .max(60, "Name cannot exceed 60 characters."),

    email: emailSchema,

    password: passwordSchema,
  })
  .strict();

export const loginSchema = z
  .object({
    email: emailSchema,

    password: z
      .string()
      .min(1, "Password is required.")
      .max(72, "Password cannot exceed 72 characters."),
  })
  .strict();

export const updateProfileSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters long.")
      .max(60, "Name cannot exceed 60 characters.")
      .optional(),

    email: emailSchema.optional(),
  })
  .strict()
  .refine((data) => data.name !== undefined || data.email !== undefined, {
    message: "At least one field (name or email) must be provided.",
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Current password is required.")
      .max(72, "Current password cannot exceed 72 characters."),

    newPassword: passwordSchema,

    confirmPassword: z
      .string()
      .min(1, "Please confirm your new password.")
      .max(72, "Password cannot exceed 72 characters."),
  })
  .strict()
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New password and confirmation do not match.",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password.",
    path: ["newPassword"],
  });

export const forgotPasswordSchema = z
  .object({
    email: emailSchema,
  })
  .strict();

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required."),

    newPassword: passwordSchema,

    confirmPassword: z
      .string()
      .min(1, "Please confirm your new password.")
      .max(72, "Password cannot exceed 72 characters."),
  })
  .strict()
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New password and confirmation do not match.",
    path: ["confirmPassword"],
  });
