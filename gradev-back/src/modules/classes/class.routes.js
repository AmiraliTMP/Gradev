import { Router } from "express";

import authMiddleware from "../../middlewares/auth.middleware.js";
import validate from "../../middlewares/validate.middleware.js";

import classController from "./class.controller.js";
import { createClassSchema, updateClassSchema } from "./class.validation.js";

const router = Router();

// All class routes require authentication.
router.use(authMiddleware);

// CREATE
router.post(
  "/createClass",
  validate(createClassSchema),
  classController.create,
);

// READ ALL
router.get("/getAllClasses", classController.findAll);

// READ ONE
router.get("/getClassById/:id", classController.findById);

// UPDATE
router.patch(
  "/updateClass/:id",
  validate(updateClassSchema),
  classController.update,
);

// DELETE
router.delete("/deleteClass/:id", classController.delete);

export default router;
