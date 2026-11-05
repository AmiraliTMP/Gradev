import { z } from "zod";

const bookLevels = {
  "Family & Friends": ["1", "2", "3", "4"],
  InterChange: ["Intro", "1", "2", "3"],
};

const classFieldsSchema = z.object({
  groupName: z
    .string()
    .trim()
    .min(2, "Group name must contain at least 2 characters.")
    .max(50, "Group name cannot exceed 50 characters."),

  book: z.enum(["Family & Friends", "InterChange"]),

  level: z.string().min(1, "Please select a book level."),

  semester: z.enum(["A", "B", "C"]),
});

export const createClassSchema = classFieldsSchema.superRefine(
  (data, context) => {
    const validLevels = bookLevels[data.book];

    if (!validLevels.includes(data.level)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["level"],
        message: `Invalid level for ${data.book}.`,
      });
    }
  },
);

export const updateClassSchema = classFieldsSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field must be provided.",
  );
