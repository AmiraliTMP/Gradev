import { Router } from "express";

import assessmentController from "./assessment.controller.js";

import authMiddleware from "../../middlewares/auth.middleware.js";
import validate from "../../middlewares/validate.middleware.js";

import {
  createAssessmentSchema,
  updateAssessmentSchema,
  updateOverviewCellSchema,
  updateSessionCellSchema,
} from "./assessment.validation.js";

const router = Router();

// --------------------------------------------------
// Authentication
// --------------------------------------------------

router.use(authMiddleware);

// --------------------------------------------------
// Assessment Routes
// --------------------------------------------------

// Create a new assessment
router.post(
  "/createAssessment",
  validate(createAssessmentSchema),
  assessmentController.createAssessment,
);

// Get all assessments
router.get("/getAllAssessments", assessmentController.getAllAssessments);

// Get an assessment by ID
router.get("/getAssessmentById/:id", assessmentController.getAssessmentById);

// Get assessments by class ID
router.get(
  "/getAssessmentsByClass/:classId",
  assessmentController.getAssessmentsByClass,
);

// Update an assessment
router.patch(
  "/updateAssessment/:id",
  validate(updateAssessmentSchema),
  assessmentController.updateAssessment,
);

// Update an overview grading cell
router.patch(
  "/updateOverviewCell/:id",
  validate(updateOverviewCellSchema),
  assessmentController.updateOverviewCell,
);

// Update a session grading cell
router.patch(
  "/updateSessionCell/:id",
  validate(updateSessionCellSchema),
  assessmentController.updateSessionCell,
);

// Delete an assessment
router.delete("/deleteAssessment/:id", assessmentController.deleteAssessment);

export default router;
