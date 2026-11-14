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

const getUnitRange = (book, semester) => {
  const range = UNIT_RANGES[book]?.[semester];

  if (!range) {
    const error = new Error("Invalid book or semester.");
    error.statusCode = 400;
    throw error;
  }

  return range;
};

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

const generateClassName = ({ book, level, semester, groupName }) => {
  return `${book} ${level} ${semester} — ${groupName}`;
};

class ClassService {
  // CREATE
  async create(data, ownerId) {
    validateAcademicStructure(data);

    const units = generateUnits(data.book, data.semester);
    const name = generateClassName(data);

    return Class.create({
      ...data,
      name,
      units,
      owner: ownerId,
    });
  }

  // READ ALL - Only classes owned by the authenticated user
  async findAll({
    ownerId,
    search,
    book,
    level,
    semester,
    page = 1,
    limit = 10,
  }) {
    const filter = {
      owner: ownerId,
    };

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

  // READ ONE - Only the owner's class
  async findById(id, ownerId) {
    return Class.findOne({
      _id: id,
      owner: ownerId,
    }).lean();
  }

  // UPDATE - Only the owner's class
  async update(id, data, ownerId) {
    const existingClass = await Class.findOne({
      _id: id,
      owner: ownerId,
    });

    if (!existingClass) {
      return null;
    }

    const updatedData = {
      ...existingClass.toObject(),
      ...data,
    };

    validateAcademicStructure(updatedData);

    const name = generateClassName(updatedData);

    const units = generateUnits(updatedData.book, updatedData.semester);

    existingClass.set({
      ...data,
      name,
      units,
    });

    return existingClass.save();
  }

  // DELETE - Only the owner's class
  async delete(id, ownerId) {
    const deletedClass = await Class.findOneAndDelete({
      _id: id,
      owner: ownerId,
    });

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
