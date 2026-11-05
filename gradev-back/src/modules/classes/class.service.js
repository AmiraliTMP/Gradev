import Student from "../students/student.model.js";
import Class from "./class.model.js";

const BOOK_LEVELS = {
  "Family & Friends": ["1", "2", "3", "4"],
  InterChange: ["Intro", "1", "2", "3"],
};

const UNIT_RANGES = {
  "Family & Friends": {
    A: { start: 1, end: 5 },
    B: { start: 6, end: 10 },
    C: { start: 11, end: 15 },
  },

  InterChange: {
    A: { start: 1, end: 6 },
    B: { start: 6, end: 11 },
    C: { start: 12, end: 16 },
  },
};

// Get the unit range based on the selected book and semester.
const getUnitRange = (book, semester) => {
  const range = UNIT_RANGES[book]?.[semester];

  if (!range) {
    throw new Error("Invalid book or semester.");
  }

  return range;
};

// Generate the correct unit list.
const generateUnits = (book, semester) => {
  const { start, end } = getUnitRange(book, semester);

  return Array.from({ length: end - start + 1 }, (_, index) => {
    const unitNumber = start + index;

    return {
      unitNumber,
      title: `Unit ${unitNumber}`,
    };
  });
};

// Validate book and level combinations.
const validateAcademicStructure = ({ book, level, semester }) => {
  const validLevels = BOOK_LEVELS[book];

  if (!validLevels) {
    const error = new Error("Invalid book.");
    error.statusCode = 400;
    throw error;
  }

  if (!validLevels.includes(level)) {
    const error = new Error(`Level ${level} is invalid for ${book}.`);

    error.statusCode = 400;
    throw error;
  }

  if (!UNIT_RANGES[book]?.[semester]) {
    const error = new Error("Invalid semester.");
    error.statusCode = 400;
    throw error;
  }
};

// Generate the full class name.
const generateClassName = ({ book, level, semester, groupName }) => {
  return `${book} ${level} ${semester} — ${groupName}`;
};

class ClassService {
  // CREATE
  async create(data) {
    validateAcademicStructure(data);

    const units = generateUnits(data.book, data.semester);

    const name = generateClassName(data);

    return Class.create({
      ...data,
      name,
      units,
    });
  }

  // READ ALL
  async findAll({ search, book, level, semester, page = 1, limit = 10 }) {
    const filter = {};

    if (search) {
      const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      filter.$or = [
        { name: { $regex: safeSearch, $options: "i" } },
        { groupName: { $regex: safeSearch, $options: "i" } },
      ];
    }

    if (book) filter.book = book;
    if (level) filter.level = level;
    if (semester) filter.semester = semester;

    const skip = (page - 1) * limit;

    const [classes, total] = await Promise.all([
      Class.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),

      Class.countDocuments(filter),
    ]);

    return {
      classes,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // READ ONE
  async findById(id) {
    return Class.findById(id).lean();
  }

  // UPDATE
  async update(id, data) {
    const existingClass = await Class.findById(id);

    if (!existingClass) {
      return null;
    }

    // Merge existing data with the incoming changes.
    const updatedData = {
      ...existingClass.toObject(),
      ...data,
    };

    // Validate the complete academic structure.
    validateAcademicStructure(updatedData);

    // Regenerate the class name.
    const name = generateClassName(updatedData);

    // Always regenerate units.
    // This also repairs classes with outdated unit ranges.
    const units = generateUnits(updatedData.book, updatedData.semester);

    existingClass.set({
      ...data,
      name,
      units,
    });

    return existingClass.save();
  }

  // DELETE
  async delete(id) {
    const deletedClass = await Class.findByIdAndDelete(id);

    if (!deletedClass) {
      return null;
    }

    // Preserve students but remove their class assignment.
    await Student.updateMany(
      { class: deletedClass._id },
      { $set: { class: null } },
    );

    return deletedClass;
  }
}

const classService = new ClassService();

export default classService;
