import { z } from "zod";

const studentFieldsSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must contain at least 2 characters.")
    .max(50, "First name cannot exceed 50 characters."),

  lastName: z
    .string()
    .trim()
    .min(2, "Last name must contain at least 2 characters.")
    .max(50, "Last name cannot exceed 50 characters."),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .transform((value) => value.toLowerCase()),

  phone: z
    .string()
    .trim()
    .min(7, "Phone number must contain at least 7 characters.")
    .max(20, "Phone number cannot exceed 20 characters."),

  class: z
    .string()
    .regex(/^[a-f\d]{24}$/i, "Invalid class ID.")
    .nullable()
    .optional(),

  isActive: z.boolean().optional(),
});

export const createStudentSchema = studentFieldsSchema;

export const updateStudentSchema = studentFieldsSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field must be provided.",
  );
