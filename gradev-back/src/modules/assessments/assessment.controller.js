import assessmentService from "./assessment.service.js";

// --------------------------------------------------
// Create Assessment
// --------------------------------------------------

const createAssessment = async (req, res, next) => {
  try {
    const assessment = await assessmentService.createAssessment(
      req.body,
      req.user.userId,
    );

    return res.status(201).json({
      success: true,
      message: "Assessment created successfully.",
      data: assessment,
    });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------
// Get All Assessments
// --------------------------------------------------

const getAllAssessments = async (req, res, next) => {
  try {
    const result = await assessmentService.getAllAssessments(req.query);

    return res.status(200).json({
      success: true,
      message: "Assessments retrieved successfully.",
      data: result.assessments,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------
// Get Assessment By ID
// --------------------------------------------------

const getAssessmentById = async (req, res, next) => {
  try {
    const assessment = await assessmentService.getAssessmentById(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Assessment retrieved successfully.",
      data: assessment,
    });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------
// Get Assessments By Class
// --------------------------------------------------

const getAssessmentsByClass = async (req, res, next) => {
  try {
    const result = await assessmentService.getAssessmentsByClass(
      req.params.classId,
      req.query,
    );

    return res.status(200).json({
      success: true,
      message: "Class assessments retrieved successfully.",
      data: result.assessments,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------
// Update Assessment
// --------------------------------------------------

const updateAssessment = async (req, res, next) => {
  try {
    const assessment = await assessmentService.updateAssessment(
      req.params.id,
      req.body,
    );

    return res.status(200).json({
      success: true,
      message: "Assessment updated successfully.",
      data: assessment,
    });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------
// Update Overview Cell
// --------------------------------------------------

const updateOverviewCell = async (req, res, next) => {
  try {
    const result = await assessmentService.updateOverviewCell(
      req.params.id,
      req.body,
    );

    return res.status(200).json({
      success: true,
      message: "Overview cell updated successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------
// Update Session Cell
// --------------------------------------------------

const updateSessionCell = async (req, res, next) => {
  try {
    const result = await assessmentService.updateSessionCell(
      req.params.id,
      req.body,
    );

    return res.status(200).json({
      success: true,
      message: "Session cell updated successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------
// Delete Assessment
// --------------------------------------------------

const deleteAssessment = async (req, res, next) => {
  try {
    await assessmentService.deleteAssessment(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Assessment deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
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
