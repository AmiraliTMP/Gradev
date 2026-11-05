import { Router } from "express";

import validate from "../../middleware/validate.middleware.js";
import studentController from "./student.controller.js";

import {
  createStudentSchema,
  updateStudentSchema,
} from "./student.validation.js";

const router = Router();

router
  .route("/")
  .post(validate(createStudentSchema), studentController.create)
  .get(studentController.findAll);

router
  .route("/:id")
  .get(studentController.findById)
  .patch(validate(updateStudentSchema), studentController.update)
  .delete(studentController.delete);

export default router;
