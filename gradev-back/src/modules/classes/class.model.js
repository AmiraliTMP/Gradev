import mongoose from "mongoose";

const BOOK_LEVELS = {
  "Family & Friends": ["1", "2", "3", "4"],
  InterChange: ["Intro", "1", "2", "3"],
};

const SEMESTERS = ["A", "B", "C"];

const getUnitRange = (book, semester) => {
  const unitRanges = {
    "Family & Friends": {
      A: { start: 1, end: 5 },
      B: { start: 6, end: 10 },
      C: { start: 11, end: 15 },
    },

    InterChange: {
      A: { start: 1, end: 6 },
      B: { start: 7, end: 11 },
      C: { start: 12, end: 16 },
    },
  };

  return unitRanges[book]?.[semester];
};

const unitSchema = new mongoose.Schema(
  {
    unitNumber: {
      type: Number,
      required: true,
      min: 1,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  },
);

const classSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    groupName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    book: {
      type: String,
      required: true,
      enum: Object.keys(BOOK_LEVELS),
    },

    level: {
      type: String,
      required: true,
      enum: ["1", "2", "3", "4", "Intro"],
    },

    semester: {
      type: String,
      required: true,
      enum: SEMESTERS,
    },

    units: {
      type: [unitSchema],
      required: true,
      validate: {
        validator(units) {
          const range = getUnitRange(this.book, this.semester);

          if (!range) {
            return false;
          }

          const expectedUnitNumbers = Array.from(
            { length: range.end - range.start + 1 },
            (_, index) => range.start + index,
          );

          const actualUnitNumbers = units.map((unit) => unit.unitNumber);

          return (
            expectedUnitNumbers.length === actualUnitNumbers.length &&
            expectedUnitNumbers.every(
              (unitNumber, index) => unitNumber === actualUnitNumbers[index],
            )
          );
        },

        message: "The units do not match the selected book and semester.",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

classSchema.pre("validate", function () {
  const validLevels = BOOK_LEVELS[this.book];

  if (validLevels && !validLevels.includes(this.level)) {
    this.invalidate(
      "level",
      `Level ${this.level} is not valid for ${this.book}.`,
    );
  }
});

const Class = mongoose.model("Class", classSchema);

export default Class;
