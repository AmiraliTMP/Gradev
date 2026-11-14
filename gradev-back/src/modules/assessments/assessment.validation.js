import { z } from "zod";

import {
  ASSESSMENT_CATEGORIES,
  ASSESSMENT_GRADES,
  COURSE_LEVELS,
  SEMESTERS,
} from "./assessment.model.js";

// --------------------------------------------------
// Common Schemas
// --------------------------------------------------

const objectIdSchema = z
  .string()
  .regex(/^[a-fA-F0-9]{24}$/, "Invalid MongoDB ObjectId.");

const gradeSchema = z.enum(ASSESSMENT_GRADES);

const categorySchema = z.enum(ASSESSMENT_CATEGORIES);

const courseLevelSchema = z.enum(COURSE_LEVELS);

const semesterSchema = z.enum(SEMESTERS);

const commentSchema = z
  .string()
  .trim()
  .max(2000, "Comment cannot exceed 2000 characters.");

// --------------------------------------------------
// Factor Definitions
// --------------------------------------------------

export const ASSESSMENT_FACTORS = {
  grammar: [
    "controlledPractice",
    "semiControlledPractice",
    "freePractice",
    "metUnmetSituations",
  ],

  speaking: [
    "fluency",
    "ideaDevelopment",
    "grammar",
    "vocabulary",
    "pronunciation",
    "comprehension",
    "wtc",
  ],

  writing: ["punctuation", "capitalization", "spelling", "handwriting"],

  interchangeWriting: ["topicSentences", "brainstorming"],
};

const ALL_FACTOR_KEYS = [
  ...ASSESSMENT_FACTORS.grammar,
  ...ASSESSMENT_FACTORS.speaking,
  ...ASSESSMENT_FACTORS.writing,
  ...ASSESSMENT_FACTORS.interchangeWriting,
];

// --------------------------------------------------
// Factor Assessment
// --------------------------------------------------

const factorAssessmentSchema = z.object({
  accomplished: z.boolean().nullable().optional(),

  comment: z
    .string()
    .trim()
    .max(1000, "Factor comment cannot exceed 1000 characters.")
    .optional(),
});

const factorsSchema = z
  .record(z.string(), factorAssessmentSchema)
  .superRefine((factors, ctx) => {
    Object.keys(factors).forEach((key) => {
      if (!ALL_FACTOR_KEYS.includes(key)) {
        ctx.addIssue({
          code: "custom",
          message: `Invalid assessment factor: ${key}`,
          path: [key],
        });
      }
    });
  });

// --------------------------------------------------
// Overview Cell
// --------------------------------------------------

const overviewCellSchema = z.object({
  category: categorySchema,

  unitNumber: z.number().int().min(1).max(6),

  grade: gradeSchema.optional(),

  comment: commentSchema.optional(),

  factors: factorsSchema.optional(),
});

const overviewSchema = z.array(overviewCellSchema).superRefine((cells, ctx) => {
  const uniqueCells = new Set();

  cells.forEach((cell, index) => {
    const key = `${cell.category}-${cell.unitNumber}`;

    if (uniqueCells.has(key)) {
      ctx.addIssue({
        code: "custom",
        message: `Duplicate overview cell: ${key}`,
        path: [index],
      });
    }

    uniqueCells.add(key);
  });
});

// --------------------------------------------------
// Session Cell
// --------------------------------------------------

const sessionGradeSchema = z.object({
  grade: gradeSchema.optional(),

  comment: commentSchema.optional(),
});

const sessionSchema = z.object({
  sessionNumber: z.number().int().min(1).max(17),

  oq: sessionGradeSchema.optional(),

  wq: sessionGradeSchema.optional(),

  hw: sessionGradeSchema.optional(),
});

const sessionsSchema = z
  .array(sessionSchema)
  .length(17, "Exactly 17 sessions are required.")
  .superRefine((sessions, ctx) => {
    sessions.forEach((session, index) => {
      if (session.sessionNumber !== index + 1) {
        ctx.addIssue({
          code: "custom",
          message: "Sessions must be numbered sequentially from 1 to 17.",
          path: [index, "sessionNumber"],
        });
      }
    });
  });

// --------------------------------------------------
// Create Assessment
// --------------------------------------------------

export const createAssessmentSchema = z
  .object({
    classId: objectIdSchema,

    studentId: objectIdSchema,

    courseLevel: courseLevelSchema,

    semester: semesterSchema,

    overview: overviewSchema.optional(),

    sessions: sessionsSchema.optional(),
  })
  .strict();

// --------------------------------------------------
// Update Assessment
// --------------------------------------------------

export const updateAssessmentSchema = z
  .object({
    courseLevel: courseLevelSchema.optional(),

    semester: semesterSchema.optional(),

    overview: overviewSchema.optional(),

    sessions: sessionsSchema.optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for updating.",
  });

// --------------------------------------------------
// Update Overview Cell
// --------------------------------------------------

export const updateOverviewCellSchema = z
  .object({
    category: categorySchema,

    unitNumber: z.number().int().min(1).max(6),

    grade: gradeSchema.optional(),

    comment: commentSchema.optional(),

    factors: factorsSchema.optional(),
  })
  .strict()
  .refine(
    (data) =>
      data.grade !== undefined ||
      data.comment !== undefined ||
      data.factors !== undefined,
    {
      message: "At least one of grade, comment, or factors is required.",
    },
  );

// --------------------------------------------------
// Update Session Cell
// --------------------------------------------------

export const updateSessionCellSchema = z
  .object({
    sessionNumber: z.number().int().min(1).max(17),

    assessmentType: z.enum(["oq", "wq", "hw"]),

    grade: gradeSchema.optional(),

    comment: commentSchema.optional(),
  })
  .strict()
  .refine((data) => data.grade !== undefined || data.comment !== undefined, {
    message: "At least one of grade or comment is required.",
  });

// --------------------------------------------------
// Export
// --------------------------------------------------

export {
  categorySchema,
  courseLevelSchema,
  gradeSchema,
  objectIdSchema,
  overviewSchema,
  semesterSchema,
  sessionsSchema,
};
