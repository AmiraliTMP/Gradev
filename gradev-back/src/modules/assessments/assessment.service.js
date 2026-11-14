import mongoose from "mongoose";

import Assessment from "./assessment.model.js";

import ApiError from "../../utils/ApiError.js";

const { Types } = mongoose;

// --------------------------------------------------
// Helpers
// --------------------------------------------------

const isValidObjectId = (id) => Types.ObjectId.isValid(id);

const validateObjectId = (id, fieldName = "ID") => {
  if (!isValidObjectId(id)) {
    throw new ApiError(400, `Invalid ${fieldName}.`);
  }
};

const getAssessmentByIdOrThrow = async (id) => {
  validateObjectId(id, "assessment ID");

  const assessment = await Assessment.findById(id);

  if (!assessment) {
    throw new ApiError(404, "Assessment not found.");
  }

  return assessment;
};

// --------------------------------------------------
// Create Assessment
// --------------------------------------------------

const createAssessment = async (data, teacherId) => {
  validateObjectId(data.classId, "class ID");
  validateObjectId(data.studentId, "student ID");
  validateObjectId(teacherId, "teacher ID");

  const existingAssessment = await Assessment.findOne({
    classId: data.classId,
    studentId: data.studentId,
    semester: data.semester,
  });

  if (existingAssessment) {
    throw new ApiError(
      409,
      "An assessment already exists for this student, class, and semester.",
    );
  }

  const assessment = await Assessment.create({
    ...data,
    teacherId,
  });

  return assessment;
};

// --------------------------------------------------
// Get All Assessments
// --------------------------------------------------

const getAllAssessments = async (query = {}) => {
  const {
    page = 1,
    limit = 20,
    classId,
    studentId,
    semester,
    courseLevel,
  } = query;

  const filter = {};

  if (classId) {
    validateObjectId(classId, "class ID");
    filter.classId = classId;
  }

  if (studentId) {
    validateObjectId(studentId, "student ID");
    filter.studentId = studentId;
  }

  if (semester) {
    filter.semester = semester;
  }

  if (courseLevel) {
    filter.courseLevel = courseLevel;
  }

  const skip = (page - 1) * limit;

  const [assessments, total] = await Promise.all([
    Assessment.find(filter)
      .populate("classId")
      .populate("studentId")
      .populate("teacherId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Assessment.countDocuments(filter),
  ]);

  return {
    assessments,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// --------------------------------------------------
// Get Assessment By ID
// --------------------------------------------------

const getAssessmentById = async (id) => {
  validateObjectId(id, "assessment ID");

  const assessment = await Assessment.findById(id)
    .populate("classId")
    .populate("studentId")
    .populate("teacherId", "name email");

  if (!assessment) {
    throw new ApiError(404, "Assessment not found.");
  }

  return assessment;
};

// --------------------------------------------------
// Get Assessments By Class
// --------------------------------------------------

const getAssessmentsByClass = async (classId, query = {}) => {
  validateObjectId(classId, "class ID");

  const { page = 1, limit = 20, semester, courseLevel } = query;

  const filter = { classId };

  if (semester) {
    filter.semester = semester;
  }

  if (courseLevel) {
    filter.courseLevel = courseLevel;
  }

  const skip = (page - 1) * limit;

  const [assessments, total] = await Promise.all([
    Assessment.find(filter)
      .populate("studentId")
      .populate("classId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Assessment.countDocuments(filter),
  ]);

  return {
    assessments,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// --------------------------------------------------
// Update Assessment
// --------------------------------------------------

const updateAssessment = async (id, data) => {
  validateObjectId(id, "assessment ID");

  const assessment = await Assessment.findByIdAndUpdate(
    id,
    {
      $set: data,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!assessment) {
    throw new ApiError(404, "Assessment not found.");
  }

  return assessment;
};

// --------------------------------------------------
// Update Overview Cell
// --------------------------------------------------

const updateOverviewCell = async (id, data) => {
  const assessment = await getAssessmentByIdOrThrow(id);

  const { category, unitNumber, grade, comment, factors } = data;

  let cell = assessment.overview.find(
    (item) => item.category === category && item.unitNumber === unitNumber,
  );

  if (!cell) {
    assessment.overview.push({
      category,
      unitNumber,
      grade: grade ?? "NI",
      comment: comment ?? "",
      factors,
    });

    cell = assessment.overview[assessment.overview.length - 1];
  } else {
    if (grade !== undefined) {
      cell.grade = grade;
    }

    if (comment !== undefined) {
      cell.comment = comment;
    }

    if (factors !== undefined) {
      cell.factors = factors;
    }
  }

  await assessment.save();

  return {
    assessmentId: assessment._id,
    category,
    unitNumber,
    cell,
  };
};

// --------------------------------------------------
// Update Session Cell
// --------------------------------------------------

const updateSessionCell = async (id, data) => {
  const assessment = await getAssessmentByIdOrThrow(id);

  const { sessionNumber, assessmentType, grade, comment } = data;

  const session = assessment.sessions.find(
    (item) => item.sessionNumber === sessionNumber,
  );

  if (!session) {
    throw new ApiError(404, "Session not found.");
  }

  const cell = session[assessmentType];

  if (!cell) {
    throw new ApiError(400, "Invalid assessment type.");
  }

  if (grade !== undefined) {
    cell.grade = grade;
  }

  if (comment !== undefined) {
    cell.comment = comment;
  }

  await assessment.save();

  return {
    assessmentId: assessment._id,
    sessionNumber,
    assessmentType,
    cell,
  };
};

// --------------------------------------------------
// Delete Assessment
// --------------------------------------------------

const deleteAssessment = async (id) => {
  validateObjectId(id, "assessment ID");

  const assessment = await Assessment.findByIdAndDelete(id);

  if (!assessment) {
    throw new ApiError(404, "Assessment not found.");
  }

  return assessment;
};

// --------------------------------------------------
// Export
// --------------------------------------------------

export default {
  createAssessment,
  getAllAssessments,
  getAssessmentById,
  getAssessmentsByClass,
  updateAssessment,
  updateOverviewCell,
  updateSessionCell,
  deleteAssessment,
};
