import Class from "../classes/class.model.js";
import Student from "./student.model.js";

const classPopulate = {
  path: "class",
  select: "name groupName book level semester units",
};

class StudentService {
  async create(data) {
    if (data.class) {
      const foundClass = await Class.findById(data.class);

      if (!foundClass) {
        const error = new Error("Selected class does not exist.");
        error.statusCode = 400;
        throw error;
      }
    }

    const student = await Student.create(data);

    return Student.findById(student._id).populate(classPopulate).lean();
  }

  async findAll({
    search,
    classId,
    book,
    level,
    semester,
    isActive,
    page = 1,
    limit = 10,
  }) {
    const filter = {};

    if (search) {
      const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      filter.$or = [
        { firstName: { $regex: safeSearch, $options: "i" } },
        { lastName: { $regex: safeSearch, $options: "i" } },
        { email: { $regex: safeSearch, $options: "i" } },
      ];
    }

    if (classId) {
      filter.class = classId;
    }

    if (typeof isActive === "boolean") {
      filter.isActive = isActive;
    }

    // Filter by academic information belonging to a class.
    if (book || level || semester) {
      const classFilter = {};

      if (book) classFilter.book = book;
      if (level) classFilter.level = level;
      if (semester) classFilter.semester = semester;

      const matchingClasses = await Class.find(classFilter)
        .select("_id")
        .lean();

      const matchingClassIds = matchingClasses.map((item) => item._id);

      if (filter.class) {
        const selectedClassId = filter.class.toString();

        filter.class = matchingClassIds.some(
          (id) => id.toString() === selectedClassId,
        )
          ? filter.class
          : { $in: [] };
      } else {
        filter.class = { $in: matchingClassIds };
      }
    }

    const skip = (page - 1) * limit;

    const [students, total] = await Promise.all([
      Student.find(filter)
        .populate(classPopulate)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Student.countDocuments(filter),
    ]);

    return {
      students,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id) {
    return Student.findById(id).populate(classPopulate).lean();
  }

  async update(id, data) {
    if (data.class) {
      const foundClass = await Class.findById(data.class);

      if (!foundClass) {
        const error = new Error("Selected class does not exist.");
        error.statusCode = 400;
        throw error;
      }
    }

    return Student.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    })
      .populate(classPopulate)
      .lean();
  }

  async delete(id) {
    return Student.findByIdAndDelete(id);
  }
}

const studentService = new StudentService();

export default studentService;
