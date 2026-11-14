import { Router } from "express";

import validate from "../../middlewares/validate.middleware.js";
import classController from "./class.controller.js";

import { createClassSchema, updateClassSchema } from "./class.validation.js";

const router = Router();

// Create a new class
router.post(
  "/createClass",
  validate(createClassSchema),
  classController.create,
);

// Get all classes
router.get("/getAllClasses", classController.findAll);

// Get a class by ID
router.get("/getClassById/:id", classController.findById);

// Update a class
router.patch(
  "/updateClass/:id",
  validate(updateClassSchema),
  classController.update,
);

// Delete a class
router.delete("/deleteClass/:id", classController.delete);

export default router;
