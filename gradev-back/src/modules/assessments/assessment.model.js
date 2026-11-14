import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

// --------------------------------------------------
// Constants
// --------------------------------------------------

export const ASSESSMENT_GRADES = [
  "A+",
  "A",
  "B+",
  "B",
  "C+",
  "C",
  "D+",
  "D",
  "E+",
  "E",
  "F",
  "AB",
  "NI",
];

export const ASSESSMENT_CATEGORIES = [
  "grammar",
  "vocabulary",
  "listening",
  "reading",
  "speaking",
  "writing",
  "quiz",
  "summary",
  "spelling",
  "notebook",
  "workbook",
];

export const COURSE_LEVELS = [
  "Family & Friends 1",
  "Family & Friends 2",
  "Family & Friends 3",
  "Family & Friends 4",
  "InterChange Intro",
  "InterChange 1",
  "InterChange 2",
  "InterChange 3",
];

export const SEMESTERS = ["A", "B", "C"];

// --------------------------------------------------
// Factor Assessment Schema
// --------------------------------------------------

const factorAssessmentSchema = new Schema(
  {
    accomplished: {
      type: Boolean,
      default: null,
    },

    comment: {
      type: String,
      trim: true,
      default: "",
      maxlength: 1000,
    },
  },
  {
    _id: false,
  },
);

// --------------------------------------------------
// Overview Cell Schema
// --------------------------------------------------

const overviewCellSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ASSESSMENT_CATEGORIES,
    },

    unitNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 6,
    },

    grade: {
      type: String,
      enum: ASSESSMENT_GRADES,
      default: "NI",
    },

    comment: {
      type: String,
      trim: true,
      default: "",
      maxlength: 2000,
    },

    factors: {
      type: Map,
      of: factorAssessmentSchema,
      default: undefined,
    },
  },
  {
    _id: false,
  },
);

// --------------------------------------------------
// Session Grading Cell Schema
// --------------------------------------------------

const sessionGradeSchema = new Schema(
  {
    grade: {
      type: String,
      enum: ASSESSMENT_GRADES,
      default: "NI",
    },

    comment: {
      type: String,
      trim: true,
      default: "",
      maxlength: 2000,
    },
  },
  {
    _id: false,
  },
);

// --------------------------------------------------
// Session Schema
// --------------------------------------------------

const sessionSchema = new Schema(
  {
    sessionNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 17,
    },

    oq: {
      type: sessionGradeSchema,
      default: () => ({}),
    },

    wq: {
      type: sessionGradeSchema,
      default: () => ({}),
    },

    hw: {
      type: sessionGradeSchema,
      default: () => ({}),
    },
  },
  {
    _id: false,
  },
);

// --------------------------------------------------
// Assessment Schema
// --------------------------------------------------

const assessmentSchema = new Schema(
  {
    classId: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    teacherId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    courseLevel: {
      type: String,
      required: true,
      enum: COURSE_LEVELS,
    },

    semester: {
      type: String,
      required: true,
      enum: SEMESTERS,
    },

    overview: {
      type: [overviewCellSchema],
      default: [],
    },

    sessions: {
      type: [sessionSchema],

      default: () =>
        Array.from({ length: 17 }, (_, index) => ({
          sessionNumber: index + 1,
        })),

      validate: {
        validator: (sessions) =>
          sessions.length === 17 &&
          sessions.every(
            (session, index) => session.sessionNumber === index + 1,
          ),

        message:
          "An assessment must contain exactly 17 sessions in sequential order.",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// --------------------------------------------------
// Indexes
// --------------------------------------------------

// One assessment per student, class, and semester.
assessmentSchema.index(
  {
    classId: 1,
    studentId: 1,
    semester: 1,
  },
  {
    unique: true,
  },
);

// Useful for retrieving all assessments of a class.
assessmentSchema.index({
  classId: 1,
  semester: 1,
});

// Useful for retrieving all assessments of a student.
assessmentSchema.index({
  studentId: 1,
  semester: 1,
});

// --------------------------------------------------
// Model
// --------------------------------------------------

const Assessment = models.Assessment || model("Assessment", assessmentSchema);

export default Assessment;
